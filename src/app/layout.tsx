<<<<<<< HEAD
import type { Metadata } from "next";
import "./globals.css";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import Navabar from "@/components/DashboardNav/Navabar";
=======
import "./globals.css"
import type { Metadata } from "next"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
>>>>>>> 815f204682d7667da8f3f623dfb0cd30670a4552

export const metadata: Metadata = {
  title: "Guptodhan Dashboard",
  description: "Dashboard for Guptodhan project",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}