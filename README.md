<<<<<<< HEAD
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
"# guptodhan-dashboard01" 
=======
## Guptodhan Folder Structure

```bash


├── .gitignore
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
├── src
    └── app
    │   ├── favicon.ico
    │   ├── general
    │       ├── about
    │       │   └── us
    │       │   │   └── page
    │       │   │       └── page.tsx
    │       ├── add
    │       │   ├── new
    │       │   │   ├── blog
    │       │   │   │   └── page.tsx
    │       │   │   ├── category
    │       │   │   │   └── page.tsx
    │       │   │   ├── childcategory
    │       │   │   │   └── page.tsx
    │       │   │   ├── code
    │       │   │   │   └── page.tsx
    │       │   │   ├── product
    │       │   │   │   └── page.tsx
    │       │   │   └── subcategory
    │       │   │   │   └── page.tsx
    │       │   └── testimonial
    │       │   │   └── page.tsx
    │       ├── banners
    │       │   ├── page.tsx
    │       │   └── promotional
    │       │   │   └── banner
    │       │   │       └── page.tsx
    │       ├── blog
    │       │   ├── categories
    │       │   │   └── page.tsx
    │       │   └── comments
    │       │   │   └── page.tsx
    │       ├── buy
    │       │   └── sell
    │       │   │   ├── config
    │       │   │       └── page.tsx
    │       │   │   └── listing
    │       │   │       └── page.tsx
    │       ├── config
    │       │   └── setup
    │       │   │   └── page.tsx
    │       ├── content
    │       │   └── config
    │       │   │   └── page.tsx
    │       ├── create
    │       │   ├── buy
    │       │   │   └── sell
    │       │   │   │   └── category
    │       │   │   │       └── page.tsx
    │       │   ├── cta
    │       │   │   └── page.tsx
    │       │   ├── donation
    │       │   │   └── category
    │       │   │   │   └── page.tsx
    │       │   ├── new
    │       │   │   ├── page
    │       │   │   │   └── page.tsx
    │       │   │   ├── store
    │       │   │   │   └── page.tsx
    │       │   │   ├── vendor
    │       │   │   │   └── page.tsx
    │       │   │   └── withdraw
    │       │   │   │   └── page.tsx
    │       │   └── vendor
    │       │   │   └── category
    │       │   │       └── page.tsx
    │       ├── custom
    │       │   └── css
    │       │   │   └── js
    │       │   │       └── page.tsx
    │       ├── donation
    │       │   ├── config
    │       │   │   └── page.tsx
    │       │   ├── listing
    │       │   │   └── page.tsx
    │       │   └── requests
    │       │   │   └── page.tsx
    │       ├── error.tsx
    │       ├── faq
    │       │   └── categories
    │       │   │   └── page.tsx
    │       ├── generate
    │       │   └── demo
    │       │   │   └── products
    │       │   │       └── page.tsx
    │       ├── info
    │       │   └── page.tsx
    │       ├── layout.tsx
    │       ├── loading.tsx
    │       ├── logout
    │       │   └── page.tsx
    │       ├── on
    │       │   └── hold
    │       │   │   └── support
    │       │   │       └── tickets
    │       │   │           └── page.tsx
    │       ├── page.tsx
    │       ├── pending
    │       │   └── support
    │       │   │   └── tickets
    │       │   │       └── page.tsx
    │       ├── products
    │       │   └── from
    │       │   │   └── excel
    │       │   │       └── page.tsx
    │       ├── rejected
    │       │   └── support
    │       │   │   └── tickets
    │       │   │       └── page.tsx
    │       ├── remove
    │       │   └── demo
    │       │   │   └── products
    │       │   │       └── page
    │       │   │           └── page.tsx
    │       ├── sales
    │       │   └── report
    │       │   │   └── page.tsx
    │       ├── send
    │       │   ├── notification
    │       │   │   └── page
    │       │   │   │   └── page.tsx
    │       │   └── sms
    │       │   │   └── page
    │       │   │       └── page.tsx
    │       ├── seo
    │       │   └── homepage
    │       │   │   └── page.tsx
    │       ├── setup
    │       │   ├── courier
    │       │   │   └── api
    │       │   │   │   └── keys
    │       │   │   │       └── page.tsx
    │       │   ├── payment
    │       │   │   └── gateway
    │       │   │   │   └── page.tsx
    │       │   └── sms
    │       │   │   └── gateway
    │       │   │       └── page.tsx
    │       ├── sliders
    │       │   └── page.tsx
    │       ├── social
    │       │   ├── chat
    │       │   │   └── script
    │       │   │   │   └── page
    │       │   │   │       └── page.tsx
    │       │   └── media
    │       │   │   └── page
    │       │   │       └── page.tsx
    │       ├── solved
    │       │   └── support
    │       │   │   └── tickets
    │       │   │       └── page.tsx
    │       ├── team
    │       │   └── config
    │       │   │   └── page.tsx
    │       ├── terms
    │       │   └── and
    │       │   │   └── condition
    │       │   │       └── page.tsx
    │       ├── view
    │       │   ├── all
    │       │   │   ├── blogs
    │       │   │   │   └── page.tsx
    │       │   │   ├── brands
    │       │   │   │   └── page.tsx
    │       │   │   ├── category
    │       │   │   │   └── page.tsx
    │       │   │   ├── childcategory
    │       │   │   │   └── page.tsx
    │       │   │   ├── colors
    │       │   │   │   └── page.tsx
    │       │   │   ├── contact
    │       │   │   │   └── requests
    │       │   │   │   │   └── page.tsx
    │       │   │   ├── faqs
    │       │   │   │   └── page.tsx
    │       │   │   ├── flags
    │       │   │   │   └── page.tsx
    │       │   │   ├── models
    │       │   │   │   └── page.tsx
    │       │   │   ├── pages
    │       │   │   │   └── page.tsx
    │       │   │   ├── sizes
    │       │   │   │   └── page.tsx
    │       │   │   ├── storages
    │       │   │   │   └── page.tsx
    │       │   │   ├── stores
    │       │   │   │   └── page.tsx
    │       │   │   ├── subcategory
    │       │   │   │   └── page.tsx
    │       │   │   ├── subscribed
    │       │   │   │   └── users
    │       │   │   │   │   └── page.tsx
    │       │   │   ├── units
    │       │   │   │   └── page.tsx
    │       │   │   ├── vendors
    │       │   │   │   └── page.tsx
    │       │   │   └── withdraws
    │       │   │   │   └── page.tsx
    │       │   ├── buy
    │       │   │   └── sell
    │       │   │   │   └── categories
    │       │   │   │       └── page.tsx
    │       │   ├── cancelled
    │       │   │   └── withdraws
    │       │   │   │   └── page.tsx
    │       │   ├── completed
    │       │   │   └── withdraws
    │       │   │   │   └── page.tsx
    │       │   ├── customers
    │       │   │   └── wishlist
    │       │   │   │   └── page.tsx
    │       │   ├── delivery
    │       │   │   └── charges
    │       │   │   │   └── page.tsx
    │       │   ├── donation
    │       │   │   └── categories
    │       │   │   │   └── page.tsx
    │       │   ├── email
    │       │   │   ├── credential
    │       │   │   │   └── page.tsx
    │       │   │   └── templates
    │       │   │   │   └── page.tsx
    │       │   ├── facts
    │       │   │   └── page.tsx
    │       │   ├── footer
    │       │   │   ├── all
    │       │   │   │   ├── brands
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── category
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── childcategory
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── colors
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── customers
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── flags
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── models
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── notifications
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── product
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── promo
    │       │   │   │   │   └── codes
    │       │   │   │   │   │   └── page.tsx
    │       │   │   │   ├── sizes
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── storages
    │       │   │   │   │   └── page.tsx
    │       │   │   │   ├── subcategory
    │       │   │   │   │   └── page.tsx
    │       │   │   │   └── units
    │       │   │   │   │   └── page.tsx
    │       │   │   └── widget
    │       │   │   │   └── page.tsx
    │       │   ├── inactive
    │       │   │   └── vendors
    │       │   │   │   └── page.tsx
    │       │   ├── others
    │       │   │   └── page.tsx
    │       │   ├── payment
    │       │   │   └── history
    │       │   │   │   └── page.tsx
    │       │   ├── permission
    │       │   │   └── routes
    │       │   │   │   └── page.tsx
    │       │   ├── privacy
    │       │   │   └── policy
    │       │   │   │   └── page.tsx
    │       │   ├── product
    │       │   │   ├── question
    │       │   │   │   └── answer
    │       │   │   │   │   └── page.tsx
    │       │   │   └── reviews
    │       │   │   │   └── page.tsx
    │       │   ├── return
    │       │   │   └── policy
    │       │   │   │   └── page.tsx
    │       │   ├── shipping
    │       │   │   └── policy
    │       │   │   │   └── page.tsx
    │       │   ├── sms
    │       │   │   ├── history
    │       │   │   │   └── page.tsx
    │       │   │   └── templates
    │       │   │   │   └── page.tsx
    │       │   ├── system
    │       │   │   └── users
    │       │   │   │   └── page.tsx
    │       │   ├── terms
    │       │   │   └── page.tsx
    │       │   ├── testimonials
    │       │   │   └── page.tsx
    │       │   ├── upazila
    │       │   │   └── thana
    │       │   │   │   └── page.tsx
    │       │   ├── user
    │       │   │   ├── role
    │       │   │   │   └── permission
    │       │   │   │   │   └── page.tsx
    │       │   │   └── roles
    │       │   │   │   └── page.tsx
    │       │   ├── vendor
    │       │   │   ├── categories
    │       │   │   │   └── page.tsx
    │       │   │   └── requests
    │       │   │   │   └── page.tsx
    │       │   └── withdraw
    │       │   │   └── requests
    │       │   │       └── page.tsx
    │       └── website
    │       │   └── theme
    │       │       └── page
    │       │           └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
└── tsconfig.json

```
>>>>>>> e3b186b3c24301ce4278161fa5144e28060b6126
