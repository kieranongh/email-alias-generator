import random


def generate_attempt(digits: int) -> str: 
    """
    Generates possible tokens, simply return "digits" number
    of random numerical digits
    """
    if digits < 1:
        raise ValueError("digits must be 1 or higher")
    # generate a random integer - up to number of digits
    # num: int = random.randrange(0, 10**digits)
    num: int = int(random.random() * (10 ** digits))

    # pad out with 0s to required digits (for small random numbers)
    return str(num).zfill(digits)
