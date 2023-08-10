import { useEventListener } from './useEventListener'

export function useRouteListener(listener: () => void) {
  useEventListener('hashchange', listener, { target: window })
  useEventListener('popstate', listener, { target: window })
}
