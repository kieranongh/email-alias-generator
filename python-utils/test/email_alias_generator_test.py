import pytest
import random
from unittest.mock import patch

from src.email_alias_generator import (
    generate_attempt,
    generate_unique_token,
    get_username_and_domain,
)


def _fixed_random() -> float:
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
def test_generate_attempt(digits: int, expected: str) -> None:
    with patch.object(random, "random", _fixed_random):
        result = generate_attempt(digits)

    assert result == expected


class TestGenerateUniqueToken:
    def test_returns_first_new_token(self) -> None:
        existing = set()
        seq = [0.111111, 0.222222, 0.999999]
        with patch.object(random, "random", side_effect=lambda: seq.pop(0)):
            assert generate_unique_token(existing) == "111111"

    def test_tries_again_if_token_exists(self) -> None:
        existing = {"111111", "222222"}
        seq = [0.111111, 0.222222, 0.999999]
        with patch.object(random, "random", side_effect=lambda: seq.pop(0)):
            assert generate_unique_token(existing) == "999999"

    def test_fails_then_succeeds_on_retry(self) -> None:
        existing = {"111111", "222222", "999999"}
        seq = [0.111111, 0.222222]

        with patch.object(
            random, "random", side_effect=lambda: seq.pop(0) if seq else 0.999999
        ):
            with pytest.raises(RuntimeError) as exc:
                generate_unique_token(existing)
                assert (
                    str(exc.value)
                    == "Cannot find a new token. May succeed if you try again"
                )
        with patch.object(random, "random", return_value=0.333333):
            assert generate_unique_token(existing) == "333333"


class TestGetUsernameAndDomain:
    @pytest.mark.parametrize(
        "email,expected_username,expected_domain",
        [
            ("ab@c.co", "ab", "c.co"),
            ("my@email.com", "my", "email.com"),
            ("has.dots@au", "has.dots", "au"),
            ("under_scored@my_domain.xyz", "under_scored", "my_domain.xyz"),
            ("my+alias@email.com", "my", "email.com"),
            ("reinput+111111@aliases.r.us", "reinput", "aliases.r.us"),
        ],
    )
    def test_get_username_and_domain(
        self, email: str, expected_username: str, expected_domain: str
    ) -> None:
        result = get_username_and_domain(email)

        assert result == [expected_username, expected_domain]
