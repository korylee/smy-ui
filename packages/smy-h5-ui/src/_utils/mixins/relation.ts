import { isNill } from '../is'
import { removeItem } from '../shared'
import { throwError } from '../smy'

interface RelationOptions {
  children?: string
  index?: string
}

function flatVNodes(subTree, vNodes = []) {
  subTree.forEach((child) => {
    if (child.componentInstance) {
      flatVNodes(child.componentInstance.$children.map((item) => item.$vnode))
    }
    if (child.children) {
      flatVNodes(child.children)
    }
  })
  return vNodes
}

function sortChildren(children, parent) {
  const { componentOptions } = parent.$vnode
  if (!componentOptions?.children) {
    return
  }
  const vNodes = flatVNodes(children)
  children.sort((a, b) => vNodes.indexOf(a.$vnode) - vNodes.indexOf(b.$vnode))
  return children
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

          const childrenList = this[parent][children]
          if (~childrenList.indexOf(this)) return
          this[parent][children] = sortChildren([...childrenList, this], this[parent])
        },
      },
    },
    beforeDestroy() {
      const currentIndex = this[index]
      isNill(currentIndex) || this[parent]?.[children]?.splice(currentIndex, 1)
    },
  }
}
