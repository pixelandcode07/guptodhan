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
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
    ├── file.svg
    ├── globe.svg
    ├── guptodhan.png
    ├── img
    │   ├── AppleLogo.png
    │   ├── Banner-image-contentmanagement.jpg
    │   ├── Group.png
    │   ├── Mastercard.png
    │   ├── Nagad.png
    │   ├── Rocket.png
    │   ├── StoreBanner.jpeg
    │   ├── StoreLogo.jpeg
    │   ├── all-service.png
    │   ├── amarPay.png
    │   ├── banner.png
    │   ├── banner2.jpg
    │   ├── banner3.png
    │   ├── bkash.png
    │   ├── buysell
    │   │   ├── agriculture.png
    │   │   ├── buysell-banner.png
    │   │   ├── education.png
    │   │   ├── electronics.png
    │   │   ├── essentials.png
    │   │   ├── furniture.png
    │   │   ├── gadgets.png
    │   │   ├── men-fashion.png
    │   │   ├── phone.png
    │   │   ├── property.png
    │   │   ├── sports.png
    │   │   ├── vehicles.png
    │   │   └── women-fashion.png
    │   ├── car-rent.png
    │   ├── classic.png
    │   ├── cleaning.png
    │   ├── demo_products_img.png
    │   ├── footerimage1.png
    │   ├── logo.png
    │   ├── paypal.png
    │   ├── playstore.png
    │   ├── product
    │   │   ├── p-1.png
    │   │   ├── p-2.png
    │   │   ├── p-3.png
    │   │   ├── p-4.png
    │   │   └── p-5.png
    │   ├── regular.png
    │   ├── repair.png
    │   ├── service.png
    │   ├── shifting.png
    │   ├── sslcommerz.png
    │   ├── stripe.png
    │   └── visa.png
    ├── logo.png
    ├── next.svg
    ├── vercel.svg
    └── window.svg
