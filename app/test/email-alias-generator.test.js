import { jest, expect, describe, it } from "@jest/globals"
import { generateAttempt, generateUniqueToken, getNewEmailAlias, getUsernameAndDomain, readAliasesFile, writeAliasesFile } from "../email-alias-generator"

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
    ["ab@c.co", "ab", "c.co"],
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
    ["with an empty set", "ab@c.co", new Set([]), "ab+111111@c.co", new Set(["111111"])],
    ["after a few failed attempts", "ab@c.co", new Set(["111111", "222222"]), "ab+333333@c.co", new Set(["111111", "222222", "333333"])],
    ["with already aliased emails", "ab+1@c.co", new Set(["111111"]), "ab+222222@c.co", new Set(["111111", "222222"])],
    ["with just under max length email", "a".repeat(57) + "@ok.com", new Set([]), "a".repeat(57) + "+111111@ok.com", new Set(["111111"])],
    ["with leading space", "  prespaced@example.com", new Set([]), "prespaced+111111@example.com", new Set(["111111"])],
    ["with trailing space", "postspaced@example.com    \n\r", new Set([]), "postspaced+111111@example.com", new Set(["111111"])],
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
    expect(() => getNewEmailAlias({ email: "ab@c.co", existingTokens })).toThrow("Cannot find a new token. May succeed if you try again")
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.333333)
    expect(generateUniqueToken(existingTokens)).toStrictEqual("333333")
  })

  it.each([
    ["plainstring"],
    ["comma@example,com"],
    ["domain@.starts.with.dot"],
    [".user@starts.with.dot"],
    ["invalid@domain-.com"],
    ["\"quoted\"@example.com"],
    ["double@at@domain.com"],
  ])("should error on invalid email (%s)", (email) => {
    expect(() => getNewEmailAlias({ email, existingTokens: new Set() })).toThrow(`Email: ${email} is invalid`)
  })

  it("should error on double plused emails", () => {
    const email = "double+alias+ed@domain.com"
    expect(() => getNewEmailAlias({ email, existingTokens: new Set() })).toThrow(
      "Whilst emails with multiple '+'s are valid, this application is not built for them, please remove them"
    )
  })

  it("should error if email is or will be too long", () => {
    const email = "a".repeat(58) + "@toolong.com"
    expect(() => getNewEmailAlias({ email, existingTokens: new Set() })).toThrow(
      "Email must be 57 or less characters to be valid with an alias"
    )
  })
})

describe("readAliasesFile", () => {
  it("reads existing alias tokens from a file", async () => {
    const file = {
      text: async () => "111111\n222222\n333333"
    }

    const existingTokens = await readAliasesFile(file)

    expect(existingTokens).toBeInstanceOf(Set)
    expect(existingTokens.size).toBe(3)
    expect(existingTokens.has("111111")).toBe(true)
    expect(existingTokens.has("222222")).toBe(true)
    expect(existingTokens.has("333333")).toBe(true)
  })
})

describe("writeAliasesFile", () => {
  it("writes existing tokens to a file string", () => {
    const existingTokens = new Set(["111111", "222222", "333333"])
    const file = writeAliasesFile(existingTokens)

    const lines = file.split("\n")
    expect(lines).toEqual(["111111", "222222", "333333"])
  })
})