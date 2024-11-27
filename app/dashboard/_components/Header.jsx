"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const Header = () => {

    const path = usePathname();
    useEffect(()=>{
        // console.log(path);
        
    })
  return (
    <>
    <div className='flex pl-8 pr-8 items-center justify-between bg-secondary shadow-sm '>

    <Link className="hidden md:block"  href="/dashboard">
          <Image src={'/logo.svg'}  width={80} height={80} alt="logo" />
        </Link>
        <ul className='flex gap-6  '>
        <Link href="/dashboard">
            <li
              className={`hover:text-blue-900 hover:font-bold transition-all cursor-pointer ${
                path == "/dashboard" && "text-blue-900-bold"
              }`}
            >
              Dashboard
            </li>
          </Link>

          <Link href="/dashboard/how">
            <li
              className={`hover:text-blue-900 hover:font-bold transition-all cursor-pointer ${
                path == "/dashboard/how" && "text-blue-900 font-bold"
              }`}
            >
              How it works?
            </li>
          </Link>
        </ul>
        <UserButton/>
    </div>
    </>
  )
}

export default Header