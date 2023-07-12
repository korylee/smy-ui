import { camelize, keys, upperFirst } from '../_utils/shared'

export const ListenersMixin = {
  methods: {
    getListeners() {
      const { $listeners } = this
      return keys($listeners).reduce((listenersWithOn, key) => {
        const name = `on${upperFirst(camelize(key))}`
        listenersWithOn[name] = $listeners[key]
        return listenersWithOn
      }, {})
    },
  },
}
