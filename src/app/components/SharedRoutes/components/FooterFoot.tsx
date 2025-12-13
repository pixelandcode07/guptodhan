import React from 'react'

export default function FooterFoot() {
  return (
    <footer className="bg-[#00005E] px-28 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-white text-base">
          Copyright © 2024 GuptoDhan. All Rights Reserved.
        </h1>

        <div className="text-sm text-white/90 flex flex-col md:flex-row items-center gap-2">
          <span>Developed by</span>
          <a
            href="https://pixelandcodeweb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Pixel &amp; Code
          </a>
        </div>
      </div>
    </footer>
  )
}
