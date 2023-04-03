
export const isString = (val) => typeof val === 'string'

export const isNumber = (val) => typeof val === 'number'

export const isBool = (val) => typeof val === 'boolean'

export const isNill = (val) => val == null

export const isNumString = (str) => isString(str) && /^\d+$/.test(str)
