const TOKEN_LENGTH = 6
const MAX_TRIES = 20

export const generateAttempt = (digits) => {
  // generate a random number, truncated to number of digits
  const num = Math.floor(Math.random() * Math.pow(10, digits))

  // pad out with 0s to required digits (for small random numbers)
  return String(num).padStart(digits, 0)
}

let recursionCount = 0
export const generateUniqueToken = (existingTokens) => {
  const attempt = generateAttempt(TOKEN_LENGTH)
  ++recursionCount

  if (existingTokens.has(attempt)) {
    if (recursionCount === MAX_TRIES) {
      throw Error("Cannot find a new token. May succeed if you try again")
    }
    return generateUniqueToken(existingTokens)
  } else {
    recursionCount = 0
    return attempt
  }
}

export const getUsernameAndDomain = (email) => {
  return email.split("@")
}

export const getNewEmailAlias = ({ email, existingTokens }) => {
  const [username, domain] = getUsernameAndDomain(email)
  const token = generateUniqueToken(existingTokens)
  existingTokens.add(token)
  return `${username}+${token}@${domain}`
}