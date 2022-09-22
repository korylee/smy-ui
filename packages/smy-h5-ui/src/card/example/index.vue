<template>
  <div>
    <div>基础使用</div>
    <smy-card :title="title" :content="content" />
    <div>副标题</div>
    <smy-card :title="title" :content="content" :subtitle="subtitle" />
    <div>展示图片</div>
    <smy-card :title="title" :content="content" :subtitle="subtitle" src="https://varlet-vue2.vercel.app/cat.jpg" />
    <div>插槽</div>
    <smy-card :title="title" :content="content" :subtitle="subtitle" src="https://varlet-vue2.vercel.app/cat.jpg">
      <template #footer>
        <button>嗒嗒嗒</button>
      </template>
    </smy-card>
  </div>
</template>

<script>
import SmyCard from '..'

export default {
  name: 'CardExample',
  components: { SmyCard },
  data: () => ({
    title: '风景',
    subtitle: '公园里的风景',
    content:
      '公园的树林也很美。在公园的小山上栽满了树木，梧桐树的叶子随着时间的流逝慢慢变黄，纷纷飘落；枫树的叶子却变红了，公园笼罩在片片红云中，也使秋天增添了一分热情。而柏树的叶子仍是那么青翠欲滴，令你陶醉极了。山上有一群孩子在快乐的嬉戏，不时传来阵阵欢笑声，瞧，他们玩得多起劲呀，给树林增添了活力。',
  }),
}
</script>
