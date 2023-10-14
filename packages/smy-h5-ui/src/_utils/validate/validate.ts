import { isArray, isBool, isFunction, isPlainObject, isString } from '../is'
import { assign, keys, wrapInArray } from '../shared'
import { throwError, warn } from '../smy/warn'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export type ValidationRuleFunction<VValue = unknown, VParams = unknown[] | Record<string, any>> = (
  value: VValue,
  params: VParams,
  meta: FieldValidationMetaInfo
) => boolean | string | Promise<boolean | string>

export type ValidationFormatter = (value: any, rule: FieldValidationMetaInfo) => string

type RuleParamSchema = string | RuleParamConfig

export interface ValidationRuleSchema {
  validator?: ValidationRuleFunction
  formatter?: ValidationFormatter
  params?: RuleParamSchema[]
  message?: string | ((meta: FieldValidationMetaInfo) => string)
}

interface NormalizedRuleSchema extends ValidationRuleSchema {
  params?: RuleParamConfig[]
}

type ValidationRule = ValidationRuleFunction | ValidationRuleSchema

const RULES: Record<string, NormalizedRuleSchema> = {}

export function setRule(name: string, rule: ValidationRule) {
  RULES[name] = normalizeSchema(isFunction(rule) ? { validator: rule } : rule)
}

export function getRule(name: string) {
  return RULES[name]
}
type AnyRecord = Record<string, any>

export interface RuleParamConfig {
  name: string
  default?: any
  formatter?: (val: any) => any
}

function normalizeSchema(schema: ValidationRuleSchema) {
  const { params } = schema
  if (params?.length) {
    schema.params = params.map((param) => (isString(param) ? { name: param } : param))
  }
  return schema as NormalizedRuleSchema
}

export function normalizeRules(rules: any) {
  const acc: AnyRecord = {}
  Object.defineProperty(acc, '_$$isNormalized', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  })
  if (!rules) {
    return acc
  }
  const isObjectRule = isPlainObject(rules)
  if (isObjectRule && rules._$$isNormalized) {
    return rules
  }
  if (isObjectRule) {
    return keys(rules).reduce((prev, curr) => {
      let params: any[] | AnyRecord = []
      const rule = rules[curr]
      if (rule === true) {
        params = []
      } else if (isArray(rule) || isPlainObject(rule)) {
        params = rule
      } else {
        params = [rule]
      }
      if (rule !== false) {
        prev[curr] = buildParams(curr, params)
      }
      return prev
    }, acc)
  }

  if (!isString(rules)) {
    warn('validation', 'rules must be either a string or an object')
    return acc
  }

  return rules.split('|').reduce((prev, rule) => {
    const { name, params } = parseRule(rule)
    if (!name) {
      return prev
    }
    prev[name] = buildParams(name, params)

    return prev
  }, acc)
}

function buildParams(name: string, provided: any[] | AnyRecord) {
  const ruleSchema = getRule(name)
  if (!ruleSchema) {
    return provided
  }

  const ruleSchemaParam = ruleSchema.params
  const params: AnyRecord = {}
  let definedParams: RuleParamConfig[]
  if (!ruleSchemaParam || (isArray(provided) && ruleSchemaParam.length < provided.length)) {
    let lastDefinedParam: RuleParamConfig
    definedParams = (provided as any[]).map((_, idx) => {
      let param = ruleSchemaParam?.[idx]
      lastDefinedParam = param || lastDefinedParam
      if (!param) {
        param = lastDefinedParam
      }
      return param
    })
  } else {
    definedParams = ruleSchemaParam
  }

  for (let i = 0; i < definedParams.length; i++) {
    const { name, default: _default, formatter } = definedParams[i]
    let value = _default
    if (isArray(provided)) {
      if (i in provided) {
        value = provided[i]
      }
    } else {
      if (name in provided) {
        value = provided[name]
      } else if (definedParams.length === 1) {
        value = provided
      }
    }
    if (formatter) {
      value = formatter(value)
    }
    if (params[name]) {
      params[name] = wrapInArray(params[name])
      params[name].push(value)
    } else {
      params[name] = value
    }
  }
  return params
}

function parseRule(rule: string) {
  let params: string[] = []
  const name = rule.split(':')[0]
  if (rule.includes(':')) {
    params = rule.split(':').slice(1).join(':').split(',')
  }

  return { name, params }
}

