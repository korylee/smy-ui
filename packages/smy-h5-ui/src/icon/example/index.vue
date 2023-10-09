<template>
  <div class="icon-example">
    <div class="app-demo-title">图标尺寸</div>
    <div>
      <smy-icon size="15" name="window-close" />
      <smy-icon size="30" name="window-close" />
    </div>
    <div class="app-demo-title">图标颜色</div>
    <div>
      <smy-icon color="#2979ff" size="15" name="window-close" />
      <smy-icon color="#2979ff" size="30" name="window-close" />
    </div>
    <div class="app-demo-title">使用图片</div>
    <div>
      <smy-icon name="https://korylee.github.io/blog/avatar.png" size="30" />
    </div>
    <div class="app-demo-title">图标切换动画</div>
    <div>
      <smy-icon color="#2979ff" size="40" :transition="300" :name="kebabCase(iconName)" @click="toggle" />
      <smy-icon color="#2979ff" size="40" :transition="300" :name="icons[iconName]" @click="toggle" />
    </div>
    <div class="app-demo-title">组件引入使用</div>
    <div class="icon-example__icons">
      <div class="icon-example__icon" v-for="icon of iconList" :key="icon.name" @click="handleCopySvgIcon(icon.name)">
        <smy-icon size="35">
          <component :is="icon.value" />
        </smy-icon>
      </div>
    </div>
    <div class="app-demo-title">iconfont使用</div>
    <div class="icon-example__icons">
      <div class="icon-example__icon" v-for="icon of iconList" :key="icon.name" @click="handleCopyIconFont(icon.name)">
        <smy-icon :name="icon.name" size="35" />
      </div>
    </div>
  </div>
</template>

<script>
import SmyIcon from '../'
import * as icons from '@smy-h5/icons'
import { kebabCase } from 'lodash-es'

function handleCopy(text = '') {
  const isSupported = !!document.queryCommandSupported && !!document.queryCommandSupported('copy')
  if (!isSupported) return false
  const inputId = 'copy-input-el'
  try {
    /**
     * @type {HTMLTextAreaElement}
     */
    let copyInputEl = document.getElementById(inputId)
    if (!copyInputEl) {
      copyInputEl = document.createElement('textarea')
      copyInputEl.id = inputId
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl'
      // Prevent zooming on iOS
      copyInputEl.style.fontSize = '12pt'
      // Reset box model
      copyInputEl.style.border = '0'
      copyInputEl.style.padding = '0'
      copyInputEl.style.margin = '0'
      // Move element out of screen horizontally
      copyInputEl.style.position = 'absolute'
      copyInputEl.style[isRTL ? 'right' : 'left'] = '-9999px'
      // Move element to the same position vertically
      const yPosition = window.pageYOffset || document.documentElement.scrollTop
      copyInputEl.style.top = `${yPosition}px`
      copyInputEl.setAttribute('readonly', '')
      document.body.appendChild(copyInputEl)
    }
    copyInputEl.value = text
    // copyInputEl.focus();
    copyInputEl.setSelectionRange(0, text.length)
    copyInputEl.select()
    return document.execCommand('copy')
  } catch (e) {
    return false
  }
}

const iconList = Object.keys(icons).map((iconName) => {
  return {
    value: icons[iconName],
    name: kebabCase(iconName),
  }
})

export default {
  name: 'IconExample',
  components: { SmyIcon },
  data: () => ({
    iconName: 'Plus',
  }),
  computed: {
    icons: () => icons,
    iconList: () => iconList,
  },
  methods: {
    kebabCase,
    toggle() {
      this.iconName = this.iconName === 'Plus' ? 'Minus' : 'Plus'
    },
    handleCopySvgIcon(name) {
      const text = `<smy-icon><${name} /></smy-icon>`
      const res = handleCopy(text)
      alert(res ? `${text}复制成功！\n请按需引入该图标【${name}】` : `复制失败`)
    },
    handleCopyIconFont(name) {
      const text = `<smy-icon name="${name}" />`
      const res = handleCopy(text)
      alert(res ? `${text} 复制成功！` : `复制失败`)
    },
  },
}
</script>

<style lang="less" scoped>
@import '@smy-h5/icons/css';

.icon-example {
  &__icons {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  &__icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 29%;
    padding: 6% 5%;
    margin: 0 2% 4%;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
    border-bottom: 2px solid var(--site-color-primary);
    transition: background-color 0.25s;
    box-sizing: border-box;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
  }
}
</style>
