export const TOKEN_LENGTH = 6

const generateAttempt = (digits) => {
  // generate a random number, truncated to number of digits
  const num = Math.floor(Math.random() * Math.pow(10, digits))

  // pad out with 0s to required digits (for small random numbers)
  return String(num).padStart(digits, 0)
}

const generateUniqueToken = (existingTokens) => {
  const attempt = generateAttempt(TOKEN_LENGTH)
  if (existingTokens.has(attempt)) {
    return getToken(existingTokens)
  } else {
    existingTokens.add(attempt)
    return attempt
  }
}

const getUsernameAndDomain = (email) => {
  return email.split("@")
}

export const getNewEmailAlias = ({ email, existingTokens }) => {
  const [username, domain] = getUsernameAndDomain(email)
  const token = generateUniqueToken(existingTokens)
  return `${username}+${token}@${domain}`
}