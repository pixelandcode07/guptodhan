import React from 'react'
import HeroNav from './HeroNav'
import HeroImage from './HeroImage'
import HeroFooter from './HeroFooter'

export default function Hero() {
    return (
        <div>
            <nav className='hidden lg:block'>
                <HeroNav />
            </nav>
            <main>
                <HeroImage />
            </main>
            <footer>
                <HeroFooter />
            </footer>
        </div>
    )
}
