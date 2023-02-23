import type Vue from 'vue'
import { type VNode } from 'vue'
import { isNill } from '../_utils/is'
import { throwError } from '../_utils/smy/warn'

interface RelationOptions {
  children?: string
  index?: string
}

function flatVNodes(subTree: VNode[], vNodes: VNode[] = []) {
  subTree.forEach((child) => {
    vNodes.push(child)
    if (child.componentInstance) {
      flatVNodes(child.componentInstance.$children.map((item) => item.$vnode))
    }
    if (child.children) {
      flatVNodes(child.children)
    }
  })
  return vNodes
}

function sortChildren(children: Vue[], parent: Vue) {
  const { componentOptions } = parent.$vnode
  if (!componentOptions?.children) {
    return
  }
  const vNodes = flatVNodes(componentOptions.children)

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
      [index as any]() {
        return (this as any)[parent]?.[children]?.indexOf(this)
      },
    },
    watch: {
      [`${parent}.${children}`]: {
        immediate: true,
        async handler() {
          const vm = this as any
          await (this as any).$nextTick()
          const parentVNode = vm[parent]
          if (!parentVNode) return throwError('relation-mixin', `该组件必须为${parent}子组件`)

          const childrenList = parentVNode[children]
          if (~childrenList.indexOf(this)) return
          parentVNode[children] = sortChildren([...childrenList, this], parentVNode)
        },
      },
    },
    beforeDestroy() {
      const vm = this as any
      const currentIndex = vm[index]
      isNill(currentIndex) || vm[parent]?.[children]?.splice(currentIndex, 1)
    },
  }
}
