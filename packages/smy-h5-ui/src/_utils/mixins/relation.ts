import { isNill } from '../is'
import { throwError } from '../smy'

interface RelationOptions {
  children?: string
  index?: string
}

export function createParentMixin(parent: string, { children = 'children' }: Pick<RelationOptions, 'children'> = {}) {
  return {
    provide() {
      return { [parent]: this }
    },
    data: () => ({ [children]: [] }),
  }
}

export function createChildrenMixin(parent: string, { index = 'index', children = 'children' }: RelationOptions = {}) {
  return {
    inject: {
      [parent]: {
        default: null,
      },
    },
    computed: {
      [index]() {
        return this[parent]?.[children]?.indexOf(this)
      },
    },
    watch: {
      [`${parent}.${children}`]: {
        immediate: true,
        async handler() {
          await (this as any).$nextTick()
          if (!this[parent]) return throwError('relation-mixin', `该组件必须为${parent}子组件`)

          if (~this[parent][children].indexOf(this)) return
          this[parent][children].push(this)
        },
      },
    },
    beforeDestroy() {
      const currentIndex = this[index]
      isNill(currentIndex) || this[parent]?.[children]?.splice(currentIndex, 1)
    },
  }
}
