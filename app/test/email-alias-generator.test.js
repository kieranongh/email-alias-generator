import { jest, expect } from "@jest/globals"
import { generateAttempt, generateUniqueToken, getNewEmailAlias, getUsernameAndDomain } from "../email-alias-generator"

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

describe("getUsernameAndDomain", () => {
  it.each([
    ["a@b.co", "a", "b.co"],
    ["my@email.com", "my", "email.com"],
    ["has.dots@au", "has.dots", "au"],
    ["under_scored@my_domain.xyz", "under_scored", "my_domain.xyz"],
    ["my+alias@email.com", "my", "email.com"],
    ["reinput+111111@aliases.r.us", "reinput", "aliases.r.us"],
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

  it("should fail but succeed on retries after a number of failed attempts", () => {
    const existingTokens = new Set(["111111", "222222", "999999"])
    jest.spyOn(Math, "random")
      .mockImplementationOnce(() => 0.111111)
      .mockImplementationOnce(() => 0.222222)
      .mockReturnValue(0.999999)
    expect(() => generateUniqueToken(existingTokens)).toThrow("Cannot find a new token. May succeed if you try again")
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.333333)
    expect(generateUniqueToken(existingTokens)).toStrictEqual("333333")
  })
})

describe("getNewEmailAlias", () => {
  it.each([
    ["with an empty set", "a@b.co", new Set([]), "a+111111@b.co", new Set(["111111"])],
    ["after a few failed attempts", "a@b.co", new Set(["111111", "222222"]), "a+333333@b.co", new Set(["111111", "222222", "333333"])],
    ["with already aliased emails", "a+1@b.co", new Set(["111111"]), "a+222222@b.co", new Set(["111111", "222222"])],
  ])("should succeed %s", (_, email, existingTokens, expectedAlias, expectedTokens) => {
    jest.spyOn(Math, "random")
      .mockImplementationOnce(() => 0.111111)
      .mockImplementationOnce(() => 0.222222)
      .mockReturnValue(0.333333)

    expect(getNewEmailAlias({ email, existingTokens })).toBe(expectedAlias)
    expect(existingTokens).toStrictEqual(expectedTokens)
  })

  it("should fail but succeed on retries after a number of failed attempts", () => {
    const existingTokens = new Set(["111111", "222222", "999999"])
    jest.spyOn(Math, "random")
      .mockImplementationOnce(() => 0.111111)
      .mockImplementationOnce(() => 0.222222)
      .mockReturnValue(0.999999)
    expect(() => getNewEmailAlias({ email: "a@b.co", existingTokens })).toThrow("Cannot find a new token. May succeed if you try again")
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.333333)
    expect(generateUniqueToken(existingTokens)).toStrictEqual("333333")
  })
})