export interface ValidationOptions {
  bails?: boolean
  field?: string
  label?: string
  name?: string
}

export type MaybeArray<T> = T | T[]

export type MaybePromise<T> = T | Promise<T>

export type GenericValidateFunction<VValue = unknown> = (
  value: VValue,
  meta: FieldValidationMetaInfo
) => MaybePromise<boolean | MaybeArray<string>>

export interface FieldValidationMetaInfo {
  field: string
  name: string
  value: unknown
  label?: string
  rule?: {
    name: string
    params?: Record<string, unknown> | unknown[]
  }
}

interface FieldValidationContext<VValue = unknown> {
  name: string
  value: VValue
  label?: string
  rules: MaybeArray<GenericValidateFunction<VValue>> | string | Record<string, unknown>
}
export async function validate<VValue = unknown>(
  value: VValue,
  rules: string | Record<string, unknown | unknown[]> | MaybeArray<GenericValidateFunction<VValue>>,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const { bails = true, label, name = '{field}' } = options
  const errors: string[] = []
  const tasks: Promise<boolean>[] = []
  if (isFunction(rules) || isArray(rules)) {
    const meta = {
      field: label || name,
      name,
      label,
      value,
    }
    const pipeline = wrapInArray(rules)
    for (let i = 0; i < pipeline.length; i++) {
      const validator = pipeline[i]
      const task = async () => {
        const result = await validator(value, meta)
        const valid = !isString(result) && !isArray(result) && result
        if (valid) {
          return true
        }
        if (isArray(result)) {
          errors.push(...result)
          return false
        } else {
          if (isBool(result) && result) {
            return true
          }
          const message = result ? (result as string) : _generateMessage(undefined, meta)
          errors.push(message)
          return false
        }
      }
      if (bails) {
        const done = await task()
        if (done) {
          return { errors, valid: false }
        }
      } else {
        tasks.push(task())
      }
    }
  } else {
    const normalizedRules = normalizeRules(rules)
    const context = {
      name,
      value,
      rules: normalizedRules,
      label,
      bails,
    }

    const ruleKeys = keys(normalizedRules)
    for (let i = 0; i < ruleKeys.length; i++) {
      const rule = ruleKeys[i]
      const task = () =>
        _test(context, {
          name: rule,
          params: normalizedRules[rule],
        }).then(({ valid, error }) => {
          if (!valid && error) {
            errors.push(error)
            return true
          }
          return false
        })
      if (bails) {
        const done = await task()

        if (done) {
          return { errors, valid: false }
        }
      } else {
        tasks.push(task())
      }
    }
  }

  tasks.length && (await Promise.all(tasks))
  return { errors, valid: !errors.length }
}

interface TestRule {
  name: string
  params: Record<string, any>
}

const createInterpolateValues = (meta: FieldValidationMetaInfo) => {
  const { field, value, rule } = meta
  return assign({ _field_: field, _rule_: rule?.name, _value_: value }, rule?.params)
}

async function _test(context: FieldValidationContext, rule: TestRule) {
  const { name: ruleName, params } = rule
  const ruleSchema = getRule(ruleName)
  if (!ruleSchema?.validator) {
    return throwError('validation', `No such validator ${ruleName} exists.`)
  }
  const { value, name, label } = context
  const meta: FieldValidationMetaInfo = {
    field: label || name,
    name,
    label,
    value,
    rule,
  }
  const normalizedValue = ruleSchema.formatter ? ruleSchema.formatter(value, meta) : value
  const result = await ruleSchema.validator(normalizedValue, params, meta)
  if (isString(result)) {
    return {
      valid: false,
      error: interpolate(result, createInterpolateValues(meta)),
    }
  }

  return {
    valid: result,
    error: result ? undefined : _generateMessage(ruleSchema.message, meta),
  }
}

const interpolate = (template: string, values: AnyRecord) =>
  template.replace(/{([^}]+)}/g, (_, p) => values[p] || `{${p}}`)

function _generateMessage(message: NormalizedRuleSchema['message'], meta: FieldValidationMetaInfo) {
  if (isFunction(message)) {
    return message(meta)
  }
  const { field } = meta
  return message ? interpolate(message, createInterpolateValues(meta)) : `${field} is not valid.`
}
