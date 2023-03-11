import { getSlot } from '../_utils/vue/slots'
import { createZIndexMixin } from '../_context/mixins/zIndex'
import { teleportMixin } from '../_mixins/teleport'
import { createLockMixin } from '../_context/mixins/lock'
import { addRouteListener } from '../_utils/vue/component'
import { props } from './props'
import Teleport from '../teleport'
import { NOOP } from '../_utils/shared'
import { mergeStyles } from '../_utils/vue/mergeData'

import '../_styles/common.less'
import './popup.less'

export default {
  name: 'SmyPopup',
  inheritAttrs: false,
  mixins: [createZIndexMixin('show', 3), teleportMixin, createLockMixin('show', 'lockScroll')],
  props,
  watch: {
    show(newValue) {
      const { $listeners } = this
      newValue ? $listeners?.open?.() : $listeners?.close?.()
    },
  },
  created() {
    addRouteListener(this, () => this.$emit('route-change'))
  },
  methods: {
    hidePopup() {
      this.$emit('click-overlay')
      if (!this.closeOnClickOverlay) return
      this.$emit('update:show', false)
    },
    renderContent() {
      const style = mergeStyles({ zIndex: this.zIndex }, this.contentStyle)
      return (
        <div
          class={['smy-popup__content', `smy-popup__content--${this.position}`, this.$attrs.class, this.contentClass]}
          style={style}
          {...{ attrs: this.$attrs }}
        >
          {getSlot(this)}
        </div>
      )
    },
    renderPopup() {
      const { $listeners } = this
      return (
        <transition name="smy-fade" onAfterEnter={$listeners?.opened ?? NOOP} onAfterLeave={$listeners?.closed ?? NOOP}>
          <div v-show={this.show} style={{ zIndex: this.zIndex - 2 }} class="smy--box smy-popup">
            {this.overlay && this.renderOverlay()}
            <transition name={this.transition || `smy-pop-${this.position}`}>
              {this.show && this.renderContent()}
            </transition>
          </div>
        </transition>
      )
    },
    renderOverlay() {
      const style = mergeStyles({ zIndex: this.zIndex - 1 }, this.overlayStyle)
      return <div class={['smy-popup__overlay', this.overlayClass]} style={style} onClick={this.hidePopup}></div>
    },
  },
  render() {
    return this.teleport ? (
      <Teleport to={this.teleport} disabled={this.teleportDisabled}>
        {this.renderPopup()}
      </Teleport>
    ) : (
      this.renderPopup()
    )
  },
}
