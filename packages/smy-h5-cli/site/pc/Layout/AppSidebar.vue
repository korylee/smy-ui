<template>
  <div class="smy-site-sidebar smy-elevation--3">
    <Cell
      v-for="(item, index) of menu"
      :id="item.docs"
      :key="index"
      class="smy-site-sidebar__item"
      :class="{
        'smy-site-sidebar__item--active': item.doc === menuName,
        'smy-site-sidebar__link': !isTitle(item),
        'smy-site-sidebar__title': isTitle(item),
      }"
      @click.native="changeRoute(item)"
    >
      <span
        :class="{
          'smy-site-sidebar__item--tile': isTitle(item),
        }"
        >{{ item.text }}</span
      >
    </Cell>
  </div>
</template>

<script>
import Cell from '../../components/cell'
import { MenuTypes } from '../common'

export default {
  name: 'AppSidebar',
  components: { Cell },
  props: {
    menu: Array,
    menuName: String,
  },
  methods: {
    changeRoute(item) {
      if (this.isTitle(item) || this.menuName === item.doc) return
      this.$emit('change', item)
    },
    isTitle(item) {
      return item.type === MenuTypes.TITLE
    },
  },
}
</script>

<style lang="less" scoped>
.smy-site-sidebar {
  padding: 0 0 15px;
  position: fixed;
  width: 240px;
  top: 60px;
  bottom: 0;
  left: 0;
  z-index: 6;
  overflow-y: scroll;
  box-shadow: 0 8px 12px var(--site-config-color-shadow);
  background: var(--site-config-color-bar);

  &:-webkit-scrollbar {
    display: none;
  }
  &__item {
    margin: 0;
    user-select: none;
    padding: 10px 28px;

    &--title {
      font-size: 16px;
      font-weight: 600;
      line-height: 28px;
      padding: 8px 0 8px;
      color: var(--site-config-color-text);
    }
    &--active {
      position: relative;
      background: var(--site-config-color-sidebar-active-background);
      span {
        color: var(--site-config-color-sidebar);
      }
      &::before {
        display: block;
        content: '';
        width: 4px;
        height: 40px;
        position: absolute;
        left: 0;
        top: 0;
        background: var(--site-config-color-sidebar);
      }
    }
  }

  &__link {
    cursor: pointer;
    font-size: 14px;
    color: var(--site-config-color-text);
    transition: color 0.2s;

    &:hover {
      color: var(--site-config-color-sidebar);
    }
  }
  &__title {
    margin-top: 10px;
  }
}
</style>
