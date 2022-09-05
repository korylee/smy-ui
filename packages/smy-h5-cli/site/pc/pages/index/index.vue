<template>
  <div class="home-page">
    <div class="slash-box box-1"></div>
    <div class="slash-box box-2"></div>
    <div class="slash-box box-3"></div>
    <div class="slash-box box-4"></div>
    <div class="slash-box box-5"></div>
    <div class="profile-container">
      <div class="container-box">
        <div class="description-container">
          <div class="base-title">{{ title }}</div>
        </div>
        <div class="base-description">{{description}}</div>
        <div class="button-group">
          <SiteButton class="common-button primary-button" @click="getStart">
            <div class="block-button-content">
              <span>起步</span>
            </div>
          </SiteButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es'
import config from '@config'
import SiteButton from '../../../components/button'

export default {
  components:{SiteButton},
  data: () => ({
    github: get(config, 'pc.header.gihub'),
    title: get(config, 'title'),
    description: get(config, 'description'),
  }),
  methods:{
    getStart(){
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>