import random
from pathlib import Path
from unittest.mock import patch

import pytest

from src.email_alias_generator import (
    generate_attempt,
    generate_unique_token,
    get_new_email_alias,
    get_token_from_alias,
    get_username_and_domain,
    load_aliases_from_file,
    store_aliases_to_file,
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


class TestLoadAliasesFromFile:
    def test_should_raise_error_when_filename_empty(self) -> None:
        with pytest.raises(ValueError, match="filename cannot be empty"):
            load_aliases_from_file("")

    def test_should_load_aliases_from_existing_file(self, tmp_path: Path) -> None:
        file_path = tmp_path / "aliases.csv"
        file_path.write_text("ab+111111@c.co\nab+222222@c.co\nab+333333@c.co\n")

        result = load_aliases_from_file(str(file_path))

        assert result == {"ab+111111@c.co", "ab+222222@c.co", "ab+333333@c.co"}

    def test_should_return_empty_set_for_empty_file(self, tmp_path: Path) -> None:
        file_path = tmp_path / "empty_aliases.csv"
        file_path.write_text("")

        result = load_aliases_from_file(str(file_path))

        assert result == set()


class TestStoreAliasesToFile:
    def test_should_raise_error_when_filename_empty(self) -> None:
        with pytest.raises(ValueError, match="filename cannot be empty"):
            store_aliases_to_file({"ab+111111@c.co"}, "")

    def test_should_write_aliases_to_file(self, tmp_path: Path) -> None:
        file_path = tmp_path / "aliases.csv"
        aliases = {"ab+111111@c.co", "ab+222222@c.co"}

        store_aliases_to_file(aliases, str(file_path))

        with open(file_path, "r") as f:
            lines = f.readlines()

        assert set(line.strip() for line in lines) == aliases

    def test_should_write_empty_file_when_aliases_set_is_empty(
        self, tmp_path: Path
    ) -> None:
        file_path = tmp_path / "empty_aliases.csv"

        store_aliases_to_file(set(), str(file_path))

        assert file_path.read_text() == ""


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


class TestGetTokenFromAlias:
    @pytest.mark.parametrize(
        "input_email, expected_token",
        [
            ("ab+111111@c.co", "111111"),
            ("user+999999@example.com", "999999"),
            ("  spaced+999999@out.com  ", "999999"),
            ("different+schema.type@example.com", "schema.type"),
        ],
    )
    def test_should_correctly_read_tokens_in_aliases(
        self, input_email: str, expected_token: str
    ) -> None:
        assert get_token_from_alias(input_email) == expected_token

    def test_should_throw_if_no_plus_in_input(self) -> None:
        with pytest.raises(ValueError, match="is not an aliased email"):
            get_token_from_alias("ab@c.co")

    @pytest.mark.parametrize(
        "alias",
        [
            "plainstring",
            "comma@example,com",
            "domain@.starts.with.dot",
            ".user@starts.with.dot",
            "invalid@domain-.com",
            '"quoted"@example.com',
            "double@at@domain.com",
        ],
    )
    def test_should_error_on_invalid_email(self, alias: str) -> None:
        with pytest.raises(ValueError, match=f"Email: {alias} is invalid"):
            get_token_from_alias(alias)

    def test_should_error_on_double_plused_emails(self) -> None:
        alias = "double+alias+ed@domain.com"
        with pytest.raises(
            ValueError,
            match="Whilst emails with multiple '\\+'s are valid, this application "
            + "is not built for them, please remove them",
        ):
            get_token_from_alias(alias)


class TestGetNewEmailAlias:
    @pytest.mark.parametrize(
        "_, email, existing_tokens, expected_alias, expected_token, expected_tokens",
        [
            (
                "with an empty set",
                "ab@c.co",
                set(),
                "ab+111111@c.co",
                "111111",
                {"111111"},
            ),
            (
                "after a few failed attempts",
                "ab@c.co",
                {"111111", "222222"},
                "ab+333333@c.co",
                "333333",
                {"111111", "222222", "333333"},
            ),
            (
                "with already aliased emails",
                "ab+1@c.co",
                {"111111"},
                "ab+222222@c.co",
                "222222",
                {"111111", "222222"},
            ),
            (
                "with just under max length email",
                "a" * 57 + "@ok.com",
                set(),
                "a" * 57 + "+111111@ok.com",
                "111111",
                {"111111"},
            ),
            (
                "with leading space",
                "  prespaced@example.com",
                set(),
                "prespaced+111111@example.com",
                "111111",
                {"111111"},
            ),
            (
                "with trailing space",
                "postspaced@example.com    \n\r",
                set(),
                "postspaced+111111@example.com",
                "111111",
                {"111111"},
            ),
        ],
    )
    def test_should_succeed(
        self,
        _: any,
        email: str,
        existing_tokens: set[str],
        expected_alias: str,
        expected_token: str,
        expected_tokens: set[str],
    ) -> None:
        seq = [0.111111, 0.222222, 0.333333]
        with patch.object(random, "random", side_effect=lambda: seq.pop(0)):
            result = get_new_email_alias(email=email, existing_tokens=existing_tokens)
            assert result == [expected_alias, expected_token]
            assert existing_tokens == expected_tokens

    def test_should_fail_but_succeed_on_retries(self) -> None:
        existing_tokens = {"111111", "222222", "999999"}
        seq = [0.111111, 0.222222]

        with patch.object(
            random, "random", side_effect=lambda: seq.pop(0) if seq else 0.999999
        ):
            with pytest.raises(
                RuntimeError,
                match="Cannot find a new token. May succeed if you try again",
            ):
                get_new_email_alias(email="ab@c.co", existing_tokens=existing_tokens)
        with patch.object(random, "random", return_value=0.333333):
            assert get_new_email_alias(
                email="ab@c.co", existing_tokens=existing_tokens
            ) == ["ab+333333@c.co", "333333"]

    @pytest.mark.parametrize(
        "email",
        [
            "plainstring",
            "comma@example,com",
            "domain@.starts.with.dot",
            ".user@starts.with.dot",
            "invalid@domain-.com",
            '"quoted"@example.com',
            "double@at@domain.com",
        ],
    )
    def test_should_error_on_invalid_email(self, email: str) -> None:
        with pytest.raises(ValueError, match=f"Email: {email} is invalid"):
            get_new_email_alias(email=email, existing_tokens=set())

    def test_should_error_on_double_plused_emails(self) -> None:
        email = "double+alias+ed@domain.com"
        with pytest.raises(
            ValueError,
            match="Whilst emails with multiple '\\+'s are valid, this application "
            + "is not built for them, please remove them",
        ):
            get_new_email_alias(email=email, existing_tokens=set())

    def test_should_error_if_email_too_long(self) -> None:
        email = "a" * 58 + "@toolong.com"
        with pytest.raises(
            ValueError,
            match="Email must be 57 or less characters to be valid with an alias",
        ):
            get_new_email_alias(email=email, existing_tokens=set())
