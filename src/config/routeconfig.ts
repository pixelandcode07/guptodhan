export const routeConfig: Record<
  string,
  { breadcrumb: string; title: string }
> = {
  // navMain
  '/general/info': {
    breadcrumb: 'Website Config',
    title: 'Entry General Information',
  },
  '/general/view/footer/widget': {
    breadcrumb: ' Footer Settings',
    title: 'Footer Settings',
  },
  '/general/website/theme/page': {
    breadcrumb: 'Website Config',
    title: 'Website Theme Color',
  },
  '/general/social/media/page': {
    breadcrumb: 'Website Config',
    title: 'Social Media Links',
  },
  '/general/seo/homepage': {
    breadcrumb: 'Website Config',
    title: 'SEO for HomePage',
  },
  '/general/custom/css/js': {
    breadcrumb: ' Content Module',
    title: 'Custom CSS & JS',
  },
  '/general/social/chat/script/page': {
    breadcrumb: 'Website Config',
    title: 'Social Login & Chat Scripts',
  },

  // buysell
  '/general/buy/sell/config': {
    breadcrumb: 'Buy Sell Config',
    title: 'Buy Sell Config',
  },
  // '*': { breadcrumb: 'Buy Sell Categories', title: 'Buy Sell Categories' },
  '/general/buy/sell/listing': {
    breadcrumb: '  BuySell Listing',
    title: 'View All Listing',
  },

  // donations
  '/general/donation/config': {
    breadcrumb: 'Donation Config',
    title: 'Donation Config',
  },
  // '*': { breadcrumb: 'Donation Categories', title: 'Donation Categories' },
  '/general/donation/listing': {
    breadcrumb: ' Donation Categories',
    title: 'View All Categories',
  },
  '/general/donation/requests': {
    breadcrumb: 'Donation Listing',
    title: 'View All Listing',
  },

  // documents
  '/general/view/vendors': { breadcrumb: 'Vendors', title: 'Vendors' },
  '/general/view/stores': { breadcrumb: 'Stores', title: 'Stores' },
  '/general/view/withdrawal': { breadcrumb: 'Withdrawal', title: 'Withdrawal' },

  // demoProducts
  '/general/view/demo/products': {
    breadcrumb: 'Demo Products',
    title: 'Demo Products',
  },

  // userRole
  '/general/view/system/users': {
    breadcrumb: 'System Users',
    title: 'System Users',
  },
  '/general/view/permission/routes': {
    breadcrumb: 'Permission Routes',
    title: 'Permission Routes',
  },
  '/general/view/user/roles': { breadcrumb: 'User Roles', title: 'User Roles' },
  '/general/view/user/role/permission': {
    breadcrumb: 'Addign Role Permission',
    title: 'Addign Role Permission',
  },

  // logout
  '/general/logout': { breadcrumb: 'Logout', title: 'Logout' },

  // vendor
  '/general/create/vendor/category': {
    breadcrumb: 'Vendor Category',
    title: 'Add New Category',
  },
  '/general/view/vendor/categories': {
    breadcrumb: ' Vendor Categories',
    title: 'View All Categories',
  },
  '/general/create/new/vendor': {
    breadcrumb: ' Vendor',
    title: 'Create New Vendor',
  },
  '/general/view/vendor/requests': {
    breadcrumb: ' Vendors',
    title: 'View All Vendor Requests',
  },
  '/general/view/all/vendors': {
    breadcrumb: ' Vendors',
    title: 'View All Vendors',
  },
  '/general/view/inactive/vendors': {
    breadcrumb: ' Vendors',
    title: 'View All Inactive Vendors',
  },

  // stores
  '/general/create/new/store': {
    breadcrumb: 'Store',
    title: 'Create New Store',
  },
  '/general/view/all/stores': {
    breadcrumb: 'Store',
    title: 'View All Stores',
  },

  // withdrawal
  '/general/view/all/withdraws': {
    breadcrumb: ' Withdraw',
    title: 'View All Withdraws',
  },
  '/general/create/new/withdraw': {
    breadcrumb: ' Withdraw',
    title: 'Create New Vendor',
  },
  '/general/view/withdraw/requests': {
    breadcrumb: '  Withdraw Requests',
    title: 'View All Withdraw Requests',
  },
  '/general/view/completed/withdraws': {
    breadcrumb: ' Completed Withdraws',
    title: 'View All Completed Withdraws',
  },
  '/general/view/cancelled/withdraws': {
    breadcrumb: ' Cancelled Withdraws',
    title: 'View All Cancelled Withdraws',
  },
  '/general/view/payment/history': {
    breadcrumb: 'Payment History',
    title: 'Payment History',
  },

  // category (donation & buy/sell)
  '/general/create/donation/category': {
    breadcrumb: ' Donation Category',
    title: 'Add New Category',
  },
  '/general/view/donation/categories': {
    breadcrumb: 'Donation Categories',
    title: 'View All Categories',
  },
  '/general/create/buy/sell/category': {
    breadcrumb: ' BuySell Category',
    title: 'Add New Category',
  },
  '/general/view/buy/sell/categories': {
    breadcrumb: 'BuySell Categories',
    title: 'View All Categories',
  },

  // demoHelper
  '/general/generate/demo/products': {
    breadcrumb: 'Generate Products',
    title: 'Generate Products',
  },
  '/general/remove/demo/products/page': {
    breadcrumb: 'Remove Products',
    title: 'Remove Products',
  },

  // sliders
  '/general/view/all/sliders': {
    breadcrumb: 'View All Sliders',
    title: 'View All Sliders',
  },
  '/general/view/all/banners': {
    breadcrumb: 'View All Banners',
    title: 'View All Banners',
  },
  '/general/view/promotional/banner': {
    breadcrumb: 'Promotional Banners',
    title: 'Promotional Banners',
  },

  // testimonials
  '/general/add/testimonial': {
    breadcrumb: 'Add New Testimonial',
    title: 'Add New Testimonial',
  },
  '/general/view/testimonials': {
    breadcrumb: 'View All Testimonials',
    title: 'View All Testimonials',
  },

  // blog
  '/general/add/new/category': {
    breadcrumb: 'Blog Categories',
    title: 'Blog Categories',
  },
  '/general/add/new/blog': {
    breadcrumb: 'Write a Blog',
    title: 'Write a Blog',
  },
  '/general/view/all/blogs': {
    breadcrumb: 'View All Blogs',
    title: 'View All Blogs',
  },

  // condition
  '/general/terms/and/condition': {
    breadcrumb: 'Terms & Condition',
    title: 'Terms & Condition',
  },
  '/general/view/privacy/policy': {
    breadcrumb: 'Privacy Policy',
    title: 'Privacy Policy',
  },
  '/general/view/shipping/policy': {
    breadcrumb: 'Shipping Policy',
    title: 'Shipping Policy',
  },
  '/general/view/return/policy': {
    breadcrumb: 'Return Policy',
    title: 'Return Policy',
  },

  // customPage
  '/general/create/new/page': {
    breadcrumb: 'Create New Page',
    title: 'Create New Page',
  },
  '/general/view/all/pages': {
    breadcrumb: 'View All Pages',
    title: 'View All Pages',
  },

  // aboutUs
  '/general/about/us/page': {
    breadcrumb: 'About Content',
    title: 'About Content',
  },
  '/general/view/facts': { breadcrumb: 'View Facts', title: 'View Facts' },
  '/general/create/cta': { breadcrumb: 'CTA', title: 'CTA' },
  '/general/team/config': { breadcrumb: 'Team Config', title: 'Team Config' },
  '/general/view/terms': { breadcrumb: 'View Teams', title: 'View Teams' },

  // faq
  '/general/faq/categories': {
    breadcrumb: 'FAQ Categories',
    title: 'FAQ Categories',
  },
  '/general/view/all/faqs': { breadcrumb: "FAQ's", title: "FAQ's" },
};
