# Lazy 懒加载

### 介绍

### 引入

### 基础使用

```html
<template>
  <div>
    <smy-lazy v-for="item of 4" :key="item">
      <div>{{item}}</div>
    </smy-lazy>
  </div>
</template>
<style>
  .smy-lazy {
    box-sizing: content-box;
    height: 500px;
    width: 100%;
    text-align: center;
    font-size: 24px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);
  }
</style>
```
