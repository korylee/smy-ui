import { mount } from '@vue/test-utils'
import RadioGroup from '..'
import Radio from '../../radio'

test('should emit "input" and "change" event when radio is clicked', async () => {
  const wrapper = mount({
    data: () => ({
      result: 'a',
      list: ['a', 'b', 'c', 'd'],
    }),
    render() {
      return (
        <RadioGroup vModel={this.result} onChange={(value) => this.$emit('change', value)}>
          {this.list.map((item) => (
            <Radio key={item} value={item} disabled={item === 'd'}>
              {item}
            </Radio>
          ))}
        </RadioGroup>
      )
    },
  })
  const icons = wrapper.findAll('.smy-radio__icon')
  const labels = wrapper.findAll('.smy-radio__label')

  expect(icons.at(0).classes()).toContain('smy-radio__icon--checked')

  await icons.at(2).trigger('click')
  expect(wrapper.vm.result).toEqual('c')
  expect(wrapper.emitted('change')[0]).toEqual(['c'])

  await labels.at(1).trigger('click')
  expect(wrapper.vm.result).toEqual('b')
  expect(wrapper.emitted('change')[1]).toEqual(['b'])

  await icons.at(3).trigger('click')
  await labels.at(3).trigger('click')
  expect(wrapper.vm.result).toEqual('b')
})

test('should not emit "change" event when radio group is disabled and radio is clicked', async () => {
  const wrapper = mount({
    data: () => ({
      result: 'a',
      list: ['a', 'b', 'c', 'd'],
    }),
    render() {
      return (
        <RadioGroup vModel={this.result} disabled onChange={(value) => this.$emit('change', value)}>
          {this.list.map((item) => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
        </RadioGroup>
      )
    },
  })
  const icons = wrapper.findAll('.smy-radio__icon')
  await icons.at(2).trigger('click')
  expect(wrapper.emitted('change')).toBeFalsy()
})

test('should change icon size when using size prop', () => {
  const wrapper = mount({
    render() {
      return (
        <RadioGroup size="10rem">
          <Radio />
          <Radio size="5rem" />
        </RadioGroup>
      )
    },
  })
  const radios = wrapper.findAll('.smy-radio')
  expect(radios.at(0).attributes('style')).toContain('--radio-size: 10rem')
  expect(radios.at(1).attributes('style')).toContain('--radio-size: 5rem')
})

test('should change color when using color prop', () => {
  const wrapper = mount({
    render() {
      return (
        <RadioGroup color="black">
          <Radio />
          <Radio color="white" />
        </RadioGroup>
      )
    },
  })
  const radios = wrapper.findAll('.smy-radio')
  expect(radios.at(0).attributes('style')).toContain('--radio-color: black')
  expect(radios.at(1).attributes('style')).toContain('--radio-color: white')
})
