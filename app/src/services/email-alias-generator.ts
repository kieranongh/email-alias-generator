import emailRegexSafe from "email-regex-safe"

const TOKEN_LENGTH = 6
const MAX_TRIES = 20
const MAX_EMAIL_INPUT_LENGTH = 64 - 1 - TOKEN_LENGTH

export const generateAttempt = (digits) => {
  // generate a random number, truncated to number of digits
  const num = Math.floor(Math.random() * Math.pow(10, digits))

  // pad out with 0s to required digits (for small random numbers)
  return String(num).padStart(digits, "0")
}

let recursionCount = 0
export const generateUniqueToken = (existingTokens) => {
  const attempt = generateAttempt(TOKEN_LENGTH)
  ++recursionCount

  if (existingTokens.has(attempt)) {
    if (recursionCount >= MAX_TRIES) {
      recursionCount = 0
      throw Error("Cannot find a new token. May succeed if you try again")
    }
    return generateUniqueToken(existingTokens)
  } else {
    recursionCount = 0
    return attempt
  }
}

export const getUsernameAndDomain = (email) => {
  let nonAliasedEmail = email
  if (email.includes("+")) {
    nonAliasedEmail = email.replace(/\+[^@]+@/, "@");
  }
  return nonAliasedEmail.split("@")
}

export const getTokenFromAlias = (alias: string) => {
  /**
   * Separate out the token from an alias string
   */
  if (!alias.includes("+")) {
    throw new Error(`${alias} is not an aliased email`)
  }

  return alias.slice(alias.indexOf("+") + 1, alias.indexOf("@"))
}

export interface GetNewEmailAliasProps {
  email: string
  existingTokens: Set<string>
}
export const getNewEmailAlias = ({ email, existingTokens }: GetNewEmailAliasProps) => {
  const emailTrimmed = email.trim()
  if (!emailRegexSafe({ exact: true }).test(emailTrimmed)) {
    throw new Error(`Email: ${emailTrimmed} is invalid`)
  }
  if (/\+.*\+/.test(emailTrimmed)) {
    throw new Error("Whilst emails with multiple "+"s are valid, this application is not built for them, please remove them")
  }
  const [username, domain] = getUsernameAndDomain(emailTrimmed)
  if (username.length > MAX_EMAIL_INPUT_LENGTH) {
    throw new Error("Email must be 57 or less characters to be valid with an alias")
  }
  const token = generateUniqueToken(existingTokens)
  existingTokens.add(token)
  return `${username}+${token}@${domain}`
}

export const readAliasesFile = (text: string) => {
  const lines = text.split("\n")
  return new Set(lines)
}

export const writeAliasesFile = (existingTokens: Set<string>) => {
  return [...existingTokens].join("\n")
}
