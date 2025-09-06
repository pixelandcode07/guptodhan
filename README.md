## Guptodhan Folder Structure

```bash


├── .gitignore
├── README.md
├── bun.lock
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
    ├── file.svg
    ├── globe.svg
    ├── guptodhan.png
    ├── img
    │   ├── StoreBanner.jpeg
    │   ├── StoreLogo.jpeg
    │   └── logo.jpg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
├── src
    ├── app
    │   ├── api
    │   │   ├── auth
    │   │   │   └── [...nextauth]
    │   │   │   │   └── route.ts
    │   │   ├── otp
    │   │   │   ├── send-email
    │   │   │   │   └── route.ts
    │   │   │   ├── verify-email
    │   │   │   │   └── route.ts
    │   │   │   └── verify-phone
    │   │   │   │   └── route.ts
    │   │   └── v1
    │   │   │   ├── auth
    │   │   │       ├── change-password
    │   │   │       │   └── route.ts
    │   │   │       ├── forgot-password
    │   │   │       │   ├── get-reset-token-with-firebas
    │   │   │       │   │   └── route.ts
    │   │   │       │   ├── reset-password
    │   │   │       │   │   └── route.ts
    │   │   │       │   ├── send-email-otp
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── verify-email-otp
    │   │   │       │   │   └── route.ts
    │   │   │       ├── login
    │   │   │       │   └── route.ts
    │   │   │       ├── logout
    │   │   │       │   └── route.ts
    │   │   │       ├── refresh-token
    │   │   │       │   └── route.ts
    │   │   │       ├── register-service-provider
    │   │   │       │   └── route.ts
    │   │   │       ├── register-vendor
    │   │   │       │   └── route.ts
    │   │   │       └── set-password
    │   │   │       │   └── route.ts
    │   │   │   ├── profile
    │   │   │       └── me
    │   │   │       │   └── route.ts
    │   │   │   ├── user
    │   │   │       ├── [id]
    │   │   │       │   └── router.ts
    │   │   │       ├── register
    │   │   │       │   └── route.ts
    │   │   │       └── test-db
    │   │   │       │   └── route.ts
    │   │   │   └── users
    │   │   │       ├── [id]
    │   │   │           └── route.ts
    │   │   │       └── route.ts
    │   ├── favicon.ico
    │   ├── general
    │   │   ├── about
    │   │   │   └── us
    │   │   │   │   └── page
    │   │   │   │       └── page.tsx
    │   │   ├── add
    │   │   │   ├── new
    │   │   │   │   ├── blog
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── category
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── childcategory
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── code
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── product
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── subcategory
    │   │   │   │   │   └── page.tsx
    │   │   │   └── testimonial
    │   │   │   │   └── page.tsx
    │   │   ├── banners
    │   │   │   ├── page.tsx
    │   │   │   └── promotional
    │   │   │   │   └── banner
    │   │   │   │       └── page.tsx
    │   │   ├── blog
    │   │   │   ├── api
    │   │   │   │   └── category
    │   │   │   │   │   ├── [id]
    │   │   │   │   │       └── route.ts
    │   │   │   │   │   └── route.ts
    │   │   │   ├── categories
    │   │   │   │   └── page.tsx
    │   │   │   └── comments
    │   │   │   │   └── page.tsx
    │   │   ├── buy
    │   │   │   └── sell
    │   │   │   │   ├── config
    │   │   │   │       └── page.tsx
    │   │   │   │   └── listing
    │   │   │   │       └── page.tsx
    │   │   ├── config
    │   │   │   └── setup
    │   │   │   │   └── page.tsx
    │   │   ├── content
    │   │   │   └── config
    │   │   │   │   └── page.tsx
    │   │   ├── create
    │   │   │   ├── buy
    │   │   │   │   └── sell
    │   │   │   │   │   └── category
    │   │   │   │   │       └── page.tsx
    │   │   │   ├── cta
    │   │   │   │   └── page.tsx
    │   │   │   ├── donation
    │   │   │   │   └── category
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── new
    │   │   │   │   ├── page
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── store
    │   │   │   │   │   ├── components
    │   │   │   │   │   │   ├── CreateNewStoreFrom.tsx
    │   │   │   │   │   │   ├── StoreInformation.tsx
    │   │   │   │   │   │   ├── StoreMetaInfo.tsx
    │   │   │   │   │   │   └── StoreSocialLinks.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── vendor
    │   │   │   │   │   ├── components
    │   │   │   │   │   │   ├── Attachment.tsx
    │   │   │   │   │   │   ├── BusinessInfo.tsx
    │   │   │   │   │   │   ├── CreateVendorForm.tsx
    │   │   │   │   │   │   └── OwnerInfo.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── withdraw
    │   │   │   │   │   └── page.tsx
    │   │   │   └── vendor
    │   │   │   │   ├── api
    │   │   │   │       └── category
    │   │   │   │       │   ├── [id]
    │   │   │   │       │       └── route.ts
    │   │   │   │       │   ├── childCategory
    │   │   │   │       │       ├── [id]
    │   │   │   │       │       │   └── route.ts
    │   │   │   │       │       └── route.ts
    │   │   │   │       │   ├── route.ts
    │   │   │   │       │   └── subCategory
    │   │   │   │       │       ├── [id]
    │   │   │   │       │           └── route.ts
    │   │   │   │       │       └── route.ts
    │   │   │   │   └── category
    │   │   │   │       └── page.tsx
    │   │   ├── custom
    │   │   │   └── css
    │   │   │   │   └── js
    │   │   │   │       └── page.tsx
    │   │   ├── donation
    │   │   │   ├── config
    │   │   │   │   └── page.tsx
    │   │   │   ├── listing
    │   │   │   │   └── page.tsx
    │   │   │   └── requests
    │   │   │   │   └── page.tsx
    │   │   ├── error.tsx
    │   │   ├── faq
    │   │   │   ├── api
    │   │   │   │   └── category
    │   │   │   │   │   ├── [id]
    │   │   │   │   │       └── route.ts
    │   │   │   │   │   └── route.ts
    │   │   │   └── categories
    │   │   │   │   └── page.tsx
    │   │   ├── generate
    │   │   │   └── demo
    │   │   │   │   └── products
    │   │   │   │       └── page.tsx
    │   │   ├── home
    │   │   │   └── page.tsx
    │   │   ├── info
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx
    │   │   ├── loading.tsx
    │   │   ├── logout
    │   │   │   └── page.tsx
    │   │   ├── on
    │   │   │   └── hold
    │   │   │   │   └── support
    │   │   │   │       └── tickets
    │   │   │   │           └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── pending
    │   │   │   └── support
    │   │   │   │   └── tickets
    │   │   │   │       └── page.tsx
    │   │   ├── products
    │   │   │   └── from
    │   │   │   │   └── excel
    │   │   │   │       └── page.tsx
    │   │   ├── rejected
    │   │   │   └── support
    │   │   │   │   └── tickets
    │   │   │   │       └── page.tsx
    │   │   ├── remove
    │   │   │   └── demo
    │   │   │   │   └── products
    │   │   │   │       └── page
    │   │   │   │           └── page.tsx
    │   │   ├── sales
    │   │   │   └── report
    │   │   │   │   └── page.tsx
    │   │   ├── send
    │   │   │   ├── notification
    │   │   │   │   └── page
    │   │   │   │   │   └── page.tsx
    │   │   │   └── sms
    │   │   │   │   └── page
    │   │   │   │       └── page.tsx
    │   │   ├── seo
    │   │   │   └── homepage
    │   │   │   │   └── page.tsx
    │   │   ├── setup
    │   │   │   ├── courier
    │   │   │   │   └── api
    │   │   │   │   │   └── keys
    │   │   │   │   │       └── page.tsx
    │   │   │   ├── payment
    │   │   │   │   └── gateway
    │   │   │   │   │   └── page.tsx
    │   │   │   └── sms
    │   │   │   │   └── gateway
    │   │   │   │       └── page.tsx
    │   │   ├── sliders
    │   │   │   └── page.tsx
    │   │   ├── social
    │   │   │   ├── chat
    │   │   │   │   └── script
    │   │   │   │   │   └── page
    │   │   │   │   │       └── page.tsx
    │   │   │   └── media
    │   │   │   │   └── page
    │   │   │   │       └── page.tsx
    │   │   ├── solved
    │   │   │   └── support
    │   │   │   │   └── tickets
    │   │   │   │       └── page.tsx
    │   │   ├── team
    │   │   │   └── config
    │   │   │   │   └── page.tsx
    │   │   ├── terms
    │   │   │   └── and
    │   │   │   │   └── condition
    │   │   │   │       └── page.tsx
    │   │   ├── view
    │   │   │   ├── all
    │   │   │   │   ├── blogs
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── brands
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── category
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── childcategory
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── colors
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── contact
    │   │   │   │   │   └── requests
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── device
    │   │   │   │   │   └── conditions
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── faqs
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── flags
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── models
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── pages
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── sims
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── sizes
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── storages
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── stores
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── subcategory
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── subscribed
    │   │   │   │   │   └── users
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── units
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── vendors
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── warrenties
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── withdraws
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── buy
    │   │   │   │   └── sell
    │   │   │   │   │   └── categories
    │   │   │   │   │       └── page.tsx
    │   │   │   ├── cancelled
    │   │   │   │   └── withdraws
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── completed
    │   │   │   │   └── withdraws
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── customers
    │   │   │   │   └── wishlist
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── delivery
    │   │   │   │   └── charges
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── donation
    │   │   │   │   └── categories
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── email
    │   │   │   │   ├── credential
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── templates
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── facts
    │   │   │   │   └── page.tsx
    │   │   │   ├── footer
    │   │   │   │   ├── all
    │   │   │   │   │   ├── brands
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── category
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── childcategory
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── colors
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── customers
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── flags
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── models
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── notifications
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── product
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── promo
    │   │   │   │   │   │   └── codes
    │   │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── sizes
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── storages
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   ├── subcategory
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   │   └── units
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   └── widget
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── inactive
    │   │   │   │   └── vendors
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── others
    │   │   │   │   └── page.tsx
    │   │   │   ├── payment
    │   │   │   │   └── history
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── permission
    │   │   │   │   └── routes
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── privacy
    │   │   │   │   └── policy
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── product
    │   │   │   │   ├── question
    │   │   │   │   │   └── answer
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   └── reviews
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── return
    │   │   │   │   └── policy
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── shipping
    │   │   │   │   └── policy
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── sms
    │   │   │   │   ├── history
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── templates
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── system
    │   │   │   │   └── users
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── terms
    │   │   │   │   └── page.tsx
    │   │   │   ├── testimonials
    │   │   │   │   └── page.tsx
    │   │   │   ├── upazila
    │   │   │   │   └── thana
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── user
    │   │   │   │   ├── role
    │   │   │   │   │   └── permission
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   └── roles
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── vendor
    │   │   │   │   ├── categories
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── requests
    │   │   │   │   │   └── page.tsx
    │   │   │   └── withdraw
    │   │   │   │   └── requests
    │   │   │   │       └── page.tsx
    │   │   └── website
    │   │   │   └── theme
    │   │   │       └── page
    │   │   │           └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components
    │   ├── DashboardComponent
    │   │   ├── AppSidebar.tsx
    │   │   ├── DashNavbar.tsx
    │   │   └── MotherRoutes
    │   │   │   ├── EcommerceModules.tsx
    │   │   │   ├── Multivendor.tsx
    │   │   │   └── WebsiteConfig.tsx
    │   ├── SessionProviderWrapper.tsx
    │   ├── TableHelper
    │   │   ├── ConfigSetupClient.tsx
    │   │   ├── PaginationControls.tsx
    │   │   ├── SortHeader.tsx
    │   │   ├── allWithdrawal.tsx
    │   │   ├── all_store_columns.tsx
    │   │   ├── approved_vendor_columns.tsx
    │   │   ├── brand_columns.tsx
    │   │   ├── category_columns.tsx
    │   │   ├── color_columns.tsx
    │   │   ├── columns.tsx
    │   │   ├── data-table.tsx
    │   │   ├── device_condition_columns.tsx
    │   │   ├── flag_columns.tsx
    │   │   ├── inactive_vendor_columns.tsx
    │   │   ├── model_columns.tsx
    │   │   ├── sim_columns.tsx
    │   │   ├── size_columns.tsx
    │   │   ├── storage_columns.tsx
    │   │   ├── unit_columns.tsx
    │   │   ├── vendor_req_columns.tsx
    │   │   └── warranty_columns.tsx
    │   └── ui
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── pagination.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    ├── data
    │   ├── data.ts
    │   └── sidebar.ts
    ├── hooks
    │   └── use-mobile.ts
    ├── lib
    │   ├── db.ts
    │   ├── email-templates
    │   │   └── otp.ejs
    │   ├── firebaseAdmin.ts
    │   ├── middlewares
    │   │   ├── catchAsync.ts
    │   │   └── checkRole.ts
    │   ├── modules
    │   │   ├── auth
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.interface.ts
    │   │   │   ├── auth.service.ts
    │   │   │   └── auth.validation.ts
    │   │   ├── otp
    │   │   │   ├── otp.controller.ts
    │   │   │   ├── otp.service.ts
    │   │   │   └── otp.validation.ts
    │   │   ├── service-provider
    │   │   │   ├── serviceProvider.interface.ts
    │   │   │   └── serviceProvider.model.ts
    │   │   ├── user
    │   │   │   ├── user.controller.ts
    │   │   │   ├── user.interface.ts
    │   │   │   ├── user.model.ts
    │   │   │   ├── user.service.ts
    │   │   │   └── user.validation.ts
    │   │   └── vendor
    │   │   │   ├── vendor.interface.ts
    │   │   │   └── vendor.model.ts
    │   ├── redis.ts
    │   ├── utils.ts
    │   └── utils
    │   │   ├── cloudinary.ts
    │   │   ├── email.ts
    │   │   ├── jwt.ts
    │   │   ├── sendResponse.ts
    │   │   └── sms.ts
    └── middleware.ts
└── tsconfig.json

```
