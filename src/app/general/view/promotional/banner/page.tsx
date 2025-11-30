import { Suspense } from 'react'
import BannerStructure from './components/BannerStructure'

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading Banner Structure...</div>}>
        <BannerStructure />
      </Suspense>
    </div>
  )
}
