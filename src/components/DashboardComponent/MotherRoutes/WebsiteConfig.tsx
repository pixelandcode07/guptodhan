import { SidebarGroupMenu } from "@/components/ReusableComponents/SidebarGroupMenu"
import { Code, LayoutDashboard, MessageCircle, Palette, Search, Settings, Share2 } from "lucide-react"
const webConfig = [
  {
    title: 'General Info',
    url: '/general/info',
    icon: LayoutDashboard,
  },
  // {
  //   title: 'Footer Settings',
  //   url: '/general/view/footer/widget/1',
  //   icon: Settings,
  // },
  {
    title: 'Website Theme Color',
    url: '/general/website/theme/page',
    icon: Palette,
  },
  {
    title: 'Social Media Links',
    url: '/general/social/media/page',
    icon: Share2,
  },
  {
    title: 'Home Page SEO',
    url: '/general/seo/homepage',
    icon: Search,
  },
  // {
  //   title: 'Custom CSS & JS',
  //   url: ' /general/custom/css/js',
  //   icon: Code,
  // },
  {
    title: 'Social & Chat Scripts',
    url: '/general/social/chat/script/page',
    icon: MessageCircle,
  },
]

export default function WebsiteConfig() {
  return (
    <SidebarGroupMenu
      label="Website Config"
      items={webConfig}
    />
  )
}

