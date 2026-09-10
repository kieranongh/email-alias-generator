import random
import re

from email_validator import EmailNotValidError, validate_email

TOKEN_LENGTH = 6
MAX_TRIES = 20
MAX_EMAIL_INPUT_LENGTH = 64 - 1 - TOKEN_LENGTH


def load_aliases_from_file(filename: str) -> set[str]:
    """
    Load aliases from given filename and returns a set
    Note: if there are any duplicates, they'll be removed
    """
    if not filename:
        raise ValueError("filename cannot be empty")

    token_set: set[str] = set()
    with open(filename, "r") as f:
        for line in f:
            token_set.add(line.strip())

    return token_set


def store_aliases_to_file(tokens: set[str], filename: str) -> None:
    """
    Store aliases as a file at the given filename - one alias
    per line
    """
    if not filename:
        raise ValueError("filename cannot be empty")
    with open(filename, "w") as f:
        for token in tokens:
            f.write(f"{token}\n")


def generate_attempt(digits: int) -> str:
    """
    Generates possible tokens, simply return "digits" number
    of random numerical digits
    """
    if digits < 1:
        raise ValueError("digits must be 1 or higher")

    # generate a random integer - up to number of digits
    num: int = int(random.random() * (10**digits))

    # pad out with 0s to required digits (for small random numbers)
    return str(num).zfill(digits)


def generate_unique_token(existing_tokens: set[str], depth: int = 0) -> str:
    """
    Repeats the function trying to generate a unique token
    that's not in the set or will fail after MAX_TRIES to
    prevent infinite loops
    """
    # Generate an attempt
    attempt = generate_attempt(TOKEN_LENGTH)

    # If attempt already exists, increment recursion counter
    if attempt in existing_tokens:
        # Gracefully fail if we try too many times, let the user try again
        if depth >= MAX_TRIES:
            raise RuntimeError("Cannot find a new token. May succeed if you try again")

        # Try another attempt
        return generate_unique_token(existing_tokens, depth + 1)
    else:
        # Success! Reset recursion counter for next time
        return attempt


def get_username_and_domain(email: str) -> tuple[str, str]:
    """
    Separate out the username and domain from an email string
    """
    non_aliased_email = email

    # Allow aliased emails, but remove the alias out
    if "+" in email:
        non_aliased_email = re.sub(r"\+[^@]+@", "@", email)
    return non_aliased_email.split("@")


def get_token_from_alias(alias: str) -> str:
    """
    Separate out the token from an alias string
    """
    alias_trimmed = alias.strip()

    # Run email regex checker - throw an error if it's not an email
    try:
        validate_email(alias_trimmed, check_deliverability=False)
    except EmailNotValidError:
        raise ValueError(f"Email: {alias_trimmed} is invalid")

    if re.search(r"\+.*\+", alias_trimmed):
        raise ValueError(
            "Whilst emails with multiple '+'s are valid, this application "
            + "is not built for them, please remove them"
        )

    if "+" not in alias_trimmed:
        raise ValueError(f"{alias_trimmed} is not an aliased email")

    return alias_trimmed[alias_trimmed.index("+") + 1 : alias_trimmed.index("@")]


def get_new_email_alias(email: str, existing_tokens: set[str]) -> tuple[str, str]:
    """
    Key function that generates unique aliases from the given email
    and ensures uniqueness against the given set of existing tokens
    """
    email_trimmed = email.strip()

    # Run email regex checker - throw an error if it's not an email
    try:
        validate_email(email_trimmed, check_deliverability=False)
    except EmailNotValidError:
        raise ValueError(f"Email: {email_trimmed} is invalid")

    import re

    # Check for multiple pluses (1..*) - we can't handle them
    if re.search(r"\+.*\+", email_trimmed):
        raise ValueError(
            "Whilst emails with multiple '+'s are valid, this application "
            + "is not built for them, please remove them"
        )

    username, domain = get_username_and_domain(email_trimmed)

    # Check that the email length will still be valid with our alias added
    if len(username) > MAX_EMAIL_INPUT_LENGTH:
        raise ValueError(
            f"Email must be {MAX_EMAIL_INPUT_LENGTH} or less characters to be "
            + "valid with an alias"
        )

    # Generate token, add it to the set and return an alias
    token = generate_unique_token(existing_tokens)
    existing_tokens.add(token)
    return [f"{username}+{token}@{domain}", token]
