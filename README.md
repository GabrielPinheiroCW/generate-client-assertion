# Generate Client Assertion JWT

JWT Client Assertion generator for Open Finance.

## Installation

### Local Installation

```bash
npm install
```

### Global Installation

```bash
npm install -g
```

## Configuration

### Option 1: .env File (Recommended)

Create a `.env` file in the project root with the following values:

```bash
ISS=12345678-1234-5678-9abc-def012345678
SUB=12345678-1234-5678-9abc-def012345678
AUD=https://example.com/oauth2/token
KID=example-key-id-abcd1234
PRIVATE_KEY_PATH=~/path/to/your/private.key
```

### Option 2: Command Line Parameters

You can override the `.env` values by passing parameters:

```bash
node generate-client-assertion.js [iss] [sub] [aud] [kid] [privateKeyPath]
```

## Usage

### With configured .env file:

```bash
node generate-client-assertion.js
```

### If installed globally:

The global command will automatically use the `.env` file from the project directory, so you can run it from anywhere:

```bash
generate-client-assertion
```

### Overriding specific values:

```bash
# Override only ISS and SUB
node generate-client-assertion.js "new-iss" "new-sub"

# Override all values
node generate-client-assertion.js "iss" "sub" "aud" "kid" "/path/to/key.key"

# With global installation
generate-client-assertion "iss" "sub" "aud" "kid" "/path/to/key.key"
```

## Features

- ✅ Loads configuration from `.env` file
- ✅ Allows overriding values via command line
- ✅ Generates JWT with PS256 algorithm
- ✅ Automatically copies to clipboard
- ✅ Validates required parameters

## Precedence Order

1. Command line parameters (highest priority)
2. Variables from `.env` file
3. Default values in code (if no .env exists)

The generated JWT will be automatically copied to the clipboard.
