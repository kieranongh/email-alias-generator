import { jest, expect } from "@jest/globals"
import { generateAttempt, generateUniqueToken, getUsernameAndDomain } from "../email-alias-generator"

describe("getUsernameAndDomain", () => {
  it.each([
    ["a@b.co", "a", "b.co"],
    ["my@email.com", "my", "email.com"],
    ["has.dots@au", "has.dots", "au"],
    ["under_scored@my_domain.xyz", "under_scored", "my_domain.xyz"],
  ])("should split email (%s) into username and domain", (email, expectedUsername, expectedDomain) => {
    expect(getUsernameAndDomain(email)).toStrictEqual([expectedUsername, expectedDomain])
  })
})

describe("generateUniqueToken", () => {
  it("should return first new token", () => {
    const existingTokens = new Set()
    jest.spyOn(Math, "random")
      .mockImplementationOnce(() => 0.111111)
      .mockImplementationOnce(() => 0.222222)
      .mockReturnValue(0.999999)
    expect(generateUniqueToken(existingTokens)).toStrictEqual("111111")
  })

  it("should try again if token/s exist", () => {
    const existingTokens = new Set(["111111", "222222"])
    jest.spyOn(Math, "random")
      .mockImplementationOnce(() => 0.111111)
      .mockImplementationOnce(() => 0.222222)
      .mockReturnValue(0.999999)
    expect(generateUniqueToken(existingTokens)).toStrictEqual("999999")
  })

  it("should fail after a number of failed attempts", () => {
    const existingTokens = new Set(["111111", "222222", "999999"])
    jest.spyOn(Math, "random")
      .mockImplementationOnce(() => 0.111111)
      .mockImplementationOnce(() => 0.222222)
      .mockReturnValue(0.999999)
    expect(() => generateUniqueToken(existingTokens)).toThrow("Cannot find a new token. May succeed if you try again")
  })
})

describe("generateAttempt", () => {
  it.each([
    [6, "123456"],
    [3, "123"],
    [8, "12345678"]
  ])("should return random string of %s digits", (digits, expected) => {
    jest.spyOn(Math, "random").mockReturnValue(0.123456789)
    expect(generateAttempt(digits)).toStrictEqual(expected)
  })
})