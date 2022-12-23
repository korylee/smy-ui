import Vue from 'vue'

const MIN_DISTANCE = 10

function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal'
  } else if (y > x && y > MIN_DISTANCE) {
    return 'vertical'
  }
  return ''
}

type Direction = ReturnType<typeof getDirection>

export function useTouch() {
  const state = Vue.observable({
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    direction: '',
  })
  const isVertical = () => state.direction === 'vertical'
  const isHorizontal = () => state.direction === 'horizontal'
  const reset = () => {
    state.deltaX = 0
    state.deltaY = 0
    state.offsetX = 0
    state.offsetY = 0
    state.direction = ''
  }
  const start: EventListener = (event: TouchEvent) => {
    reset()
    state.startX = event.touches[0].clientX
    state.startY = event.touches[0].clientY
  }
  const move: EventListener = (event: TouchEvent) => {
    const touch = event.touches[0]
    state.deltaX = touch.clientX - state.startX
    state.deltaY = touch.clientY - state.startY
    state.moveX = touch.clientX
    state.moveY = touch.clientY
    state.offsetX = Math.abs(state.deltaX)
    state.offsetY = Math.abs(state.deltaY)
    if (!state.direction) {
      state.direction = getDirection(state.offsetX, state.offsetY)
    }
  }
  return Object.freeze({
    state,
    start,
    move,
    isVertical,
    isHorizontal,
  })
}
