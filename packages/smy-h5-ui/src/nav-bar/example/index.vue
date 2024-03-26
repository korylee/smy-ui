<template>
  <div>
    <smy-nav-bar title="test" left-arrow>
      <template #right>
        <div>555</div>
      </template>
    </smy-nav-bar>
    <smy-nav-bar title="test" left-arrow>
      <template #title>
        <smy-tabs>
          <smy-tab>
            <smy-tab v-for="item of 3" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
          </smy-tab>
        </smy-tabs>
      </template>
    </smy-nav-bar>
  </div>
</template>

<script>
import SmyNavBar from '../'
import SmyTabs from '../../tabs'
import SmyTab from '../../tab'

export default {
  name: 'NavBarExample',
  components: { SmyNavBar, SmyTabs, SmyTab },
}
</script>

<style lang="scss"></style>
