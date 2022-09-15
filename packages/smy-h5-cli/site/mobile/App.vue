<template>
  <div class="site-mobile">
    <header></header>
    <div class="router-view__block">
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  watch: {
    '$route.path'(to) {
      const componentName = to.slice(1)
      console.log(componentName)
    }
  }
}
</script>
