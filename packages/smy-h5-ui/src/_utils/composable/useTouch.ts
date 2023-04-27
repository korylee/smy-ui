import Vue from 'vue'

const MIN_DISTANCE = 10

export const DIRECTION = Object.freeze({
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
})

const { HORIZONTAL, VERTICAL } = DIRECTION

function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) return HORIZONTAL
  else if (y > x && y > MIN_DISTANCE) return VERTICAL
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
    direction: '' as Direction,
  })
  const isVertical = () => state.direction === VERTICAL
  const isHorizontal = () => state.direction === HORIZONTAL
  const reset = () => {
    state.deltaX = 0
    state.deltaY = 0
    state.offsetX = 0
    state.offsetY = 0
    state.direction = ''
  }
  const start = (event: TouchEvent) => {
    reset()
    const { clientX, clientY } = event.touches[0]
    state.startX = clientX
    state.startY = clientY
  }

  const move = (event: TouchEvent) => {
    const { clientX, clientY } = event.touches[0]
    state.deltaX = clientX - state.startX
    state.deltaY = clientY - state.startY
    state.moveX = clientX
    state.moveY = clientY
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
    reset,
    isVertical,
    isHorizontal,
  })
}
