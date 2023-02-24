export const InjectionKey = 'smy-config-provider-inject-key'

export const createGetMergedProp =
  (namespace: string) =>
  (vm: any, name: string, defaultValue: any): any =>
    vm[name] ?? vm[InjectionKey]?.[namespace]?.[name] ?? defaultValue
