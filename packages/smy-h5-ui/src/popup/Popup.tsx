import { Teleport, Transition, defineComponent, ref, watch } from 'vue'
import { createNamespace } from '../_utils/vue/create'
import { useZIndex } from '../composables/useZIndex'
import { props } from './props'
import { useInitialized } from '../composables/useInitialized'
import { useLockScroll } from '../composables/useLockScroll'
import { useRouteListener } from '../composables/useRouteListener'

import '../_styles/common.less'
import '../_styles/transition.less'
import './popup.less'

const [name, bem] = createNamespace('popup')

export default defineComponent({
  name,
  props,
  emits: ['routeChange', 'clickOverlay', 'update:show', 'opened', 'closed', 'open', 'close'],
  setup(props, { slots, attrs, emit }) {
    const popupRef = ref()
    const rendered = useInitialized(() => props.show)
    const zIndex = useZIndex(() => props.show, 2)

    useLockScroll(popupRef, () => props.show && props.lockScroll)
    useRouteListener(() => emit('routeChange'))

    const onOpened = () => emit('opened')
    const onClosed = () => emit('closed')
    const onClickOverlay = () => {
      const { closeOnClickOverlay } = props
      emit('clickOverlay')
      if (!closeOnClickOverlay) {
        return
      }
      emit('update:show', false)
    }

    watch(
      () => props.show,
      (show) => {
        emit(show ? 'open' : 'close')
      }
    )

    const renderOverlay = () => {
      return (
        <div
          class={[bem('overlay'), props.overlayClass]}
          style={[{ zIndex: zIndex.value - 1 }, props.overlayStyle!]}
          onClick={onClickOverlay}
        />
      )
    }
    const renderContent = () => (
      <div v-show={props.show} class={bem('content', props.position)} style={{ zIndex: zIndex.value }} {...attrs}>
        {rendered.value && slots.default?.()}
      </div>
    )
    const renderPopup = () => (
      <Transition name={'smy-fade'} onAfterEnter={onOpened} onAfterLeave={onClosed}>
        <div v-show={props.show} class={[bem(), 'smy--box']} style={{ zIndex: zIndex.value - 2 }}>
          {props.overlay && renderOverlay()}
          <Transition name={props.transition || `smy-pop-${props.position}`}>{renderContent()}</Transition>
        </div>
      </Transition>
    )

    return () => {
      const { teleport } = props
      if (teleport) {
        return <Teleport to={teleport}>{renderPopup()}</Teleport>
      }
      return renderPopup()
    }
  },
})
