# Sentry Cookies Checkout Automation

This TypeScript program automates the checkout process for Sentry Shop cookies.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Edit the `.env` file with your information:
- Fill in your email, name, address, and payment details
- Make sure to use valid credit card information

## Usage

1. Build the TypeScript code:
```bash
npm run build
```

2. Run the program:
```bash
npm start
```

## Important Notes

- The program runs in non-headless mode by default (you can see the browser)
- Set `headless: true` in `src/index.ts` for production use
- Make sure your internet connection is stable
- The program includes error handling and will log any issues
- Review the information before final submission

## Security

- Never commit your `.env` file
- Keep your payment information secure
- The program uses environment variables to protect sensitive data

## Disclaimer

This is for educational purposes only. Please ensure you comply with the website's terms of service and any applicable laws when using automated checkout scripts. 