export const InjectionKey = 'smy-config-provider-inject-key'

export const createGetMergedProp = (namespace: string) => (vm: unknown, name: string) =>
  vm[name] ?? vm[InjectionKey]?.[namespace]?.[name]
