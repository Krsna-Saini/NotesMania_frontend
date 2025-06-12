'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Logo from '@/components/Icons/logo/Index'
import { useRouter } from 'next/navigation'
import { Lock, Menu, Moon, Sun, User } from 'lucide-react'
import Button from '@/components/Multipurpose/Button/Index'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useDispatch, useSelector } from 'react-redux'
import { toggleDarkMode } from '@/state/Global'
import { themeStatetype } from '@/state/Global'
const Navbar = () => {
    const isDarkMode=useSelector((state:{global:themeStatetype}) => state.global.darkMode)
    const isAuthenticated = useSelector((state: { global: themeStatetype }) => state.global.isAuthenticated)
    const userData= useSelector((state: { global: themeStatetype }) => state.global.user)
    const dispatch=useDispatch()
    const [open, setOpen] = useState(false) // Drawer
    const router = useRouter()
    return (
        <div className='flex h-20  sticky top-0 backdrop-blur-sm items-center z-40 w-[100%] overflow-x-hidden py-2 px-2 justify-between '>
            {/* logo */}
            <div className=' flex items-center saturate-150'>
                <Link href={'/'}>
                    <Logo />
                </Link>
            </div>
            <div className='flex items-center'>
                {/* Links */}
                <div className='hidden md:flex items-center space-x-2'>
                    {/* Docs */}
                    <Link href='/docs' className='dark:text-white  hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md'>
                        Docs
                    </Link>
                    {/* Groups */}
                    <Link href='/groups/_auto' className='dark:text-white  hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md'>
                        Groups
                    </Link>
                    {/* AI-Assistance */}
                    <Link href='/ai-assistance' className='dark:text-white  hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md'>
                        AI Assistance
                    </Link>
                    {/* About */}
                    <Link href='/about' className='dark:text-white  hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md'>
                        About
                    </Link>
                </div>
                <button onClick={() => {
                    setOpen(!open)
                }} className="md:hidden dark:text-white h-full flex items-center">
                    <Menu className="m-2" />
                </button>
                <div className='flex items-center justify-center'>
                    {/* Dark Mode */}
                    <div
                        onClick={() => {
                            dispatch(toggleDarkMode())
                        }}
                        className='dark:text-white flex justify-center items-center cursor-pointer hover:text-gray-900 px-1 mr-1 rounded-md'>
                        {isDarkMode ? <Sun /> : <Moon />}
                    </div>
                    {/* Drawer */}
                    <Drawer open={open} onOpenChange={setOpen}>
                        {/* Drawer Title */}
                        <DrawerTitle>
                        </DrawerTitle>
                        {/* Open Drawer Button */}
                        <DrawerContent>
                            <DrawerHeader>
                                {/* Navigation Links */}
                                <div className="flex items-center justify-center flex-col space-y-2">
                                    <Link href="/docs" className="dark:text-white hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md">
                                        Docs
                                    </Link>
                                    <Link href="/groups/_auto" className="dark:text-white hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md">
                                        Groups
                                    </Link>
                                    <Link href="/ai-assistance" className="dark:text-white hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md">
                                        AI Assistance
                                    </Link>
                                    <Link href="/about" className="dark:text-white hover:text-gray-900 md:text-[1rem] md:px-2 py-1 rounded-md">
                                        About
                                    </Link>
                                </div>
                            </DrawerHeader>
                        </DrawerContent>
                    </Drawer>

                    {/* seperator */}
                    <div className='w-[2px] h-8 bg-gray-700 mr-2'></div>
                    {/* login Info */}
                    
                            <Button icon={isAuthenticated?User:Lock} text={`${isAuthenticated ?"User": "login"}`} role={`${isAuthenticated?`${userData?.username || "User"}`:"Login to explore"}`} onClick={()=>{
                                router.push('/auth/login')
                            }} align='left'></Button>
                       
                </div>
            </div>
        </div>
    )
}

export default Navbar