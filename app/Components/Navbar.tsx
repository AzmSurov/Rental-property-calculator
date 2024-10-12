"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const Navbar = () => {
  const pathname = usePathname()
  return (
    <div>
        <div className="flex h-16 gap-4 items-center px-8 border-b border-gray-700">
            
                <Link className={` ${pathname === '/' ? 'bg-zinc-800 text-white px-4 py-2 rounded-md' : ''}`} href="/">
                    Rental Property Calculator
                </Link>
                <Link className={` ${pathname === '/longterm' ? 'bg-zinc-800 text-white px-4 py-2 rounded-md' : ''}`} href="/longterm">Long Term Investment Plan</Link>
                <Link className={` ${pathname === '/whatif' ? 'bg-zinc-800 text-white px-4 py-2 rounded-md' : ''}`} href="/whatif">What If Scenarios</Link>
                <Link className={` ${pathname === '/equityloan' ? 'bg-zinc-800 text-white px-4 py-2 rounded-md' : ''}`} href="/equityloan">Equity Loan</Link>
        </div>
    </div>
  )
}

export default Navbar