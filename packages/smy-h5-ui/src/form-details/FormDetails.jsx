import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import '../_styles/transition.less'
import './formDetails.less'

const [name, bem] = createNamespace('form-details')

const ERROR_MESSAGE = 'error-message'
const EXTRA_MESSAGE = 'extra-message'

export default {
  name,
  functional: true,
  props,
  render(h, { slots, props }) {
    const transition = 'smy-fade'
    slots = slots()

    const className = bem()
    const renderErrorMessage = () => {
      const { errorMessage } = props
      const content = slots[ERROR_MESSAGE] || (errorMessage && h('div', [errorMessage]))
      return h('div', { class: bem(ERROR_MESSAGE) }, [
        h('transition', { name: transition }, content ? [content] : null),
      ])
    }

    const renderExtraMessage = () => {
      const { extraMessage } = props
      const content = slots[EXTRA_MESSAGE] || extraMessage
      return h(
        'transition',
        { name: transition },
        content ? [h('div', { class: bem(EXTRA_MESSAGE) }, [content])] : null
      )
    }

    const renderMessage = () => {
      const errorMessageVnode = renderErrorMessage()
      const extraMessageVnode = renderExtraMessage()
      if (!errorMessageVnode && !extraMessageVnode) {
        return null
      }
      return [h('div', { class: className }, [errorMessageVnode, extraMessageVnode])]
    }
    return h('transition', { name: transition }, renderMessage())
  },
}
