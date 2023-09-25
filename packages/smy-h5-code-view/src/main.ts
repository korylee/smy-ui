import Vue from 'vue'

import Repl from './Repl.vue'

new Vue({
  render: (h) =>
    h(Repl, {
      attrs: {
        editor: 'monaco',
        theme: 'dark',
      },
    }),
}).$mount('#app')
