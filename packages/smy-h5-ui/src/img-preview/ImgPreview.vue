<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="img-preview-wrap"
      ref="img-preview"
      @mouseup="removeMove('pc')"
      @touchend="removeMove('mobile')"
      @click.stop="clickMask"
    >
      <div class="img-wrap">
        <img
          ref="img-view"
          v-show="imgState === 2"
          :src="imgurl"
          :style="imgStyle"
          @click.stop=""
          @mousedown="addMove"
          @touchstart="addMoveMobile"
          class="img-view"
        />
      </div>
    </div>
  </transition>
</template>

<script>
const defaultMaxWh = 'max-width:98%;max-height:98%;'

export default {
  name: 'ImgPreview',
  data: () => ({
    visible: false,
    imgScale: 1,
    imgTop: 0,
    imgLeft: 0,
    imgRotate: 0,
    isFull: false,
    maxWH: defaultMaxWh,
    clientX: 0,
    clientY: 0,
    imgIndex: 0,
    canRun: true,
    imgurl: '',
    imgState: 1,
    start: [{}, {}],
    mobileScale: 0, // 手指离开时图片的缩放比例
    // 以下内容为用户传入配置
    // show: true, // 插件显示，默认为false
    url: '', // 预览图片的地址
    nowImgIndex: 0,
    multiple: false,
    imgList: [],
    // 以下为可全局配置
    controlBar: false,
    closeBtn: false,
    arrowBtn: false,
    keyboard: false,
    clickMaskCLose: true, // 是否点击遮罩关闭，默认true
  }),
  computed: {
    imgStyle({ imgScale, imgTop, imgLeft, maxWH, imgRotate }) {
      return (
        `transform: scale(${imgScale}) rotate(${imgRotate}deg);margin-top:${imgTop}px;margin-left:${imgLeft}px;` + maxWH
      )
    },
  },
  watch: {
    url() {
      this.initImg()
    },
    visible: {
      immediate: true,
      handler(newVisible) {
        if (!newVisible) return
        this.$nextTick(() => {
          const imgRef = this.$refs['img-preview']
          imgRef && (imgRef.onmousewheel = this.scrollFunc)
        })
        // 火狐浏览器没有onmousewheel事件，用DOMMouseScroll代替(滚轮事件)
        document.body.addEventListener('DOMMouseScroll', this.scrollFunc)
        // 禁止火狐浏览器下拖拽图片的默认事件
        document.ondragstart = () => false
        if (this.multiple) {
          if (Array.isArray(this.imgList) && this.imgList.length > 0) {
            this.imgIndex = Number(this.nowImgIndex) || 0
            this.changeUrl(this.imgList[this.imgIndex], this.imgIndex)
          }
        } else {
          this.changeUrl(this.url)
        }
        // 判断是否开启键盘事件
        if (this.keyboard) {
          document.addEventListener('keydown', this.keyHandleDebounce)
        }
      },
    },
  },
  mounted() {
    this.initImg()
  },
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.initImg()
      // 移除火狐浏览器下的鼠标滚动事件
      document.body.removeEventListener('DOMMouseScroll', this.scrollFunc)
      //恢复火狐及Safari浏览器下的图片拖拽
      document.ondragstart = null
      // 移除键盘事件
      if (this.keyboard) {
        document.removeEventListener('keydown', this.keyHandleDebounce)
      }
      this.visible = false
    },
    initImg() {
      this.mobileScale = 1
      this.imgScale = 1
      this.imgRotate = 0
      this.imgTop = 0
      this.imgLeft = 0
    },
    /**
     * 切换图片
     * @param {boolean} bool true下一张 false 上一张
     */
    toogleImg(bool) {
      if (bool) {
        this.imgIndex++
        if (this.imgIndex > this.imgList.length - 1) {
          this.imgIndex = 0
        }
      } else {
        this.imgIndex--
        if (this.imgIndex < 0) {
          this.imgIndex = this.imgList.length - 1
        }
      }
      this.changeUrl(this.imgList[this.imgIndex], this.imgIndex)
    },
    /**
     * 改变图片地址
     * @param {string} url 要显示的图片的url
     * @param {number} index 当前显示当图片下标，防止用户点击切换图片过快
     */
    changeUrl(url, index) {
      this.imgState = 1
      const img = new Image()
      img.src = url
      // 如果加载出来图片当下标不是当前显示图片当下标，则不予显示（用户点击过快当时候，会出现用户点到第三张了，此时第一张图片才加载完当情况）
      const getIsCurrent = () => (index != undefined && index == this.imgIndex) || index == undefined
      img.onload = () => {
        if (getIsCurrent()) {
          this.imgState = 2
          this.imgurl = url
        }
      }
      img.onerror = () => {
        if (getIsCurrent()) {
          this.imgState = 3
        }
      }
    },
    rotateFunc(deg) {
      this.imgRotate += deg
    },
    /**
     * 图片缩放
     * @param {number} num
     * @param {boolean} bool
     */
    scaleFunc(num, bool) {
      if (this.imgScale <= 0.2 && num < 0) return
      if (bool) {
        this.imgScale = num
      } else {
        this.imgScale += num
      }
    },
    /**
     * 图片原尺寸切放
     */
    imgToogle() {
      this.initImg()
      this.maxWH = this.isFull ? defaultMaxWh : ''
      this.isFull = !this.isFull
    },
    scrollFunc(e) {
      e = e || window.event
      // 火狐下没有wheelDelta，用detail代替，由于detail值的正负和wheelDelta相反，所以取反
      e.delta = e.wheelDelta || -e.detail
      e.preventDefault()
      if (e.delta > 0) {
        this.scaleFunc(0.05)
      } else if (e.delta < 0) {
        this.scaleFunc(-0.05)
      }
    },
    // 鼠标按下
    addMove(e) {
      e = e || window.event
      this.clientX = e.clientX
      this.clientY = e.clientY
      const imgRef = this.$refs['img-preview']
      if (!imgRef) return
      imgRef.onmousemove = this.moveFunc
    },
    moveFunc(e) {
      e = e || window.event
      e.preventDefault()
      const movementX = e.clientX - this.clientX
      const movementY = e.clientY - this.clientY
      this.imgLeft += movementX * 2
      this.imgTop += movementY * 2
      this.clientX = e.clientX
      this.clientY = e.clientY
    },
    // 手指下按
    addMoveMobile(e) {
      e = e || window.event
      e.preventDefault()
      if (e.touches.length > 1) {
        this.start = e.touches
      } else {
        this.clientX = e.touches[0].pageX
        this.clientY = e.touches[0].pageY
      }
      const imgRef = this.$refs['img-preview']
      if (!imgRef) return
      // 添加手指拖动事件
      imgRef.ontouchmove = this.moveFuncMobile
    },
    // 手指拖动
    moveFuncMobile(e) {
      e = e || window.event
      if (e.touches.length > 1) {
        const touches = e.touches
        const scale = this.getDistance(touches[0], touches[1]) / this.getDistance(this.start[0], this.start[1])
        // 判断是否手指缩放过，如果缩放过，要在上次缩放的比例基础上进行缩放
        if (this.mobileScale) {
          if (scale > 1) {
            this.scaleFunc(scale + this.mobileScale - 1, true)
          } else {
            this.scaleFunc(scale * this.mobileScale, true)
          }
        } else {
          this.scaleFunc(scale, true)
        }
      } else {
        const touch = e.touches[0]
        e.preventDefault()
        const movementX = touch.pageX - this.clientX
        const movementY = touch.pageY - this.clientY
        this.imgLeft += movementX * 2
        this.imgTop += movementY * 2
        this.clientX = touch.pageX
        this.clientY = touch.pageY
      }
    },
    removeMove(type) {
      const imgRef = this.$refs['img-preview']
      if (type === 'pc') {
        imgRef && (imgRef.onmousemove = null)
      } else {
        this.mobileScale = this.imgScale
        imgRef && (imgRef.ontouchmove = null)
      }
    },
    keyHandleDebounce(e) {
      if (this.canRun) {
        // 如果this.canRun 为true证明当前可执行函数
        this.keyHandle(e)
        this.canRun = false
        setTimeout(() => {
          this.canRun = true
        }, 300)
      }
    },
    keyHandle(e) {
      e = window.event || e
      const key = e.keyCode || e.which || e.charCode
      switch (key) {
        case 27: //esc
          this.close()
          break
        case 65: // a键，上一张
          if (this.multiple) {
            this.toogleImg(false)
          }
          break
        case 68: //d键 下一张
          if (this.multiple) {
            this.toogleImg(true)
          }
          break
        case 87: // w键-放大
          this.scaleFunc(0.15)
          break
        case 83: // s键-缩小
          this.scaleFunc(-0.15)
          break
        case 81: // q键-逆时针旋转
          this.rotateFunc(-90)
          break
        case 69: // e键-顺时针旋转
          this.rotateFunc(90)
          break
        case 82: // r键-复位键
          this.initImg()
          break
        default:
          break
      }
    },
    // 点击遮罩层
    clickMask() {
      if (this.clickMaskCLose) {
        this.close()
      }
    },
    // 求两点间的距离 勾股定理
    getDistance(p1, p2) {
      const x = p2.pageX - p1.pageX
      const y = p2.pageY - p1.pageY
      return Math.sqrt(x * x + y * y)
    },
    downloadIamge() {
      //下载图片地址和图片名
      const image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        const a = document.createElement('a') // 生成一个a元素
        const event = new MouseEvent('click') // 创建一个单击事件
        a.download = 'photo' + +new Date() // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.onerror = function (err) {
        console.log('图片信息不正确或图片服务器禁止访问')
        console.log(err)
      }
      if (this.multiple) {
        image.src = this.imgList[this.imgIndex]
      } else {
        image.src = this.url
      }
    },
  },
}
</script>

<style lang="less">
@import './img-preview.less';
</style>
