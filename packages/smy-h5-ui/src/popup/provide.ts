import Vue, { ComponentOptions } from 'vue'

export const POPUP_BIND_CHILDREN_KEY = 'POPUP_BIND_CHILDREN_KEY'

export const PopupMixin = {
  inject: {
    popupProvider: {
      default: null,
      from: POPUP_BIND_CHILDREN_KEY,
    },
  },
} as ComponentOptions<Vue>
