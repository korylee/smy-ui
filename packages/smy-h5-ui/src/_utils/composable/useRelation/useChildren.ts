import type Vue from 'vue'
import { Ref, getCurrentInstance, provide, ref, type VNode } from 'vue'
import { assign, removeItem } from '@smy-h5/shared'

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

export function useChildren<Child extends Vue, ProvideValue = never>(
  key: string | symbol,
  opt: { sort?: boolean } = {},
) {
  const children: Ref<Child[]> = ref([])
  const parent = getCurrentInstance()!.proxy!
  function relate(value: ProvideValue) {
    const link = (child: Child) => {
      children.value.push(child)
      console.log('link', child, children.value)
      opt?.sort && sortChildren(children.value, parent)
    }
    const unlink = (child: Child) => {
      removeItem(children.value, child)
    }
    provide(key, assign({ link, unlink, children }, value))
  }
  return {
    children,
    relate,
  }
}
