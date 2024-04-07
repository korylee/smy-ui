import { mount } from '@vue/test-utils'
import CheckboxGroup from '..'
import Checkbox from '../../checkbox'

test('should emit "input" event when checkbox is clicked', async () => {
  const wrapper = mount({
    data: () => ({
      value: [],
    }),
    render() {
      return (
        <CheckboxGroup v-model={this.value}>
          <Checkbox value="a" />
          <Checkbox value="b" />
        </CheckboxGroup>
      )
    },
  })
  const items = wrapper.findAll('.smy-checkbox')
  await items.at(0).trigger('click')
  expect(wrapper.vm.value).toEqual(['a'])

  await items.at(1).trigger('click')
  expect(wrapper.vm.value).toEqual(['a', 'b'])

  await items.at(0).trigger('click')
  expect(wrapper.vm.value).toEqual(['b'])
})

test('should change icon size when using size prop', () => {
  const wrapper = mount({
    render() {
      return (
        <CheckboxGroup size="10rem">
          <Checkbox />
          <Checkbox size="5rem" />
        </CheckboxGroup>
      )
    },
  })
  const checkboxs = wrapper.findAll('.smy-checkbox')
  expect(checkboxs.at(0).attributes('style')).toContain('--checkbox-size: 10rem')
  expect(checkboxs.at(1).attributes('style')).toContain('--checkbox-size: 5rem')
})

test('should change color when using color prop', () => {
  const wrapper = mount({
    render() {
      return (
        <CheckboxGroup color="black">
          <Checkbox />
          <Checkbox color="white" />
        </CheckboxGroup>
      )
    },
  })
  const checkboxs = wrapper.findAll('.smy-checkbox')
  expect(checkboxs.at(0).attributes('style')).toContain('--checkbox-color: black')
  expect(checkboxs.at(1).attributes('style')).toContain('--checkbox-color: white')
})

test('should limit the number of checked items when using max prop', async () => {
  const wrapper = mount({
    data: () => ({
      value: ['a'],
    }),
    render() {
      return (
        <CheckboxGroup v-model={this.value} max="2">
          <Checkbox value="a" />
          <Checkbox value="b" />
          <Checkbox value="c" />
          <Checkbox value="d" />
        </CheckboxGroup>
      )
    },
  })
  const items = wrapper.findAll('.smy-checkbox')

  await items.at(1).trigger('click')
  expect(wrapper.vm.value).toEqual(['a', 'b'])
  expect(items.at(2).classes()).toContain('smy-checkbox--disabled')

  await items.at(2).trigger('click')
  expect(wrapper.vm.value).toEqual(['a', 'b'])
})

test('should ignore Checkbox if bind-group is false', async () => {
  const wrapper = mount({
    data: () => ({
      value: false,
      groupValue: [],
    }),
    methods: {
      toggleAll(checked) {
        this.$refs.groupRef.toggleAll(checked)
      },
    },
    render() {
      return (
        <CheckboxGroup v-model={this.groupValue} ref="groupRef">
          <Checkbox v-model={this.value} value="a" bindGroup={false} />
          <Checkbox value="b" />
          <Checkbox value="c" />
        </CheckboxGroup>
      )
    },
  })
  const items = wrapper.findAll('.smy-checkbox')
  items.at(0).trigger('click')
  expect(wrapper.vm.value).toBeTruthy()
  expect(wrapper.vm.groupValue).toEqual([])

  wrapper.vm.toggleAll(true)
  expect(wrapper.vm.groupValue).toEqual(['b', 'c'])
  wrapper.destroy()
})

test('should toggle all checkboxes when toggleAll method is called', async () => {
  const wrapper = mount({
    data: () => ({
      value: ['a'],
    }),
    methods: {
      toggleAll(options) {
        this.$refs.groupRef.toggleAll(options)
      },
    },
    render() {
      return (
        <CheckboxGroup ref="groupRef" vModel={this.value}>
          <Checkbox value="a" />
          <Checkbox value="b" />
          <Checkbox value="c" disabled />
        </CheckboxGroup>
      )
    },
  })

  wrapper.vm.toggleAll()
  expect(wrapper.vm.value).toEqual(['b', 'c'])

  wrapper.vm.toggleAll(false)
  expect(wrapper.vm.value).toEqual([])

  wrapper.vm.toggleAll(true)
  expect(wrapper.vm.value).toEqual(['a', 'b', 'c'])

  await wrapper.vm.$nextTick()
  wrapper.vm.toggleAll({ skipDisabled: true })
  expect(wrapper.vm.value).toEqual(['c'])

  wrapper.vm.toggleAll({ checked: true, skipDisabled: true })
  expect(wrapper.vm.value).toEqual(['a', 'b', 'c'])
})
