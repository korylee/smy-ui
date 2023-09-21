<template>
  <div>
    <foo is="blog-post-row">fasdf</foo>
    <demo>
      <template v-slot:header>hhhh</template>
      <template #content>hhhh</template>
    </demo>
  </div>
</template>

<script>
const DemoInner = {
  mounted() {
    console.log(this)
  },
  render(h) {
    return h('div', {}, [
      this.$scopedSlots.header?.({ title: 'DemoInner' }),
      this.$scopedSlots.content?.(),
      this.$slots.footer,
    ])
  },
}
const Demo = {
  render(h) {
    return h(
      DemoInner,
      {
        scopedSlots: {
          header: (data) => h('div', data.title || 'header'),
          content: () => h('div', 'DemoContent'),
          footer: () => h('div', 'DemoFooter3'),
        },
      },
      [h('div', { slot: 'footer' }, ['DemoFooter'])]
    )
  },
}
export default {
  name: 'DemoPage',
  components: { Demo },
}
</script>
