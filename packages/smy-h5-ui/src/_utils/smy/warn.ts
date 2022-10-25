export function warn(location: string, message: string): void {
  console.error(`[smy-h5/${location}]: ${message}`)
}

export function throwError(location: string, message: string): never {
  throw new Error(`[smy-h5/${location}]: ${message}`)
}
