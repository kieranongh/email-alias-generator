import emailRegexSafe from "email-regex-safe"

const TOKEN_LENGTH = 6
const MAX_TRIES = 20
const MAX_EMAIL_INPUT_LENGTH = 64 - 1 - TOKEN_LENGTH

export const generateAttempt = (digits: number) => {
  /**
   * Generates possible tokens, simply return "digits" number
   * of random numerical digits
   */
  // generate a random number, truncated to number of digits
  const num = Math.floor(Math.random() * Math.pow(10, digits))

  // pad out with 0s to required digits (for small random numbers)
  return String(num).padStart(digits, "0")
}

let recursionCount = 0
export const generateUniqueToken = (existingTokens: Set<string>) => {
  /**
   * Repeats the function trying to generate a unique token
   * that's not in the set or will fail to prevent infinite
   * loops
   */
  // Generate an attempt
  const attempt = generateAttempt(TOKEN_LENGTH)
  ++recursionCount

  // If attempt already exists, increment recursion counter
  if (existingTokens.has(attempt)) {
    // Gracefully fail if we try too many times, let the user try again
    if (recursionCount >= MAX_TRIES) {
      recursionCount = 0
      throw Error("Cannot find a new token. May succeed if you try again")
    }

    // Try another attempt
    return generateUniqueToken(existingTokens)
  } else {
    // Success! Reset recursion counter for next time
    recursionCount = 0
    return attempt
  }
}

export const getUsernameAndDomain = (email: string) => {
  /**
   * Separate out the username and domain from an email string
   */
  let nonAliasedEmail = email
  // Allow aliased emails, but remove the alias out
  if (email.includes("+")) {
    nonAliasedEmail = email.replace(/\+[^@]+@/, "@")
  }
  return nonAliasedEmail.split("@")
}

export const getTokenFromAlias = (alias: string) => {
  /**
   * Separate out the token from an alias string
   */
  const aliasTrimmed = alias.trim()

  // Run email regex checker - throw an error if it's not an email
  if (!emailRegexSafe({ exact: true }).test(aliasTrimmed)) {
    throw new Error(`Email: ${aliasTrimmed} is invalid`)
  }
  if (/\+.*\+/.test(aliasTrimmed)) {
    throw new Error(
      "Whilst emails with multiple '+'s are valid, this application is not built for them, please remove them",
    )
  }
  if (!alias.includes("+")) {
    throw new Error(`${alias} is not an aliased email`)
  }

  return alias.slice(alias.indexOf("+") + 1, alias.indexOf("@"))
}

export interface GetNewEmailAliasProps {
  email: string
  existingTokens: Set<string>
}
export const getNewEmailAlias = ({
  email,
  existingTokens,
}: GetNewEmailAliasProps) => {
  /**
   * Key function that generates unique aliases from the given email
   * and ensures uniqueness against the given set of existing tokens
   */
  const emailTrimmed = email.trim()

  // Run email regex checker - throw an error if it's not an email
  if (!emailRegexSafe({ exact: true }).test(emailTrimmed)) {
    throw new Error(`Email: ${emailTrimmed} is invalid`)
  }

  // Check for multiple pluses (1..*) - we can't handle them
  if (/\+.*\+/.test(emailTrimmed)) {
    throw new Error(
      "Whilst emails with multiple '+'s are valid, this application is not built for them, please remove them",
    )
  }

  const [username, domain] = getUsernameAndDomain(emailTrimmed)

  // Check that the email length will still be valid with our alias added
  if (username.length > MAX_EMAIL_INPUT_LENGTH) {
    throw new Error(
      "Email must be 57 or less characters to be valid with an alias",
    )
  }

  // Generate token, add it to the set and return an alias
  const token = generateUniqueToken(existingTokens)
  existingTokens.add(token)
  return {
    alias: `${username}+${token}@${domain}`,
    token,
  }
}

export const readAliasesFile = (text: string) => {
  const lines = text.split("\n")
  return new Set(lines)
}

export const writeAliasesFile = (existingTokens: Set<string>) => {
  return [...existingTokens].join("\n")
}

if (typeof window !== "undefined") {
  window.generateAttempt = generateAttempt
  window.generateUniqueToken = generateUniqueToken
  window.getNewEmailAlias = getNewEmailAlias
  window.getTokenFromAlias = getTokenFromAlias
  window.getUsernameAndDomain = getUsernameAndDomain
  window.readAliasesFile = readAliasesFile
  window.writeAliasesFile = writeAliasesFile
}
