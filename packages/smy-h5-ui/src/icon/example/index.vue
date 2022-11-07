<template>
  <div>
    <Icon v-for="icon of iconList" :key="icon.text" size="14">
      <component :is="icon.value" />
    </Icon>
  </div>
</template>

<script>
import Icon from '../Icon'
const icons = import.meta.glob('../../_icon/**.vue')

const iconList = Object.keys(icons).map((iconPath) => ({
  value: icons[iconPath],
  text: iconPath.match(/\.\.\/\.\.\/_icon\/(\w+).vue/)?.[1],
}))

export default {
  name: 'IconExample',
  components: { Icon },
  data: () => ({
    iconList,
  }),
}
</script>

<style></style>
