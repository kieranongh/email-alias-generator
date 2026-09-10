# email-alias-generator

Generates simple &lt;user>+&lt;random>@&lt;domain> email aliases for use when signing up for accounts. This helps to identify the source of spam

## Installation

1. Clone the repo
2. Install node (use the version matching `engines` in app/package.json)
3. Navigate to the app directory (`cd ./app`)
4. Install the dependencies (`npm i`)

## Commands

- `npm run dev` - Start the development server.
- `npm run build` - Build for production.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Runs ESLint
- `npm run test` - Run jest in "watch" mode
- `npm run test:once` - Runs jest once
- `npm run predeploy` - Hook that builds the application before deployment
- `npm run deploy` - Deploy to GitHub pages on "master" branch

## API

This application has a UI and components to make it easier to interact with the functions written.

However, a magic way to use the functions in this application like in a REPL has been made available

In any modern browser, you'll have a Console in the Dev tools (On Chrome and Firefox, Ctrl+Shift+I opens the Dev tools, and you can click on the Console tab from there)

Once you have a Console open, any of the functions in email-alias-generator file have
been exposed on the window - you can run them directly by calling them

Some examples, simply type in the Console:

```javascript
generateAttempt(5) > "12345";

getNewAlias({ email: "user@example.com", existingTokens: new Set() }) >
  "user+123456@example.com";
```

A full list of the API:

```typescript
generateAttempt(digits: number): string
generateUniqueToken(existingTokens: Set<string>): string
getNewEmailAlias({ email, existingTokens }: { email: string, existingTokens: Set<string>}): string
getTokenFromAlias(alias: string): string
getUsernameAndDomain(email: string): [string, string]
readAliasesFile(text: string): Set<string>
writeAliasesFile(existingAliases: Set<string>): string
```

## Python

For Python users, Python versions of the core functionality are provided

### Setup

```bash
cd python-utils
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Python commands

- `npm run py:lint` - Runs black and ruff to lint python files
- `npm run py:test` - Runs pytest
- `pip-compile` - Compile requirements.txt after adding a new Python lib to requirements.in

### Pythonic counterparts

```python
def generate_attempt(digits: int) -> str
def generate_unique_token(existing_tokens: set[str], depth: int = 0) -> str
def get_new_email_alias(email: str, existing_tokens: set[str]) -> tuple[str, str]
def get_token_from_alias(alias: str) -> str
def get_username_and_domain(email: str) -> tuple[str, str]
def load_aliases_from_file(filename: str) -> set[str]
def store_aliases_to_file(tokens: set[str], filename: str) -> None
```

### Build set up

This application was built from a template for React + TypeScript using Vite.
