import { mount } from '@vue/test-utils'
import PickerGroup from '..'
import _Picker from '../../picker'
import { delay } from '../../../jest-utils'

const Picker = _Picker.Component

test('should emit confirm event after clicking the confirm button', async () => {
  const wrapper = mount({
    data: () => ({
      value1: ['1'],
      value2: ['2'],
      value3: ['3'],
    }),
    render() {
      return (
        <PickerGroup
          popup={false}
          title="Title"
          tabs={['Tab1', 'Tab2', 'Tab3']}
          onConfirm={(val) => this.$emit('confirm', val)}
        >
          <Picker value={this.value1} columns={[['1']]} {...{ on: { 'update:value': (val) => (this.value1 = val) } }} />
          <Picker value={this.value2} columns={[['2']]} {...{ on: { 'update:value': (val) => (this.value2 = val) } }} />
          <Picker value={this.value3} columns={[['3']]} {...{ on: { 'update:value': (val) => (this.value3 = val) } }} />
        </PickerGroup>
      )
    },
  })
  await wrapper.find('.smy-picker__confirm').trigger('click')

  expect(wrapper.emitted('confirm')[0]).toEqual([
    [
      { column: ['1'], indexes: [0], values: ['1'] },
      { column: ['2'], indexes: [0], values: ['2'] },
      { column: ['3'], indexes: [0], values: ['3'] },
    ],
  ])
})

test('should switch to next step when click confirm button', async () => {
  const wrapper = mount({
    data: () => ({
      value1: ['1'],
      value2: ['2'],
    }),
    render() {
      return (
        <PickerGroup
          popup={false}
          title="Title"
          tabs={['Tab1', 'Tab2']}
          nextStepText="Next Step"
          onConfirm={(val) => this.$emit('confirm', val)}
        >
          <Picker value={this.value1} columns={[['1']]} {...{ on: { 'update:value': (val) => (this.value1 = val) } }} />
          <Picker value={this.value2} columns={[['2']]} {...{ on: { 'update:value': (val) => (this.value2 = val) } }} />
        </PickerGroup>
      )
    },
  })

  const confirmBtn = wrapper.find('.smy-picker__confirm')
  await confirmBtn.trigger('click')
  expect(wrapper.emitted('confirm')).toBeFalsy()

  await confirmBtn.trigger('click')
  expect(wrapper.emitted('confirm')[0]).toEqual([
    [
      { column: ['1'], indexes: [0], values: ['1'] },
      { column: ['2'], indexes: [0], values: ['2'] },
    ],
  ])
})

test('support controlled mode to set active-tab', async () => {
  const wrapper = mount({
    data: () => ({
      value1: ['1'],
      value2: ['2'],
      activeTab: 0,
    }),
    render() {
      return (
        <PickerGroup
          popup={false}
          title="Title"
          activeTab={this.activeTab}
          tabs={['Tab1', 'Tab2']}
          nextStepText="Next Step"
          onConfirm={(val) => this.$emit('confirm', val)}
        >
          <Picker
            value={this.value1}
            columns={[['1']]}
            onUpdateValue={(val) => (this.value1 = val)}
            // {...{ on: { 'update:value': (val) => (this.value1 = val) } }}
          />
          <Picker value={this.value2} columns={[['2']]} {...{ on: { 'update:value': (val) => (this.value2 = val) } }} />
        </PickerGroup>
      )
    },
  })

  await delay(0)
  const tabs = wrapper.findAll('.smy-tab')
  expect(tabs.at(0)?.classes()).toContain('smy-tab--active')

  wrapper.vm.activeTab = 1
  await delay(0)
  expect(tabs.at(1)?.classes()).toContain('smy-tab--active')
})
