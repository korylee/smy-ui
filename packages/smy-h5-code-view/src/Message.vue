<template>
  <transition name="fade">
    <div v-if="err || warn" class="message" :class="err ? 'err' : 'warn'">
      <pre>{{ formatMessage(err || warn) }}</pre>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'message',
  props: {
    err: [String, Error],
    warn: [String],
  },
  methods: {
    formatMessage(err) {
      if (typeof err === 'string') {
        return err
      }
      let msg = err.message
      const loc = err.loc
      if (loc && loc.start) {
        msg = `(${loc.start.line}:${loc.start.column}) ` + msg
      }
      return msg
    },
  },
}
</script>
<style scoped>
.message {
  position: absolute;
  bottom: 0;
  left: 8px;
  right: 8px;
  z-index: 10;
  border: 2px solid transparent;
  border-radius: 6px;
  font-family: var(--font-code);
  white-space: pre-wrap;
  margin-bottom: 8px;
  max-height: calc(100% - 300px);
  min-height: 40px;
  display: flex;
  align-items: stretch;
  color: var(--color);
  border-color: var(--color);
  background-color: var(--bg-color);
}

.message.err {
  --color: #f56c6c;
  --bg-color: #fef0f0;
}

.message.warn {
  --color: #e6a23c;
  --bg-color: #fdf6ec;
}

.message pre {
  margin: 0;
  padding: 12px 20px;
  overflow: auto;
}

@media (max-width: 720px) {
  .dismiss {
    top: -9px;
    right: -9px;
  }

  .msg {
    bottom: 50px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(0, 10px);
}
</style>
