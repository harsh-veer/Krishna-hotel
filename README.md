This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email OTP for bookings

Every booking (home form, room pages and the chatbot) asks the guest to verify their email with a 6-digit code before the request is saved. Codes are sent from a Gmail account for free.

1. Turn on 2-Step Verification for the Gmail account at https://myaccount.google.com/security.
2. Create an App Password at https://myaccount.google.com/apppasswords (name it "Krishna Hotel website") and copy the 16-character password.
3. Set these environment variables in `.env.local` and in Vercel (Project → Settings → Environment Variables), then redeploy:
   - `GMAIL_USER` — the Gmail address, e.g. `krishnahotel10851@gmail.com`
   - `GMAIL_APP_PASSWORD` — the App Password from step 2
   - `OTP_SECRET` — optional, any long random string

Limits: a code is valid for 10 minutes, a guest can request one code a minute and 5 an hour, and 5 wrong tries cancel the code. Gmail allows about 500 emails a day. In local development without Gmail set up, the code is printed in the terminal instead of emailed.
