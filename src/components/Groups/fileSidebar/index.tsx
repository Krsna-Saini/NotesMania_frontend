import React from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight,  Copy, File,  ImageIcon, LinkIcon, MonitorPlay } from 'lucide-react';
import { useSelector } from 'react-redux';
import { themeStatetype } from '@/state/Global';
const FileSidebar = ({ isOpen, setIsOpen }: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const userData = useSelector((state: { global: themeStatetype }) => state.global.user)
    return (
        <div className='relative z-[100] flex'>
            {/* Group FileSidebar */}
            <div className={`${isOpen ? "w-[300px]" : "px-0 w-0 lg:w-[65px]"} absolute lg:relative transition-all flex flex-col overflow-hidden right-0 duration-500 h-[100vh] max-h-[100vh] pb-3 bg-white dark:bg-neutral-900 z-40 `}>
                <div className='h-full overflow-hidden flex flex-col justify-between'>
                    <div className='flex flex-col justify-between'>
                        {/* header */}
                        <div className={` flex bg-white dark:bg-neutral-900 z-50 mx-3 border-b-2 border-gray-300 py-3 gap-4 items-center `}>
                            <button className='p-2 bg-gray-300 rounded-lg cursor-pointer ' onClick={() => setIsOpen(!isOpen)}>
                                {
                                    isOpen ? <ChevronRight /> : <ChevronLeft />
                                }

                            </button>
                            <strong className='text-2xl font-semibold'>Files</strong>
                        </div>

                        {/* User Profile */}
                        <div className='relative w-full'>
                            <div className=' w-full flex flex-col items-center gap-3 p-2 '>
                                <Image width={500} height={500} src={'/meeting4.jpg'} className={`${isOpen ? "w-[150px] h-[150px]" : "w-[60px] h-[60px]"} transition-all object-cover duration-500 rounded-full  relative`} alt="Profile Image" />
                            </div>
                            <div className={` ${isOpen ? "scale-100" : "scale-0 h-0 w-0"} transition-all overflow-hidden duration-500 flex flex-col items-center mb-5`}>
                                <h2 className='text-xl font-semibold'>{userData.username}</h2>
                                <p className='text-gray-500 bg-[#fee4ff] rounded px-1 text-sm'>{userData.email}</p>
                            </div>
                        </div>


                        {/* Files List */}
                        <div className='flex flex-col gap-1 m-1.5'>
                            <span className='whitespace-nowrap p-2.5 text-xl'>Files and Links</span>
                            {/* documents */}
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer'>
                                    <div className='p-2 rounded-lg bg-gray-200'>
                                        <File className='text-gray-700 rounded-full' />
                                    </div>
                                    <span className='text-sm'>Document</span>
                                </div>
                                {/* render documents */}
                            </div>
                            {/* Photos */}
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer'>
                                    <div className='p-2 rounded-lg bg-yellow-200'>
                                        <ImageIcon className='text-yellow-700 rounded-full' />
                                    </div>
                                    <span className='text-sm'>Photos</span>
                                </div>
                                {/* render photos */}
                            </div>
                            {/* Videos */}
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer'>
                                    <div className='p-2 rounded-lg bg-teal-200'>
                                        <MonitorPlay className='text-teal-700 rounded-full' />
                                    </div>
                                    <span className='text-sm'>Videos</span>
                                </div>
                                {/* render videos */}
                            </div>
                            {/* Links */}
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer'>
                                    <div className='p-2 rounded-lg bg-blue-200'>
                                        <LinkIcon className='text-blue-700 rounded-full' />
                                    </div>
                                    <span className='text-sm'>Links</span>
                                </div>
                                {/* render links */}
                            </div>
                            {/* Other */}
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer'>
                                    <div className='p-2 rounded-lg bg-rose-200'>
                                        <Copy className='text-rose-700 rounded-full' />
                                    </div>
                                    <span className='text-sm'>Other</span>
                                </div>
                                {/* render other files */}
                            </div>
                        </div>
                    </div>
                    {/* UPGRADE */}
                    <div>
                        <div className={` ${isOpen ? "scale-100" : "scale-0 h-0 w-0"} transition-all overflow-hidden duration-500 flex flex-col items-center mb-5`}>
                            <h2 className='text-xl font-semibold'>Upgrade to Pro</h2>
                            <p className='text-gray-500 bg-[#fee4ff] rounded px-1 text-sm'>Get more storage and features</p>
                            <button className='mt-3 px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-700 transition-all duration-300'>Upgrade Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FileSidebar