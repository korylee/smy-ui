import type Vue from 'vue'
import { type VNode } from 'vue'
import { isNil } from '../_utils/is'
import { throwError } from '../_utils/smy/warn'

interface RelationOptions {
  children?: string
  index?: string
}

function flatVNodes(subTree: VNode[], vNodes: VNode[] = []) {
  subTree.forEach((child) => {
    vNodes.push(child)
    const { componentInstance, children } = child
    if (componentInstance) {
      flatVNodes(componentInstance.$children.map((item) => item.$vnode))
    }
    if (children) {
      flatVNodes(children)
    }
  })
  return vNodes
}

function sortChildren(children: Vue[], parent: Vue) {
  const realChildren = parent.$vnode.componentOptions?.children
  if (!realChildren?.length) {
    return
  }
  const vNodes = flatVNodes(realChildren)

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
        const vm = this as any
        return vm[parent]?.[children]?.indexOf(vm)
      },
    },
    watch: {
      [`${parent}.${children}`]: {
        immediate: true,
        async handler() {
          const vm = this as any
          await vm.$nextTick()
          const parentVNode = vm[parent]
          if (!parentVNode) return throwError('relation-mixin', `该组件必须为${parent}子组件`)

          const childrenList = parentVNode[children]
          if (~childrenList.indexOf(vm)) return
          parentVNode[children] = sortChildren([...childrenList, vm], parentVNode)
        },
      },
    },
    beforeDestroy() {
      const vm = this as any
      const currentIndex = vm[index]
      if (isNil(currentIndex) || currentIndex === -1) return
      vm[parent]?.[children]?.splice(currentIndex, 1)
    },
  }
}
