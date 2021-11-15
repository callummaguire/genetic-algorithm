const { expect } = require("@jest/globals")
const { getRandomLetter } = require("./guessMyName")

describe('test for', () => {
  test('check test', () => {
    expect(true).toEqual(true)
  })

  test('get random letter', () => {
    expect(getRandomLetter()).toEqual(true)
  })
})