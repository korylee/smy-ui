import { ComponentInternalInstance, Ref, computed, getCurrentInstance, ref, toRaw, watch } from 'vue'
import { kebabCase } from '../_utils/shared'
import { throwError } from '../_utils/smy/warn'

export function useProxiedModel<
  Props extends object & { [key in Prop as `onUpdate:${Prop}`]: (val: any) => void | undefined },
  Prop extends Extract<keyof Props, string>,
  Inner = Props[Prop]
>(
  props: Props,
  prop: Prop,
  options: {
    passive?: boolean
    transformIn: (value?: Props[Prop]) => Inner
    transformOut: (value: Inner) => Props[Prop]
  } = {
    passive: true,
    transformIn: (v: any) => v,
    transformOut: (v: any) => v,
  }
) {
  const vm = getCurrentInstance()
  if (!vm) {
    return throwError('useProxiedModel', 'must be called from inside a setup function')
  }
  const { passive, transformIn, transformOut } = options

  let getExternalValue = () => props[prop]

  if (passive) {
    const internal = ref(props[prop]) as Ref<Props[Prop]>
    watch(
      () => props[prop],
      (val) => {
        internal.value = val
      }
    )

    getExternalValue = () => internal.value
  }

  const model = computed({
    get() {
      const externalValue = getExternalValue()
      return transformIn(externalValue)
    },
    set(internalValue) {
      const newValue = transformOut(internalValue)
      const externalValue = getExternalValue()
      const value = toRaw(externalValue)
      if (value === newValue || transformIn(value) === internalValue) {
        return
      }
      vm.emit(`update:${prop}`, newValue)
    },
  })
  Object.defineProperty(model, 'externalValue', {
    get: getExternalValue,
  })
  return model
}

export function isControlledProp(vm: ComponentInternalInstance, prop: string) {
  const propArr = [prop]
  const kebabProp = kebabCase(prop)
  if (kebabProp !== prop) {
    propArr.push(kebabProp)
  }
  const props = vm.vnode.props
  if (!props) return false
  const hasOwnProperty = Object.prototype.hasOwnProperty
  return propArr.some((prop) => hasOwnProperty.call(props, prop) && hasOwnProperty.call(props, `onUpdate:${prop}`))
}
