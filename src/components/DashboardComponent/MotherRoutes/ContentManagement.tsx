import {
  Image,
  MessageSquare,
  FileText,
  File,
  FilePlus,
  Info,
  HelpCircle,
} from 'lucide-react';
import { CollapsibleMenuGroup } from '@/components/ReusableComponents/CollapsibleMenuGroup';

// Sub-items
const sliders = [
  { title: 'View All Sliders', url: '/general/view/all/sliders' },
  { title: 'View All Banners', url: '/general/view/all/banners' },
  { title: 'Promotional Banners', url: '/general/view/promotional/banner' },
];

const testimonials = [
  { title: 'Add New Testimonial', url: '/general/add/testimonial' },
  { title: 'View All Testimonials', url: '/general/view/testimonials' },
];

const blog = [
  { title: 'Blog Categories', url: '/general/view/all/category' },
  { title: 'Write a Blog', url: '/general/add/new/blog' },
  { title: 'View All Blogs', url: '/general/view/all/blogs' },
];

const condition = [
  { title: 'Terms & Condition', url: '/general/terms/and/condition' },
  { title: 'Privacy Policy', url: '/general/view/privacy/policy' },
  { title: 'Shipping Policy', url: '/general/view/shipping/policy' },
  { title: 'Return Policy', url: '/general/view/return/policy' },
];

const customPage = [
  { title: 'Create New Page', url: '/general/create/new/page' },
  { title: 'View All Pages', url: '/general/view/all/pages' },
];

const aboutUs = [
  { title: 'About Content', url: '/general/about/us/page' },
  { title: 'View Facts', url: '/general/view/facts' },
  { title: 'CTA', url: '/general/create/cta' },
  { title: 'Team Config', url: '/general/team/config' },
  { title: 'View Teams', url: '/general/view/terms' },
];

const faq = [
  { title: 'FAQ Categories', url: '/general/faq/categories' },
  { title: "FAQ's", url: '/general/view/all/faqs' },
];

export function ContentManagement() {

  return (
    <CollapsibleMenuGroup
      label='Content Management'
      sections={[
        {
          title: 'Slider & Banners',
          icon: Image,
          items: sliders,
        },
        {
          title: 'Testimonials',
          icon: MessageSquare,
          items: testimonials,
        },
        {
          title: 'Manage Blogs',
          icon: FileText,
          items: blog,
        },
        {
          title: 'Terms & Policies',
          icon: File,
          items: condition,
        },
        {
          title: 'Custom Pages',
          icon: FilePlus,
          items: customPage,
        },
        {
          title: 'About Us',
          icon: Info,
          items: aboutUs,
        },
        {
          title: "FAQ's",
          icon: HelpCircle,
          items: faq,
        },
      ]}
    />
  );
}
