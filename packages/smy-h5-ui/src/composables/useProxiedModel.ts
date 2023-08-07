import { ComponentInternalInstance, Ref, computed, getCurrentInstance, ref, toRaw, watch } from 'vue'
import { kebabCase } from '../_utils/shared'
import { throwError } from '../_utils/smy/warn'

export function useProxiedModel<
  Props extends object & { [key in Prop as `onUpdate:${Prop}`]?: (val: any) => void | undefined },
  Prop extends Extract<keyof Props, string>,
  Inner = Props[Prop]
>(
  props: Props,
  prop: Prop,
  options: {
    passive?: boolean
    defaultValue?: Props[Prop]
    transformIn?: (value?: Props[Prop]) => Inner
    transformOut?: (value: Inner) => Props[Prop]
  } = {}
) {
  const vm = getCurrentInstance()
  if (!vm) {
    return throwError('useProxiedModel', 'must be called from inside a setup function')
  }
  const { passive = true, transformIn = (v: any) => v, transformOut = (v: any) => v, defaultValue } = options

  let getValue = () => props[prop]
  let setValue = (value: Props[Prop]) => {
    vm.emit(`update:${prop}`, value)
  }

  if (passive) {
    const internal = ref(transformOut((props[prop] ?? defaultValue) as Inner)) as Ref<Props[Prop]>
    watch(
      () => props[prop],
      (val) => {
        internal.value = val
      }
    )

    getValue = () => internal.value
    setValue = (value: Props[Prop]) => {
      internal.value = value
      vm.emit(`update:${prop}`, value)
    }
  }

  const model = computed({
    get() {
      const externalValue = getValue()
      return transformIn(externalValue)
    },
    set(internalValue) {
      const newValue = transformOut(internalValue)
      const externalValue = getValue()
      const value = toRaw(externalValue)
      if (value === newValue || transformIn(value) === internalValue) {
        return
      }
      setValue(newValue)
    },
  })
  Object.defineProperty(model, 'externalValue', {
    get: getValue,
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
