import random
import re

TOKEN_LENGTH = 6
MAX_TRIES = 20
MAX_EMAIL_INPUT_LENGTH = 64 - 1 - TOKEN_LENGTH


def generate_attempt(digits: int) -> str:
    """
    Generates possible tokens, simply return "digits" number
    of random numerical digits
    """
    if digits < 1:
        raise ValueError("digits must be 1 or higher")

    # generate a random integer - up to number of digits
    # num: int = random.randrange(0, 10**digits)
    num: int = int(random.random() * (10**digits))

    # pad out with 0s to required digits (for small random numbers)
    return str(num).zfill(digits)


def generate_unique_token(existing_tokens: set[str], depth: int = 0) -> str:
    """
    Repeats the function trying to generate a unique token
    that's not in the set or will fail to prevent infinite
    loops
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
