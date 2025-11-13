import pytest
import random
from unittest.mock import patch

from src.email_alias_generator import generate_attempt

def _fixed_random():
    """Return the constant value used in the original Jest test."""
    return 0.123456789


@pytest.mark.parametrize(
    "digits,expected",
    [
        (6, "123456"),
        (3, "123"),
        (8, "12345678"),
    ],
)
def test_generate_attempt(digits: int, expected: str):
    with patch.object(random, "random", _fixed_random):
        result = generate_attempt(digits)

    assert result == expected