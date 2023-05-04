import { throwError } from '../_utils/smy/warn'

interface ProxiedModelOptions {
  passive?: boolean
  event?: string
}

export function createProxiedModel(prop: string, proxy: string, options: ProxiedModelOptions = {}): any {
  const { passive = true, event = 'input' } = options
  if (!prop) throwError('createProxiedModel', 'prop 不能为空')
  const getValue = (vm: any) => vm[prop]
  if (!passive) {
    return {
      computed: {
        [proxy]: {
          get() {
            return getValue(this)
          },
          set(val: unknown) {
            const vm: any = this
            if (val === getValue(vm)) return
            vm.$emit(event, val)
          },
        },
      },
    }
  }
  return {
    data: (vm: any) => ({
      [proxy]: getValue(vm),
    }),
    watch: {
      [prop]() {
        this[proxy] = getValue(this)
      },
      [proxy](val: unknown) {
        const vm: any = this
        vm.$emit(event, val)
      },
    },
  }
}
