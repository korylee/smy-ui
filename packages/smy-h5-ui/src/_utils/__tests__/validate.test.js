import { defineRule, validate } from '../validate'
import { validator as emailValidator } from '../validate/rules/email'

describe('test defineRule', () => {
  test('Can Return error messages directly in the validate fn', async () => {
    defineRule('test-direct', (value) => {
      if (value === '1') {
        return 'Cannot be 1'
      }
      if (value === '2') {
        return 'Cannot be 2 by {_rule_}'
      }
      if (value === '3') {
        return '{_field_} Cannot be {_value_}'
      }
      return true
    })
    let result = await validate('1', 'test-direct')
    expect(result.errors[0]).toBe('Cannot be 1')
    result = await validate('2', 'test-direct')
    expect(result.errors[0]).toBe('Cannot be 2 by test-direct')
    result = await validate('0', 'test-direct')
    expect(result.valid).toBe(true)
    result = await validate('3', 'test-direct', { name: 'test' })
    expect(result.errors[0]).toBe('test Cannot be 3')
  })
})

describe('test validate', () => {})

describe('test validator rules', () => {
  const validEmails = [
    'someone@example.com',
    'someone@example.co',
    'someone123@example.co.uk',
    'Pelé@example.com',
    'very.common@example.com',
    'other.email-with-dash@example.com',
    'disposable.style.email.with+symbol@example.com',
    ['someone@example.com', 'someone12@example.com'],
  ]
  const invalidEmails = [
    '@example.com',
    '@example',
    undefined,
    null,
    'undefined',
    'null',
    'someone@example.c',
    ['someone@example.com', 'someone@example.c'],
  ]

  test('校验邮箱地址', () => {
    expect.assertions(16)
    validEmails.forEach((email) => expect(emailValidator(email)).toBe(true))

    invalidEmails.forEach((email) => expect(emailValidator(email)).toBe(false))
  })
})
