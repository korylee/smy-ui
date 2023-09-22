<template>
  <div
    ref="container"
    class="split-pane"
    :class="{
      vertical: isVertical,
    }"
  >
    <div class="left" :style="{ [isVertical ? 'height' : 'width']: boundSplit + '%' }">
      <slot name="left" />
    </div>
    <div class="right" :style="{ [isVertical ? 'height' : 'width']: 100 - boundSplit + '%' }">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layout: String,
  },
  data: () => ({
    split: 50,
  }),
  computed: {
    isVertical: ({ layout }) => layout === 'vertical',
    boundSplit({ split }) {
      return split < 20 ? 20 : split > 80 ? 80 : split
    },
  },
}
</script>

<style scoped>
.split-pane {
  display: flex;
  height: 100%;
  position: relative;
}

.split-pane .left,
.split-pane .right {
  position: relative;
  height: 100%;
}
.split-pane .left {
  border-right: 1px solid var(--border);
}

@media (min-width: 721px) {
  .split-pane.vertical {
    display: block;
  }

  .split-pane.vertical.dragging {
    cursor: ns-resize;
  }

  .vertical .dragger {
    top: auto;
    height: 10px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: -5px;
    cursor: ns-resize;
  }

  .vertical .left,
  .vertical .right {
    width: 100%;
  }
  .vertical .left {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

/* mobile */
@media (max-width: 720px) {
  .left,
  .right {
    width: 100% !important;
    height: 100% !important;
  }
  .dragger {
    display: none;
  }
  .split-pane .toggler {
    display: block;
  }
  .split-pane .right {
    display: none;
  }
  .split-pane.show-output .right {
    display: block;
  }
  .split-pane.show-output .left {
    display: none;
  }
}
</style>
