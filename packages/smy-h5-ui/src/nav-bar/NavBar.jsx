import { BORDER_BOTTOM, ELLIPSIS, HAPTICS_FEEDBACK } from '../_utils/contant'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import ArrowLeft from '@smy-h5/icons/dist/es/ArrowLeft'
import SmyIcon from '../icon'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import { getRect } from '@smy-h5/shared'
import { defineComponent, h, nextTick, onMounted, ref, watch } from 'vue'

import '../_styles/common.less'
import './navBar.less'

const [name, bem] = createNamespace('nav-bar')

export default defineComponent({
  name,
  props,
  setup(props, { slots, emit }) {
    const root = ref()
    const placeholder = ref()
    const setHeight = () => {
      if (!root.value || !placeholder.value) {
        return
      }
      const { height } = getRect(root.value)
      placeholder.value.style.height = height + 'px'
    }
    onMounted(() => {
      nextTick(setHeight)
      for (let i = 0; i < 3; i++) {
        setTimeout(setHeight, 100 * i)
      }
      const windowSize = useWindowSize()
      watch(() => windowSize, setHeight, { deep: true })
    })

    const onClickLeft = (event) => {
      if (!props.leftDisabled) {
        emit('click-left', event)
      }
    }
    const onClickRight = (event) => {
      if (!props.rightDisabled) {
        emit('click-right', event)
      }
    }

    const renderLeft = () => {
      const leftSlot = slots.left?.()
      if (leftSlot) {
        return leftSlot
      }
      const { leftArrow, leftText } = props
      if (!leftArrow && !leftText) {
        return null
      }
      return [
        leftArrow && <SmyIcon name={leftArrow === true ? ArrowLeft : leftArrow} class={bem('arrow')} />,
        leftText && <span class={bem('text')}>{leftText}</span>,
      ]
    }

    const renderRight = () => {
      const rightSlot = slots.right?.()
      if (rightSlot) {
        return rightSlot
      }
      const { rightText } = props
      if (!rightText) {
        return null
      }
      return <span class={bem('text')}>{rightText}</span>
    }

    const renderContent = () => {
      const { fixed, leftDisabled, clickable, rightDisabled } = props
      const leftVNode = renderLeft()
      const rightVNode = renderRight()
      return (
        <div
          ref="root"
          class={bem({ fixed, '$--safe-area-top': props.safeAreaInsetTop, [BORDER_BOTTOM]: props.border })}
        >
          <div class={bem('content')}>
            {leftVNode &&
              h(
                'div',
                {
                  class: bem('left', { disabled: leftDisabled, [HAPTICS_FEEDBACK]: clickable && !leftDisabled }),
                  on: { click: onClickLeft },
                },
                [leftVNode],
              )}
            <div class={bem('title', ELLIPSIS)}>{slots.title ? slots.title() : props.title}</div>
            {rightVNode &&
              h(
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
    }

    return () => {
      if (props.fixed && props.placeholder) {
        return (
          <div ref="placeholder" class={bem('placeholder')}>
            {renderContent()}
          </div>
        )
      }

      return renderContent()
    }
  },
})