├── src
    ├── Providers
    │   ├── LayoutWrapper.tsx
    │   └── SessionProviderWrapper.tsx
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
    │   │   │   ├── about
    │   │   │       ├── content
    │   │   │       │   └── route.ts
    │   │   │       ├── cta
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── facts
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       └── team
    │   │   │       │   ├── [id]
    │   │   │       │       └── route.ts
    │   │   │       │   └── route.ts
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
    │   │   │       ├── register-vendor
    │   │   │       │   └── route.ts
    │   │   │       ├── service-providers
    │   │   │       │   └── register
    │   │   │       │   │   └── route.ts
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
    │   │   │   ├── conversations
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── custom-code
    │   │   │       └── route.ts
    │   │   │   ├── donation-campaigns
    │   │   │       └── route.ts
    │   │   │   ├── donation-categories
    │   │   │       └── route.ts
    │   │   │   ├── donation-configs
    │   │   │       └── route.ts
    │   │   │   ├── editions
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── footer-widgets
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── integrations
    │   │   │       └── route.ts
    │   │   │   ├── product-config
    │   │   │       ├── brandName
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── modelName
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── productColor
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── productFlag
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── productSize
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── productUnit
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       └── storageType
    │   │   │       │   ├── [id]
    │   │   │       │       └── route.ts
    │   │   │       │   └── route.ts
    │   │   │   ├── product-models
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── product-review
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── profile
    │   │   │       └── me
    │   │   │       │   └── route.ts
    │   │   │   ├── promo-code
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── public
    │   │   │       ├── about
    │   │   │       │   ├── content
    │   │   │       │   │   └── route.ts
    │   │   │       │   ├── cta
    │   │   │       │   │   └── route.ts
    │   │   │       │   ├── facts
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── team
    │   │   │       │   │   └── route.ts
    │   │   │       ├── categories-with-subcategories
    │   │   │       │   └── route.ts
    │   │   │       ├── custom-code
    │   │   │       │   └── route.ts
    │   │   │       ├── donation-campaigns
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── donation-categories
    │   │   │       │   └── route.ts
    │   │   │       ├── donation-configs
    │   │   │       │   └── route.ts
    │   │   │       ├── footer-widgets
    │   │   │       │   └── route.ts
    │   │   │       ├── integrations
    │   │   │       │   └── route.ts
    │   │   │       ├── seo-settings
    │   │   │       │   └── route.ts
    │   │   │       ├── service-categories
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── subcategories
    │   │   │       │   │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── service-providers
    │   │   │       │   └── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       ├── settings
    │   │   │       │   └── route.ts
    │   │   │       ├── social-links
    │   │   │       │   └── route.ts
    │   │   │       └── theme-settings
    │   │   │       │   └── route.ts
    │   │   │   ├── reports
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── seo-settings
    │   │   │       └── route.ts
    │   │   │   ├── service-categories
    │   │   │       ├── [id]
    │   │   │       │   ├── route.ts
    │   │   │       │   └── subcategories
    │   │   │       │   │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── service-providers
    │   │   │       └── login
    │   │   │       │   └── route.ts
    │   │   │   ├── service-subcategories
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── services
    │   │   │       ├── route.ts
    │   │   │       └── search
    │   │   │       │   └── route.ts
    │   │   │   ├── settings
    │   │   │       └── route.ts
    │   │   │   ├── social-links
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── testimonial
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── theme-settings
    │   │   │       └── route.ts
    │   │   │   ├── user
    │   │   │       ├── [id]
    │   │   │       │   └── router.ts
    │   │   │       ├── register
    │   │   │       │   └── route.ts
    │   │   │       └── test-db
    │   │   │       │   └── route.ts
    │   │   │   ├── users
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   ├── vendor-category
    │   │   │       ├── vendorCategory
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       ├── vendorChildCategory
    │   │   │       │   ├── [id]
    │   │   │       │   │   └── route.ts
    │   │   │       │   └── route.ts
    │   │   │       └── vendorSubCagetory
    │   │   │       │   ├── [id]
    │   │   │       │       └── route.ts
    │   │   │       │   └── route.ts
    │   │   │   ├── vendor-product
    │   │   │       ├── [id]
    │   │   │       │   └── route.ts
    │   │   │       └── route.ts
    │   │   │   └── vendor-store
    │   │   │       ├── [id]
    │   │   │           └── route.ts
    │   │   │       └── route.ts
    │   ├── components
    │   │   ├── BestSell
    │   │   │   └── BestSell.tsx
    │   │   ├── Feature
    │   │   │   ├── Feature.tsx
    │   │   │   └── ShopByCategory.tsx
    │   │   ├── FlashSale
    │   │   │   └── FlashSale.tsx
    │   │   ├── Hero
    │   │   │   ├── Hero.tsx
    │   │   │   ├── HeroFooter.tsx
    │   │   │   ├── HeroImage.tsx
    │   │   │   └── HeroNav.tsx
    │   │   ├── JustForYou
    │   │   │   └── JustForYou.tsx
    │   │   ├── LogInAndRegister
    │   │   │   ├── LogIn_Register.tsx
    │   │   │   └── components
    │   │   │   │   ├── CreateAccount.tsx
    │   │   │   │   ├── Forgetpin.tsx
    │   │   │   │   ├── LogIn.tsx
    │   │   │   │   ├── SetNewPin.tsx
    │   │   │   │   ├── SetPin.tsx
    │   │   │   │   ├── SocialLoginPart.tsx
    │   │   │   │   └── VerifyOTP.tsx
    │   │   ├── ProductDetailsPage
    │   │   │   ├── AverageRatingCard.tsx
    │   │   │   ├── DeliveryOption.tsx
    │   │   │   ├── DescriptionBox.tsx
    │   │   │   ├── ProductCard.tsx
    │   │   │   ├── ProductCarousel.tsx
    │   │   │   ├── ProductDetails.tsx
    │   │   │   ├── QASection.tsx
    │   │   │   ├── ReviewCard.tsx
    │   │   │   └── ReviewLIst.tsx
    │   │   └── SharedRoutes
    │   │   │   ├── HomeFooter.tsx
    │   │   │   ├── HomeNavbar.tsx
    │   │   │   └── components
    │   │   │       ├── BuySellNavMain.tsx
    │   │   │       ├── DonationNavMain.tsx
    │   │   │       ├── FooterFoot.tsx
    │   │   │       ├── FooterLinks.tsx
    │   │   │       ├── Footerbanner.tsx
    │   │   │       ├── NavHead.tsx
    │   │   │       ├── NavMain.tsx
    │   │   │       └── SearchBar.tsx
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
    │   │   │   │   ├── banner
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   ├── BannerForm.tsx
    │   │   │   │   │   │   ├── ButtonRow.tsx
    │   │   │   │   │   │   ├── DetailsFields.tsx
    │   │   │   │   │   │   ├── Links.tsx
    │   │   │   │   │   │   ├── MediaUpload.tsx
    │   │   │   │   │   │   ├── Options.tsx
    │   │   │   │   │   │   ├── TextFields.tsx
    │   │   │   │   │   │   ├── TopRow.tsx
    │   │   │   │   │   │   └── types.ts
    │   │   │   │   │   └── page.tsx
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
    │   │   │   │   │   │   ├── BasicInfo.tsx
    │   │   │   │   │   │   ├── BlogCategoryTable.tsx
    │   │   │   │   │   │   ├── CategoryForm.tsx
    │   │   │   │   │   │   ├── MediaUploads.tsx
    │   │   │   │   │   │   └── Options.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── childcategory
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   ├── ChildCategory.tsx
    │   │   │   │   │   │   └── fields
    │   │   │   │   │   │   │   ├── BasicInfo.tsx
    │   │   │   │   │   │   │   └── MediaUpload.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── code
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── product
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── slider
    │   │   │   │   │   ├── Components
    │   │   │   │   │   │   ├── SliderForm.tsx
    │   │   │   │   │   │   └── parts
    │   │   │   │   │   │   │   ├── ButtonRow.tsx
    │   │   │   │   │   │   │   ├── DetailsFields.tsx
    │   │   │   │   │   │   │   ├── MediaUpload.tsx
    │   │   │   │   │   │   │   └── TopRow.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── subcategory
    │   │   │   │   │   ├── Components
    │   │   │   │   │       ├── Subcategory.tsx
    │   │   │   │   │       └── fields
    │   │   │   │   │       │   ├── BasicInfo.tsx
    │   │   │   │   │       │   ├── MediaUploads.tsx
    │   │   │   │   │       │   └── Options.tsx
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
    │   │   ├── contact
    │   │   │   └── config
    │   │   │   │   ├── ContactConfigForm.tsx
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
    │   │   │   ├── Components
    │   │   │   │   ├── CardChart.tsx
    │   │   │   │   ├── CircleChart.tsx
    │   │   │   │   └── SalaesAnlytcChart.tsx
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
    │   │   │   │       ├── components
    │   │   │   │           └── ExcelUpload.tsx
    │   │   │   │       ├── page.tsx
    │   │   │   │       └── undraw_spreadsheets_383w.svg
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
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── sections
    │   │   │   │       └── SalesReportFilters.tsx
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
    │   │   │   │   └── gateways
    │   │   │   │   │   ├── components
    │   │   │   │   │       ├── PaymentCard.tsx
    │   │   │   │   │       └── PaymentForms.tsx
    │   │   │   │   │   └── page.tsx
    │   │   │   └── sms
    │   │   │   │   └── gateways
    │   │   │   │       ├── components
    │   │   │   │           ├── SMSCard.tsx
    │   │   │   │           └── SMSForms.tsx
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
    │   │   │   │   │   ├── components
    │   │   │   │   │   │   └── AddBannerButton.tsx
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
    │   │   │   │   │   ├── components
    │   │   │   │   │       ├── MailTemplates.tsx
    │   │   │   │   │       └── TemplateCard.tsx
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
    │   │   │   ├── orders
    │   │   │   │   ├── components
    │   │   │   │   │   ├── OrdersPage.tsx
    │   │   │   │   │   └── sections
    │   │   │   │   │   │   ├── OrdersFilters.tsx
    │   │   │   │   │   │   ├── OrdersStats.tsx
    │   │   │   │   │   │   ├── OrdersTable.tsx
    │   │   │   │   │   │   └── OrdersToolbar.tsx
    │   │   │   │   └── page.tsx
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
    │   ├── home
    │   │   ├── UserProfile
    │   │   │   ├── addresses
    │   │   │   │   ├── Components
    │   │   │   │   │   ├── AddressForm.tsx
    │   │   │   │   │   ├── SaveAddress.tsx
    │   │   │   │   │   └── handleComponent.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── change-password
    │   │   │   │   └── page.tsx
    │   │   │   ├── layout.tsx
    │   │   │   ├── orders
    │   │   │   │   ├── [id]
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── profile
    │   │   │   │   └── page.tsx
    │   │   │   ├── returns
    │   │   │   │   ├── Components
    │   │   │   │   │   └── MyReturns.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── reviews
    │   │   │   │   ├── Components
    │   │   │   │       ├── History.tsx
    │   │   │   │       ├── Reviewed.tsx
    │   │   │   │       └── Tabs.tsx
    │   │   │   │   └── page.tsx
    │   │   ├── buyandsell
    │   │   │   ├── add-product-details
    │   │   │   │   └── page.tsx
    │   │   │   ├── components
    │   │   │   │   ├── BuyandSellAdds.tsx
    │   │   │   │   ├── BuyandSellBanner.tsx
    │   │   │   │   ├── BuyandSellHome.tsx
    │   │   │   │   ├── BuyandSellItems.tsx
    │   │   │   │   ├── LocationPage.tsx
    │   │   │   │   ├── ProductForm.tsx
    │   │   │   │   └── SelectItems.tsx
    │   │   │   ├── layout.tsx
    │   │   │   ├── location
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── product-form
    │   │   │   │   └── page.tsx
    │   │   │   └── select-category
    │   │   │   │   └── page.tsx
    │   │   ├── donation
    │   │   │   ├── components
    │   │   │   │   ├── DonationBanner.tsx
    │   │   │   │   ├── DonationClaimModal.tsx
    │   │   │   │   ├── DonationHome.tsx
    │   │   │   │   └── DonationModal.tsx
    │   │   │   └── page.tsx
    │   │   ├── product
    │   │   │   ├── filter
    │   │   │   │   ├── FilterContent.tsx
    │   │   │   │   ├── components
    │   │   │   │   │   ├── FilterSidebar.tsx
    │   │   │   │   │   └── ProductGrid.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── shopping-cart
    │   │   │   │   ├── ShoppingCartContent.tsx
    │   │   │   │   ├── components
    │   │   │   │   │   ├── OrderSummary.tsx
    │   │   │   │   │   ├── ShoppingCartSection.tsx
    │   │   │   │   │   └── YouMayLike.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── shoppinginfo
    │   │   │   │   ├── ShoppingInfoContent.tsx
    │   │   │   │   ├── components
    │   │   │   │       ├── AddressSelector.tsx
    │   │   │   │       ├── DeliveryOptions.tsx
    │   │   │   │       ├── InfoForm.tsx
    │   │   │   │       ├── ItemsList.tsx
    │   │   │   │       ├── OrderSuccessModal.tsx
    │   │   │   │       └── OrderSummary.tsx
    │   │   │   │   └── page.tsx
    │   │   └── view
    │   │   │   └── all
    │   │   │       └── products
    │   │   │           └── page.tsx
    │   ├── inbox
    │   │   ├── Components
    │   │   │   ├── ChatHeader.tsx
    │   │   │   ├── ChatInput.tsx
    │   │   │   ├── ChatListItem.tsx
    │   │   │   ├── ChatMessages.tsx
    │   │   │   └── ChatSidebar.tsx
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── products
    │   │   └── [id]
    │   │       └── page.tsx
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
    │   │   ├── PageHeader.tsx
    │   │   ├── ProductCarousel.tsx
    │   │   ├── RichTextEditor.tsx
    │   │   └── TabsLayout.tsx
    │   ├── RichTextEditor
    │   │   └── RichTextEditor.tsx
    │   ├── TableHelper
    │   │   ├── ConfigSetupClient.tsx
    │   │   ├── PaginationControls.tsx
    │   │   ├── SortHeader.tsx
    │   │   ├── TableListToolbar.tsx
    │   │   ├── allWithdrawal.tsx
    │   │   ├── all_page_columns.tsx
    │   │   ├── all_store_columns.tsx
    │   │   ├── approved_vendor_columns.tsx
    │   │   ├── banner_columns.tsx
    │   │   ├── blog_cagegory_columns.tsx
    │   │   ├── blog_comments_columns.tsx
    │   │   ├── blogs_columns.tsx
    │   │   ├── brand_columns.tsx
    │   │   ├── buySellListing_columns.tsx
    │   │   ├── cancelled_withdraw_columns.tsx
    │   │   ├── category_columns.tsx
    │   │   ├── childcategory_columns.tsx
    │   │   ├── color_columns.tsx
    │   │   ├── columns.tsx
    │   │   ├── complet_withdraw_columns.tsx
    │   │   ├── contact_requests_columns.tsx
    │   │   ├── customer_columns.tsx
    │   │   ├── customer_data_column.tsx
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
    │   │   ├── orders_columns.tsx
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
    │   │   ├── subscribed_users_columns.tsx
    │   │   ├── support_tickets_columns.tsx
    │   │   ├── system_users_columns.tsx
    │   │   ├── terms_columns.tsx
    │   │   ├── testimonial_columns.tsx
    │   │   ├── transations_columns.tsx
    │   │   ├── unit_columns.tsx
    │   │   ├── upazila_thana_columns.tsx
    │   │   ├── user_role_columns.tsx
    │   │   ├── vendor_req_columns.tsx
    │   │   ├── view_buy_sell_columns.tsx
    │   │   ├── view_donation_columns.tsx
    │   │   ├── warranty_columns.tsx
    │   │   ├── wishlist_columns.tsx
    │   │   └── withdraw_req_columns.tsx
    │   ├── UserProfile
    │   │   ├── Order
    │   │   │   ├── OrderFilters.tsx
    │   │   │   ├── OrderItemCard.tsx
    │   │   │   ├── OrderList.tsx
    │   │   │   ├── OrderStatusBadge.tsx
    │   │   │   └── types.ts
    │   │   ├── ProfileDashboard
    │   │   │   ├── OrderSummaryCards.tsx
    │   │   │   └── RecentOrdersList.tsx
    │   │   └── UserSidebar.tsx
    │   └── ui
    │   │   ├── SectionTitle.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── color-picker.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── dropzone.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── radio-group.tsx
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
    │   ├── buy_sell_data.ts
    │   ├── carousel_data.ts
    │   ├── categories_data.ts
    │   ├── data.ts
    │   ├── flash_sale_data.ts
    │   ├── hero_foot-data.ts
    │   ├── navigation_data.ts
    │   ├── products.ts
    │   └── sidebar.ts
    ├── hooks
    │   └── use-mobile.ts
    ├── lib
    │   ├── db.ts
    │   ├── email-templates
    │   │   └── otp.ejs
    │   ├── firebase.ts
    │   ├── firebaseAdmin.ts
    │   ├── middlewares
    │   │   ├── catchAsync.ts
    │   │   └── checkRole.ts
    │   ├── modules
    │   │   ├── about-content
    │   │   │   ├── content.controller.ts
    │   │   │   ├── content.interface.ts
    │   │   │   ├── content.model.ts
    │   │   │   ├── content.service.ts
    │   │   │   └── content.validation.ts
    │   │   ├── about-cta
    │   │   │   ├── cta.controller.ts
    │   │   │   ├── cta.interface.ts
    │   │   │   ├── cta.model.ts
    │   │   │   ├── cta.service.ts
    │   │   │   └── cta.validation.ts
    │   │   ├── about-fact
    │   │   │   ├── fact.controller.ts
    │   │   │   ├── fact.interface.ts
    │   │   │   ├── fact.model.ts
    │   │   │   ├── fact.service.ts
    │   │   │   └── fact.validation.ts
    │   │   ├── about-team
    │   │   │   ├── team.controller.ts
    │   │   │   ├── team.interface.ts
    │   │   │   ├── team.model.ts
    │   │   │   ├── team.service.ts
    │   │   │   └── team.validation.ts
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
    │   │   ├── conversation
    │   │   │   ├── conversation.controller.ts
    │   │   │   ├── conversation.interface.ts
    │   │   │   ├── conversation.model.ts
    │   │   │   └── conversation.service.ts
    │   │   ├── custom-code
    │   │   │   ├── customCode.controller.ts
    │   │   │   ├── customCode.interface.ts
    │   │   │   ├── customCode.model.ts
    │   │   │   ├── customCode.service.ts
    │   │   │   └── customCode.validation.ts
    │   │   ├── donation-campaign
    │   │   │   ├── donation-campaign.controller.ts
    │   │   │   ├── donation-campaign.interface.ts
    │   │   │   ├── donation-campaign.model.ts
    │   │   │   ├── donation-campaign.service.ts
    │   │   │   └── donation-campaign.validation.ts
    │   │   ├── donation-category
    │   │   │   ├── donation-category.controller.ts
    │   │   │   ├── donation-category.interface.ts
    │   │   │   ├── donation-category.model.ts
    │   │   │   ├── donation-category.service.ts
    │   │   │   └── donation-category.validation.ts
    │   │   ├── donation-config
    │   │   │   ├── donation-config.controller.ts
    │   │   │   ├── donation-config.interface.ts
    │   │   │   ├── donation-config.model.ts
    │   │   │   ├── donation-config.service.ts
    │   │   │   └── donation-config.validation.ts
    │   │   ├── edition
    │   │   │   ├── edition.controller.ts
    │   │   │   ├── edition.interface.ts
    │   │   │   ├── edition.model.ts
    │   │   │   ├── edition.service.ts
    │   │   │   └── edition.validation.ts
    │   │   ├── footer-widget
    │   │   │   ├── footerWidget.controller.ts
    │   │   │   ├── footerWidget.interface.ts
    │   │   │   ├── footerWidget.model.ts
    │   │   │   ├── footerWidget.service.ts
    │   │   │   └── footerWidget.validation.ts
    │   │   ├── integrations
    │   │   │   ├── integrations.controller.ts
    │   │   │   ├── integrations.interface.ts
    │   │   │   ├── integrations.model.ts
    │   │   │   ├── integrations.service.ts
    │   │   │   └── integrations.validation.ts
    │   │   ├── message
    │   │   │   ├── message.interface.ts
    │   │   │   └── message.model.ts
    │   │   ├── otp
    │   │   │   ├── otp.controller.ts
    │   │   │   ├── otp.service.ts
    │   │   │   └── otp.validation.ts
    │   │   ├── product-config
    │   │   │   ├── controllers
    │   │   │   │   ├── brandName.controller.ts
    │   │   │   │   ├── modelName.controller.ts
    │   │   │   │   ├── productColor.controller.ts
    │   │   │   │   ├── productFlag.controller.ts
    │   │   │   │   ├── productSize.controller.ts
    │   │   │   │   ├── productUnit.controller.ts
    │   │   │   │   └── storageType.controller.ts
    │   │   │   ├── interfaces
    │   │   │   │   ├── brandName.interface.ts
    │   │   │   │   ├── modelCreate.interface.ts
    │   │   │   │   ├── productColor.interface.ts
    │   │   │   │   ├── productFlag.interface.ts
    │   │   │   │   ├── productSize.interface.ts
    │   │   │   │   ├── productUnit.interface.ts
    │   │   │   │   └── storageType.interface.ts
    │   │   │   ├── models
    │   │   │   │   ├── brandName.model.ts
    │   │   │   │   ├── modelCreate.model.ts
    │   │   │   │   ├── productColor.model.ts
    │   │   │   │   ├── productFlag.model.ts
    │   │   │   │   ├── productSize.model.ts
    │   │   │   │   ├── productUnit.model.ts
    │   │   │   │   └── storageType.model.ts
    │   │   │   ├── services
    │   │   │   │   ├── brandName.service.ts
    │   │   │   │   ├── modelCreate.service.ts
    │   │   │   │   ├── productColor.service.ts
    │   │   │   │   ├── productFlag.service.ts
    │   │   │   │   ├── productSize.service.ts
    │   │   │   │   ├── productUnit.service.ts
    │   │   │   │   └── storageType.service.ts
    │   │   │   └── validations
    │   │   │   │   ├── brandName.validation.ts
    │   │   │   │   ├── modelCreate.validation.ts
    │   │   │   │   ├── productColor.validation.ts
    │   │   │   │   ├── productFlag.validation.ts
    │   │   │   │   ├── productSize.validation.ts
    │   │   │   │   ├── productUnit.validation.ts
    │   │   │   │   └── storageType.validation.ts
    │   │   ├── product-model
    │   │   │   ├── productModel.controller.ts
    │   │   │   ├── productModel.interface.ts
    │   │   │   ├── productModel.model.ts
    │   │   │   ├── productModel.service.ts
    │   │   │   └── productModel.validation.ts
    │   │   ├── product-review
    │   │   │   ├── productReview.controller.ts
    │   │   │   ├── productReview.interface.ts
    │   │   │   ├── productReview.model.ts
    │   │   │   ├── productReview.service.ts
    │   │   │   └── productReview.validation.ts
    │   │   ├── promo-code
    │   │   │   ├── promoCode.controller.ts
    │   │   │   ├── promoCode.interface.ts
    │   │   │   ├── promoCode.model.ts
    │   │   │   ├── promoCode.service.ts
    │   │   │   └── promoCode.validation.ts
    │   │   ├── reports
    │   │   │   ├── report.controller.ts
    │   │   │   ├── report.interface.ts
    │   │   │   ├── report.model.ts
    │   │   │   ├── report.service.ts
    │   │   │   └── report.validation.ts
    │   │   ├── seo-settings
    │   │   │   ├── seo.controller.ts
    │   │   │   ├── seo.interface.ts
    │   │   │   ├── seo.model.ts
    │   │   │   ├── seo.service.ts
    │   │   │   └── seo.validation.ts
    │   │   ├── service-category
    │   │   │   ├── serviceCategory.controller.ts
    │   │   │   ├── serviceCategory.interface.ts
    │   │   │   ├── serviceCategory.model.ts
    │   │   │   ├── serviceCategory.service.ts
    │   │   │   └── serviceCategory.validation.ts
    │   │   ├── service-provider
    │   │   │   ├── serviceProvider.controller.ts
    │   │   │   ├── serviceProvider.interface.ts
    │   │   │   ├── serviceProvider.model.ts
    │   │   │   ├── serviceProvider.service.ts
    │   │   │   └── serviceProvider.validation.ts
    │   │   ├── service-subcategory
    │   │   │   ├── serviceSubCategory.controller.ts
    │   │   │   ├── serviceSubCategory.interface.ts
    │   │   │   ├── serviceSubCategory.model.ts
    │   │   │   ├── serviceSubCategory.service.ts
    │   │   │   └── serviceSubCategory.validation.ts
    │   │   ├── service
    │   │   │   ├── service.controller.ts
    │   │   │   ├── service.interface.ts
    │   │   │   ├── service.model.ts
    │   │   │   ├── service.service.ts
    │   │   │   └── service.validation.ts
    │   │   ├── settings
    │   │   │   ├── settings.controller.ts
    │   │   │   ├── settings.interface.ts
    │   │   │   ├── settings.model.ts
    │   │   │   ├── settings.service.ts
    │   │   │   └── settings.validation.ts
    │   │   ├── social-link
    │   │   │   ├── socialLink.controller.ts
    │   │   │   ├── socialLink.interface.ts
    │   │   │   ├── socialLink.model.ts
    │   │   │   ├── socialLink.service.ts
    │   │   │   └── socialLink.validation.ts
    │   │   ├── testimonial
    │   │   │   ├── testimonial.controller.ts
    │   │   │   ├── testimonial.interface.ts
    │   │   │   ├── testimonial.model.ts
    │   │   │   ├── testimonial.service.ts
    │   │   │   └── testimonial.validation.ts
    │   │   ├── theme-settings
    │   │   │   ├── theme.controller.ts
    │   │   │   ├── theme.interface.ts
    │   │   │   ├── theme.model.ts
    │   │   │   ├── theme.service.ts
    │   │   │   └── theme.validation.ts
    │   │   ├── user
    │   │   │   ├── user.controller.ts
    │   │   │   ├── user.interface.ts
    │   │   │   ├── user.model.ts
    │   │   │   ├── user.service.ts
    │   │   │   └── user.validation.ts
    │   │   ├── vendor-category
    │   │   │   ├── controllers
    │   │   │   │   ├── vendorCategory.controller.ts
    │   │   │   │   ├── vendorChildCategory.controller.ts
    │   │   │   │   └── vendorSubCategory.controller.ts
    │   │   │   ├── interfaces
    │   │   │   │   ├── vendorCategory.interface.ts
    │   │   │   │   ├── vendorChildCategory.interface.ts
    │   │   │   │   └── vendorSubCategory.interface.ts
    │   │   │   ├── models
    │   │   │   │   ├── vendorCategory.model.ts
    │   │   │   │   ├── vendorChildCategory.model.ts
    │   │   │   │   └── vendorSubCategory.model.ts
    │   │   │   ├── services
    │   │   │   │   ├── vendorCategory.service.ts
    │   │   │   │   ├── vendorChildCategory.service.ts
    │   │   │   │   └── vendorSubCategory.service.ts
    │   │   │   └── validations
    │   │   │   │   ├── vendorCategory.validation.ts
    │   │   │   │   ├── vendorChildCategory.validation.ts
    │   │   │   │   └── vendorSubCategory.validation.ts
    │   │   ├── vendor-product
    │   │   │   ├── vendorProduct.controller.ts
    │   │   │   ├── vendorProduct.interface.ts
    │   │   │   ├── vendorProduct.model.ts
    │   │   │   ├── vendorProduct.service.ts
    │   │   │   └── vendorProduct.validation.ts
    │   │   ├── vendor-store
    │   │   │   ├── vendorStore.controller.ts
    │   │   │   ├── vendorStore.interface.ts
    │   │   │   ├── vendorStore.model.ts
    │   │   │   ├── vendorStore.service.ts
    │   │   │   └── vendorStore.validation.ts
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
    ├── middleware.ts
    ├── pages
    │   └── api
    │   │   └── socket.ts
    └── types
    │   └── socket.ts
└── tsconfig.json
 ```