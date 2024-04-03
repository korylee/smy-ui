import { isArray } from '@smy-h5/shared'

const re =
  // eslint-disable-next-line
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validate = (value: string) => re.test(value)

export function validator(value: string | string[]) {
  if (isArray(value)) {
    return value.every((val) => validate(String(val)))
  }
  return validate(String(value))
}

export default { validator }
