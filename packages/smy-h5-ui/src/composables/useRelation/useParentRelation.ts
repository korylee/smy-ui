import { ComponentInternalInstance, InjectionKey, computed, getCurrentInstance, inject, onUnmounted, ref } from 'vue'
import { throwError } from '../../_utils/smy/warn'

type ParentProvide<T> = T & {
  link(child: ComponentInternalInstance): void
  unlink(child: ComponentInternalInstance): void
  children: ComponentInternalInstance[]
}

export function useParentRelation<T>(key: InjectionKey<ParentProvide<T>>) {
  const parentProvide = inject(key, null)
  const instance = getCurrentInstance()
  if (!instance) {
    return throwError('useParentRelation', 'must be called from inside a setup function')
  }
  if (!parentProvide) {
    return {
      parent,
      index: ref(-1),
    }
  }
  const { link, unlink, children } = parentProvide
  link(instance)
  onUnmounted(() => unlink(instance))

  const index = computed(() => children.indexOf(instance))
  return {
    parent,
    index,
  }
}
