import type Vue from 'vue'
import { ComponentOptions, type VNode } from 'vue'
import { isNil } from '../_utils/is'

interface RelationOptions {
  children?: string
  index?: string
  sort?: boolean
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
  } as ComponentOptions<Vue>
}

export function createChildrenMixin(
  parent: string,
  { index = 'index', children = 'children', sort = true }: RelationOptions = {}
) {
  function findIndex(this: Vue) {
    const vm = this as any
    return vm[parent]?.[children]?.indexOf(vm)
  }
  return {
    inject: {
      [parent]: {
        default: null,
      },
    },
    computed: sort ? { [index]: findIndex } : undefined,
    watch: {
      [`${parent}.${children}`]: {
        immediate: true,
        handler() {
          const vm = this as any
          const parentVNode = vm[parent]
          const childrenList = parentVNode?.[children]
          if (!childrenList || ~childrenList.indexOf(vm)) return
          const newChildrenList = [...childrenList, vm]
          parentVNode[children] = sort ? sortChildren(newChildrenList, parentVNode) : newChildrenList
        },
      },
    },
    beforeDestroy(this: Vue) {
      const vm = this as any
      const currentIndex = sort ? vm[index] : findIndex.call(this)
      if (isNil(currentIndex) || currentIndex === -1) return
      vm[parent]?.[children]?.splice(currentIndex, 1)
    },
  } as ComponentOptions<Vue>
}
