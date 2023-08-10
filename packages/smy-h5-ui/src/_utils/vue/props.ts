import type { PropType, Prop, } from 'vue'

declare type InferPropType<T> = [T] extends [null]
  ? any
  : [T] extends [{ type: null | true }]
  ? any
  : [T] extends [ObjectConstructor | { type: ObjectConstructor }]
  ? Record<string, any>
  : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
  ? boolean
  : [T] extends [DateConstructor | { type: DateConstructor }]
  ? Date
  : [T] extends [(infer U)[] | { type: (infer U)[] }]
  ? U extends DateConstructor
    ? Date | InferPropType<U>
    : InferPropType<U>
  : [T] extends [Prop<infer V, infer D>]
  ? unknown extends V
    ? IfAny<V, V, D>
    : V
  : T

export declare type ExtractPropTypes<O> = {
  [K in keyof Pick<O, RequiredKeys<O>>]: InferPropType<O[K]>
} & {
  [K in keyof Pick<O, OptionalKeys<O>>]?: InferPropType<O[K]>
}

declare type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends {
    required: true
  }
    ? // | {
      //     default: any
      //   }
      // | BooleanConstructor
      // | {
      //     type: BooleanConstructor
      //   }
      // T[K] extends {
      //   default: undefined | (() => undefined)
      // }
      // ? never
      // :
      K
    : never
}[keyof T]

declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>

export declare type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

export const unknownProp = null as unknown as PropType<unknown>

export const numericProp = [Number, String]

export const truthProp = {
  type: Boolean,
  default: true,
} as const

export const createNumberProp = <T>(defaultVal: T) => ({
  type: Number,
  default: defaultVal,
})

export const createStringProp = <T>(defaultVal: T) => ({
  type: String as unknown as PropType<T>,
  default: defaultVal,
})

export const createNumericProp = <T>(defaultVal: T) => ({
  type: numericProp,
  default: defaultVal,
})
