## Live Link Guptodhan Project

```bash
https://guptodhan.vercel.app/

```
 
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
    │   ├── Banner-image-contentmanagement.jpg
    │   ├── StoreBanner.jpeg
    │   ├── StoreLogo.jpeg
    │   ├── demo_products_img.png
    │   └── logo.png
    ├── logo.png
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
    │   │   │   ├── brands
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── classifieds-banners
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── classifieds-categories
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── classifieds-subcategories
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       ├── route.ts
    │   │   │       └── subcategories
    │   │   │       │   └── route.ts
    │   │   │   ├── classifieds
    │   │   │       └── ads
    │   │   │       │   ├── [id]
    │   │   │       │       └── route.ts
    │   │   │       │   └── route.ts
    │   │   │   ├── editions
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── product-models
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── profile
    │   │   │       └── me
    │   │   │       │   └── route.ts
    │   │   │   ├── public
    │   │   │       └── categories-with-subcategories
    │   │   │       │   └── route.ts
    │   │   │   ├── reports
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
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
    │   │   │   │       ├── Components
    │   │   │   │           └── AboutUsForm.tsx
    │   │   │   │       └── page.tsx
    │   │   ├── add
    │   │   │   ├── new
    │   │   │   │   ├── blog
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   ├── BlogEntryForm.tsx
    │   │   │   │   │   │   ├── BlogEntryFormWrapper.tsx
    │   │   │   │   │   │   ├── BlogForm.tsx
    │   │   │   │   │   │   ├── BlogSeoForm.tsx
    │   │   │   │   │   │   ├── BlogSeoInfo.tsx
    │   │   │   │   │   │   └── TagInput.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── category
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   └── BlogCategoryTable.tsx
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
    │   │   │   │   ├── Components
    │   │   │   │       └── TestimonialForm.tsx
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
    │   │   │   │   │       ├── components
    │   │   │   │   │           └── BuySellCreateForm.tsx
    │   │   │   │   │       └── page.tsx
    │   │   │   ├── cta
    │   │   │   │   ├── Components
    │   │   │   │   │   └── CTAForm.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── donation
    │   │   │   │   └── category
    │   │   │   │   │   ├── components
    │   │   │   │   │       └── DonationCreateForm.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── new
    │   │   │   │   ├── page
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   └── SeoForm.tsx
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
    │   │   │   │   │   ├── components
    │   │   │   │   │       ├── CreateNewWithdrawFrom.tsx
    │   │   │   │   │       └── WithdrawInfo.tsx
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
    │   │   │   │       ├── Components
    │   │   │   │           └── CodeSnipate.tsx
    │   │   │   │       └── page.tsx
    │   │   ├── donation
    │   │   │   ├── config
    │   │   │   │   ├── components
    │   │   │   │   │   └── DonationConfigForm.tsx
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
    │   │   │   │   ├── Components
    │   │   │   │       └── FaqCategoriesTable.tsx
    │   │   │   │   └── page.tsx
    │   │   ├── generate
    │   │   │   └── demo
    │   │   │   │   └── products
    │   │   │   │       ├── components
    │   │   │   │           └── DemoProductForm.tsx
    │   │   │   │       └── page.tsx
    │   │   ├── home
    │   │   │   └── page.tsx
    │   │   ├── info
    │   │   │   ├── Components
    │   │   │   │   └── GeneralInfoForm.tsx
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
    │   │   │   │   ├── Components
    │   │   │   │       ├── OpenGraphForm.tsx
    │   │   │   │       ├── SeoOptimizationForm.tsx
    │   │   │   │       └── TagInput.tsx
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
    │   │   │   │   │       ├── Components
    │   │   │   │   │           ├── CrispLiveChat.tsx
    │   │   │   │   │           ├── FacebookPixelForm.tsx
    │   │   │   │   │           ├── GoogleAnalyticsForm.tsx
    │   │   │   │   │           ├── GoogleRecaptcha.tsx
    │   │   │   │   │           ├── GoogleTagManagerForm.tsx
    │   │   │   │   │           ├── MessegeChatPlugin.tsx
    │   │   │   │   │           ├── SocialLoginForm.tsx
    │   │   │   │   │           └── TawkLiveChat.tsx
    │   │   │   │   │       └── page.tsx
    │   │   │   └── media
    │   │   │   │   └── page
    │   │   │   │       ├── Components
    │   │   │   │           └── MediaLinks.tsx
    │   │   │   │       └── page.tsx
    │   │   ├── solved
    │   │   │   └── support
    │   │   │   │   └── tickets
    │   │   │   │       └── page.tsx
    │   │   ├── team
    │   │   │   └── config
    │   │   │   │   ├── Components
    │   │   │   │       └── TeamConfigForm.tsx
    │   │   │   │   └── page.tsx
    │   │   ├── terms
    │   │   │   └── and
    │   │   │   │   └── condition
    │   │   │   │       ├── Components
    │   │   │   │           └── TermsForm.tsx
    │   │   │   │       └── page.tsx
    │   │   ├── view
    │   │   │   ├── all
    │   │   │   │   ├── banners
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── blogs
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   └── BlogTable.tsx
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
    │   │   │   │   ├── customers
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── device
    │   │   │   │   │   └── conditions
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── faqs
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── flags
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── models
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── notifications
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── pages
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   └── AllPagesTable.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── product
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── promo
    │   │   │   │   │   └── codes
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── sims
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── sizes
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── sliders
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
    │   │   │   │   ├── Components
    │   │   │   │   │   └── FactTabile.tsx
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
    │   │   │   │   │   ├── Components
    │   │   │   │   │       ├── Social_links.tsx
    │   │   │   │   │       ├── Wideget_1.tsx
    │   │   │   │   │       ├── Wideget_2.tsx
    │   │   │   │   │       └── Wideget_3.tsx
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
    │   │   │   │   │   ├── Components
    │   │   │   │   │       └── PermissionRouteTable.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── privacy
    │   │   │   │   └── policy
    │   │   │   │   │   ├── Components
    │   │   │   │   │       └── PrivacyForm.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── product
    │   │   │   │   ├── question
    │   │   │   │   │   └── answer
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   └── reviews
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── promotional
    │   │   │   │   └── banner
    │   │   │   │   │   ├── components
    │   │   │   │   │       ├── BackgroundImage.tsx
    │   │   │   │   │       ├── BannerCreateForm.tsx
    │   │   │   │   │       ├── BannerStructure.tsx
    │   │   │   │   │       ├── HeaderIcon.tsx
    │   │   │   │   │       └── ProductImage.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── return
    │   │   │   │   └── policy
    │   │   │   │   │   ├── Components
    │   │   │   │   │       └── RetunPolicyForm.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── shipping
    │   │   │   │   └── policy
    │   │   │   │   │   ├── Components
    │   │   │   │   │       └── ShipingForm.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── sms
    │   │   │   │   ├── history
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── templates
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── system
    │   │   │   │   └── users
    │   │   │   │   │   ├── Components
    │   │   │   │   │       └── UserFilter.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── terms
    │   │   │   │   ├── Components
    │   │   │   │   │   └── TeamTable.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── testimonials
    │   │   │   │   ├── Components
    │   │   │   │   │   └── TestimonialsTable.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── upazila
    │   │   │   │   └── thana
    │   │   │   │   │   └── page.tsx
    │   │   │   ├── user
    │   │   │   │   ├── role
    │   │   │   │   │   └── permission
    │   │   │   │   │   │   ├── Components
    │   │   │   │   │   │       └── PermissionUsersTable.tsx
    │   │   │   │   │   │   └── page.tsx
    │   │   │   │   └── roles
    │   │   │   │   │   ├── Components
    │   │   │   │   │       └── UserRolesTable.tsx
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
    │   │   │           ├── Components
    │   │   │               └── ThemeColorCard.tsx
    │   │   │           └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components
    │   ├── DashboardComponent
    │   │   ├── AppSidebar.tsx
    │   │   ├── DashNavbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── MotherRoutes
    │   │   │   ├── BuySell.tsx
    │   │   │   ├── CRMModules.tsx
    │   │   │   ├── ContentManagement.tsx
    │   │   │   ├── DemoProducts.tsx
    │   │   │   ├── Donation.tsx
    │   │   │   ├── EcommerceModules.tsx
    │   │   │   ├── Logout.tsx
    │   │   │   ├── Multivendor.tsx
    │   │   │   ├── UserRolePermition.tsx
    │   │   │   └── WebsiteConfig.tsx
    │   ├── ReusableComponents
    │   │   ├── BreadcrumbNav.tsx
    │   │   ├── RichTextEditor.tsx
    │   │   └── TabsLayout.tsx
    │   ├── RichTextEditor
    │   │   └── RichTextEditor.tsx
    │   ├── SessionProviderWrapper.tsx
    │   ├── TableHelper
    │   │   ├── ConfigSetupClient.tsx
    │   │   ├── PaginationControls.tsx
    │   │   ├── SortHeader.tsx
    │   │   ├── allWithdrawal.tsx
    │   │   ├── all_page_columns.tsx
    │   │   ├── all_store_columns.tsx
    │   │   ├── approved_vendor_columns.tsx
    │   │   ├── banner_columns.tsx
    │   │   ├── blog_cagegory_columns.tsx
    │   │   ├── blogs_columns.tsx
    │   │   ├── brand_columns.tsx
    │   │   ├── buySellListing_columns.tsx
    │   │   ├── cancelled_withdraw_columns.tsx
    │   │   ├── category_columns.tsx
    │   │   ├── childcategory_columns.tsx
    │   │   ├── color_columns.tsx
    │   │   ├── columns.tsx
    │   │   ├── complet_withdraw_columns.tsx
    │   │   ├── customer_columns.tsx
    │   │   ├── data-table.tsx
    │   │   ├── delivery_charges_columns.tsx
    │   │   ├── device_condition_columns.tsx
    │   │   ├── donation_listing.tsx
    │   │   ├── donation_request.tsx
    │   │   ├── email_credential_columns.tsx
    │   │   ├── fact_columns.tsx
    │   │   ├── faq_categories.tsx
    │   │   ├── faq_columns.tsx
    │   │   ├── flag_columns.tsx
    │   │   ├── inactive_vendor_columns.tsx
    │   │   ├── model_columns.tsx
    │   │   ├── notification_columns.tsx
    │   │   ├── payment_history_columns.tsx
    │   │   ├── permition_route_list_columns.tsx
    │   │   ├── product_columns.tsx
    │   │   ├── promo_codes_columns.tsx
    │   │   ├── question_answer_columns.tsx
    │   │   ├── review_columns.tsx
    │   │   ├── role_parmition_user_columns.tsx
    │   │   ├── sim_columns.tsx
    │   │   ├── size_columns.tsx
    │   │   ├── slider_columns.tsx
    │   │   ├── sms_history_columns.tsx
    │   │   ├── sms_template_columns.tsx
    │   │   ├── storage_columns.tsx
    │   │   ├── subcategory_columns.tsx
    │   │   ├── system_users_columns.tsx
    │   │   ├── terms_columns.tsx
    │   │   ├── testimonial_columns.tsx
    │   │   ├── unit_columns.tsx
    │   │   ├── upazila_thana_columns.tsx
    │   │   ├── user_role_columns.tsx
    │   │   ├── vendor_req_columns.tsx
    │   │   ├── view_buy_sell_columns.tsx
    │   │   ├── view_donation_columns.tsx
    │   │   ├── warranty_columns.tsx
    │   │   ├── wishlist_columns.tsx
    │   │   └── withdraw_req_columns.tsx
    │   └── ui
    │   │   ├── SectionTitle.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── color-picker.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    ├── config
    │   └── routeconfig.ts
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
    │   │   ├── brand
    │   │   │   ├── brand.controller.ts
    │   │   │   ├── brand.interface.ts
    │   │   │   ├── brand.model.ts
    │   │   │   ├── brand.service.ts
    │   │   │   └── brand.validation.ts
    │   │   ├── classifieds-banner
    │   │   │   ├── banner.controller.ts
    │   │   │   ├── banner.interface.ts
    │   │   │   ├── banner.model.ts
    │   │   │   ├── banner.service.ts
    │   │   │   └── banner.validation.ts
    │   │   ├── classifieds-category
    │   │   │   ├── category.controller.ts
    │   │   │   ├── category.interface.ts
    │   │   │   ├── category.model.ts
    │   │   │   ├── category.service.ts
    │   │   │   └── category.validation.ts
    │   │   ├── classifieds-subcategory
    │   │   │   ├── subcategory.controller.ts
    │   │   │   ├── subcategory.interface.ts
    │   │   │   ├── subcategory.model.ts
    │   │   │   ├── subcategory.service.ts
    │   │   │   └── subcategory.validation.ts
    │   │   ├── classifieds
    │   │   │   ├── ad.controller.ts
    │   │   │   ├── ad.interface.ts
    │   │   │   ├── ad.model.ts
    │   │   │   ├── ad.service.ts
    │   │   │   └── ad.validation.ts
    │   │   ├── edition
    │   │   │   ├── edition.controller.ts
    │   │   │   ├── edition.interface.ts
    │   │   │   ├── edition.model.ts
    │   │   │   ├── edition.service.ts
    │   │   │   └── edition.validation.ts
    │   │   ├── otp
    │   │   │   ├── otp.controller.ts
    │   │   │   ├── otp.service.ts
    │   │   │   └── otp.validation.ts
    │   │   ├── product-model
    │   │   │   ├── productModel.controller.ts
    │   │   │   ├── productModel.interface.ts
    │   │   │   ├── productModel.model.ts
    │   │   │   ├── productModel.service.ts
    │   │   │   └── productModel.validation.ts
    │   │   ├── reports
    │   │   │   ├── report.controller.ts
    │   │   │   ├── report.interface.ts
    │   │   │   ├── report.model.ts
    │   │   │   ├── report.service.ts
    │   │   │   └── report.validation.ts
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
