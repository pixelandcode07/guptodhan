<<<<<<< HEAD
import React from 'react'

export default function Dashboard() {
  return (
    <div>
      This is Dashboard page
    </div>
  )
=======
// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePageRedirect() {
  redirect("/general/");
>>>>>>> e3b186b3c24301ce4278161fa5144e28060b6126
}
