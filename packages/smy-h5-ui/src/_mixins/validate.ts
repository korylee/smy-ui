import Vue, { ComponentOptions, PropType } from 'vue'
import { createChildrenMixin, createParentMixin, createGetProp } from './relation'
import { validate } from '../_utils/validate'
import { GenericValidateFunction } from '../_utils/validate/validate'

const PROVIDER_FIELD = '$_vProviders'
const OBSERVER_FIELD = '$_vObserver'

type ObserverNode = Vue & {
  $_vProviders: ProviderNode[]
  _reset: () => void
  _validate: ObserverValidate<any>
}

type ObserverValidate<T> = (validate: (provider: ProviderNode) => T) => T[] | undefined

type ProviderNode = Vue & {
  $_vObserver: ObserverNode
  _reset: () => void
  _errorMessage: string
  _validate: (value: any) => Promise<any>
  validate?: () => Promise<any>
  rules: ProviderRules
}

export function getPropComputed(this: Vue) {
  return createGetProp(this, OBSERVER_FIELD)
}

export const ValidateObserver: ComponentOptions<ObserverNode> = {
  mixins: [createParentMixin(OBSERVER_FIELD, { children: PROVIDER_FIELD })],
  methods: {
    _reset() {
      const providers = this[PROVIDER_FIELD]
      providers.forEach((ref) => ref._reset())
    },
    _validate(validate: (provider: ProviderNode) => Promise<any> | undefined = (p) => p.validate?.()) {
      const providers = this[PROVIDER_FIELD]
      const tasks: Promise<any>[] = []
      const errors: any[] = []
      providers.forEach((provider) => {
        const task = (() => {
          return validate(provider)?.then((res) => {
            if (res === undefined || res === true) return
            errors.push(res)
          })
        })()

        task && tasks.push(task)
      })
      return Promise.all(tasks).then(() => {
        if (errors.length) {
          return errors
        }
        return
      })
    },
  },
}

type ProviderRules = string | Record<string, unknown | unknown[]> | GenericValidateFunction | GenericValidateFunction[]

export const validateProviderProp = {
  rules: [Function, String, Object, Array] as PropType<ProviderRules>,
}

export const ValidateProvider: ComponentOptions<ProviderNode> = {
  mixins: [createChildrenMixin(OBSERVER_FIELD, { sort: false, children: PROVIDER_FIELD })],
  data: () => ({ _errorMessage: '' }),
  methods: {
    _validate(value: any) {
      const vm = this
      const { rules } = vm
      return validate(value, rules).then((res) => {
        const { valid, errors } = res
        if (!valid) {
          const [message] = errors
          vm._errorMessage = message
          return res
        }

        valid && (vm._errorMessage = '')
        return res
      })
    },
    _reset() {
      ;(this as any)._errorMessage = ''
    },
  },
}
