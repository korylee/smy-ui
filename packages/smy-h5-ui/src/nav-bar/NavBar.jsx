import { BORDER_BOTTOM, ELLIPSIS, HAPTICS_FEEDBACK } from '../_utils/contant'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import ArrowLeft from '@smy-h5/icons/dist/es/ArrowLeft'
import SmyIcon from '../icon'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import { getRect } from '@smy-h5/shared'

import '../_styles/common.less'
import './navBar.less'

const [name, bem] = createNamespace('nav-bar')

export default {
  name,
  props,
  mounted() {
    const { setHeight } = this
    this.$nextTick(setHeight)
    for (let i = 0; i < 3; i++) {
      setTimeout(setHeight, 100 * i)
    }
    const windowSize = useWindowSize()
    this.$watch(() => windowSize, setHeight, { deep: true })
  },
  methods: {
    setHeight() {
      const { root, placeholder } = this.$refs
      if (!root || !placeholder) {
        return
      }
      const { height } = getRect(root)
      placeholder.style.height = height + 'px'
    },
    renderContent() {
      const _vm = this
      const { fixed, leftDisabled, clickable, rightDisabled } = _vm
      const _h = _vm.$createElement

      const renderLeft = () => {
        const leftSlot = _vm._t('left')
        if (leftSlot) {
          return leftSlot
        }
        const { leftArrow, leftText } = _vm
        if (!leftArrow && !leftText) {
          return null
        }
        return [
          leftArrow && <SmyIcon name={leftArrow === true ? ArrowLeft : leftArrow} class={bem('arrow')} />,
          leftText && <span class={bem('text')}>{leftText}</span>,
        ]
      }

      const renderRight = () => {
        const rightSlot = _vm._t('right')
        if (rightSlot) {
          return rightSlot
        }
        const { rightText } = _vm
        if (!rightText) {
          return null
        }
        return <span class={bem('text')}>{rightText}</span>
      }

      const onClickLeft = (event) => {
        if (!leftDisabled) {
          _vm.$emit('click-left', event)
        }
      }
      const onClickRight = (event) => {
        if (!_vm.rightDisabled) {
          _vm.$emit('click-right', event)
        }
      }

      const leftVNode = renderLeft()
      const rightVNode = renderRight()

      return (
        <div ref="root" class={bem({ fixed, '$--safe-area-top': _vm.safeAreaInsetTop, [BORDER_BOTTOM]: _vm.border })}>
          <div class={bem('content')}>
            {leftVNode &&
              _h(
                'div',
                {
                  class: bem('left', { disabled: leftDisabled, [HAPTICS_FEEDBACK]: clickable && !leftDisabled }),
                  on: { click: onClickLeft },
                },
                [leftVNode],
              )}
            <div class={bem('title', ELLIPSIS)}>{_vm._t('title', () => _vm.title)}</div>
            {rightVNode &&
              _h(
                'div',
                {
                  class: bem('right', { disabled: rightDisabled, [HAPTICS_FEEDBACK]: clickable && !rightDisabled }),
                  on: { click: onClickRight },
                },
                [rightVNode],
              )}
          </div>
        </div>
      )
    },
  },
  render() {
    const _vm = this
    const { renderContent } = _vm

    if (_vm.fixed && _vm.placeholder) {
      return (
        <div ref="placeholder" class={bem('placeholder')}>
          {renderContent()}
        </div>
      )
    }

    return renderContent()
  },
}
