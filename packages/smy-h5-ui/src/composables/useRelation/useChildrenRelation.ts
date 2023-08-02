import {
  ComponentInternalInstance,
  InjectionKey,
  VNode,
  VNodeNormalizedChildren,
  getCurrentInstance,
  isVNode,
  provide,
  reactive,
} from 'vue'
import { isArray, isNil } from '../../_utils/is'
import { assign } from '../../_utils/shared'
import { throwError } from '../../_utils/smy/warn'

function findVNodeIndex(vnodes: VNode[], vnode: VNode) {
  const index = vnodes.indexOf(vnode)
  if (index !== -1) return index
  return vnodes.findIndex((item) => !isNil(vnode.key) && item.type === vnode.type && item.key === vnode.key)
}

export function flattenVNodes(children: VNodeNormalizedChildren, result: VNode[] = []) {
  if (isArray(children)) {
    children.forEach((child) => {
      if (!isVNode(child)) return
      result.push(child)
      const subTree = child.component?.subTree
      if (subTree) {
        result.push(subTree)
        flattenVNodes(subTree.children, result)
      }
      if (child.children) {
        flattenVNodes(child.children, result)
      }
    })
  }
  return result
}

export function sortChildren(parent: ComponentInternalInstance, internalChildren: ComponentInternalInstance[]) {
  const vnodes = flattenVNodes(parent.subTree.children)

  internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode))
}

export function useChildrenRelation<ProvideValue = never>(key: InjectionKey<ProvideValue>) {
  const internalChildren: ComponentInternalInstance[] = reactive([])
  const parent = getCurrentInstance()!
  if (!parent) {
    return throwError('useChildrenRelation', 'must be called from inside a setup function')
  }

  function relate(value?: ProvideValue) {
    function link(child: ComponentInternalInstance) {
      if (!child.proxy) return
      internalChildren.push(child)
      sortChildren(parent, internalChildren)
    }

    function unlink(child: ComponentInternalInstance) {
      const index = internalChildren.indexOf(child)
      internalChildren.splice(index, 1)
    }

    provide(
      key,
      assign(
        {
          link,
          unlink,
          children: internalChildren,
        },
        value
      )
    )
  }
  return {
    children: internalChildren,
    relate,
  }
}
