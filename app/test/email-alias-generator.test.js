import { jest, expect } from "@jest/globals"
import { generateAttempt, getUsernameAndDomain } from "../email-alias-generator"

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