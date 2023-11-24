export const IconCache = (() => {
  const IconMap: Record<string, any> = {}

  function resolve(name: string) {
    return IconMap[name]
  }

  function use(name: string, component: any): void {
    if (!component) {
      return
    }
    IconMap[name] = component
  }
  return {
    resolve,
    use,
  }
})()
