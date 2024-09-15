"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const Navbar = () => {
  const pathname = usePathname()
  return (
    <div>
        <div className="flex h-16 gap-4 items-center px-8">
            
                <Link className={` ${pathname === '/' ? 'bg-gray-700 text-white px-4 py-2 rounded-md' : ''}`} href="/">
                    Rental Property Calculator
                </Link>
                <Link className={` ${pathname === '/longterm' ? 'bg-gray-700 text-white px-4 py-2 rounded-md' : ''}`} href="/longterm">Long Term Investment Plan</Link>
        </div>
    </div>
  )
}

export default Navbar