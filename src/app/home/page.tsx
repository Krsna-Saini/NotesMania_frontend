'use client'
import Button from '@/components/Multipurpose/Button/Index'
import HomeCard from '@/components/Home/HomeCard/Index'
import Bulb from '@/components/Icons/Bulb/Index'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, PartyPopper } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { homeCardData } from '@/lib/utils'
import { useRouter } from 'next/navigation'
const ws_url = process.env.NEXT_PUBLIC_WS_URL
const Home = () => {
    const router = useRouter()
    useEffect(() => {
        console.log(ws_url)
        const ws = new WebSocket(`${ws_url}`);
        ws.onopen = () => console.log("✅ WebSocket Connected");
        ws.onerror = (err) => console.error("❌ WebSocket Error", err);
    }, []);
    return (
        <div>
            {/* welcome Component */}
            <div className='flex relative w-full overflow-hidden'>
                <div className='mb-30'>
                    {/* INTRO */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='md:ml-14 ml-3 mt-24 xl:mt-34 md:w-[80%] w-[100%]'
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className='font-sm text-[#ea45bb] xl:text-xl w-fit px-2 py-1 dark:bg-transparent bg-[#fedff5] flex items-center text-pretty '
                        >
                            <PartyPopper className='mr-2 size-3' />
                            <span>Our Application is now Powered by AI</span>
                            <ArrowRight className='size-4' />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className='mt-8 xl:mt-12 '
                        >
                            <strong className='font-semibold xl:text-5xl md:text-4xl text-xl xl:leading-16 leading-8  md:leading-12 '>
                                <div className='pr-3'> Share, Learn, Collaborate, Succeed – Your Ultimate Hub for</div>
                                <span className='text-[#9237e1] dark:bg-transparent w-fit  px-2 py-0.5 bg-[#e2c2ff]'> Academic Collaboration</span>
                            </strong>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className='mt-4 xl:mt-8'
                        >
                            <strong className='font-semibold text-xl xl:text-2xl'>
                                We help students share notes, academic details, assignments, and AI-powered insights—all in one organized platform
                            </strong>
                            <Brain className='size-6 text-[#ea45bb] inline-flex items-center ' />
                        </motion.div>
                    </motion.div>
                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='flex mt-8 xl:mt-24 md:ml-14 ml-3 gap-3'>
                        <Button text='Get Started' />
                        <Button text='Learn More' />
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='md:flex hidden w-[20%] items-center justify-center mt-24'>
                    <Bulb />
                </motion.div>
            </div>
            {/* AI Card */}
            <div className='w-full p-2 dark:bg-neutral-900 shadow-md shadow-[#dd2bab] rounded-lg'>
                <div className='flex flex-col-reverse md:flex-row items-center justify-between '>
                    <div className='mx-4 text-center md:text-start'>
                        <strong className='font-semibold text-4xl dark:text-white'>AI Powered </strong>
                        <strong className='font-semibold text-4xl text-[#ea45bb]'>Insights </strong>
                        <strong className='font-semibold text-4xl dark:text-white'>for Students</strong>
                        <div className='mt-4'>
                            <strong className='font-semibold text-xl dark:text-white'>We provide AI-powered insights to help students learn and succeed</strong>
                        </div>
                    </div>
                    <Image src={'/AIimage.jpg'} width={1000} height={1350} className='rounded-lg w-[500px] h-[330px] object-cover' alt="cardImage" />
                </div>
            </div>
            {/* Study Card */}
            <div className='w-full p-2 dark:bg-neutral-900 mt-3 shadow-md shadow-[#dd2bab] rounded-lg'>
                <div className='flex flex-col-reverse md:flex-row-reverse items-center justify-between '>
                    <div className='mx-4 text-center md:text-start'>
                        <strong className='font-semibold text-4xl dark:text-white'>Study </strong>
                        <strong className='font-semibold text-4xl text-[#ea45bb]'>Materials </strong>
                        <strong className='font-semibold text-4xl dark:text-white'>for Students</strong>
                        <div className='mt-4'>
                            <strong className='font-semibold text-xl dark:text-white'>We provide study materials to help students learn and succeed</strong>
                        </div>
                    </div>
                    <Image src={'/latopstudding.jpg'} width={1420} height={1250} className='md:w-[500px] h-[330px] rounded-lg object-cover' alt="cardImage" />
                </div>
            </div>
            {/* Notes Card */}
            <div className='w-full p-2 mt-3 dark:bg-neutral-900 shadow-md shadow-[#dd2bab] rounded-lg'>
                <div className='flex flex-col-reverse md:flex-row items-center justify-between '>
                    <div className='mx-4 md:mt-0 mt-4 text-center md:text-start'>
                        <strong className='font-semibold text-4xl dark:text-white'>Notes </strong>
                        <strong className='font-semibold text-4xl text-[#ea45bb]'>Sharing </strong>
                        <strong className='font-semibold text-4xl dark:text-white'>for Students</strong>
                        <div className='mt-4'>
                            <strong className='font-semibold text-xl dark:text-white'>We provide a platform for students to share notes and succeed</strong>
                        </div>
                    </div>
                    <Image src={'/books.jpg'} width={1000} height={1350} className='rounded-lg w-[500px] h-[330px] object-cover' alt="cardImage" />
                </div>
            </div>
            {/* heading */}
            <div className='w-full mt-60 flex flex-col'>
                <strong className=' text-[#9237e1] text-center'>The benefits of studying online in one of our study groups</strong>
                <strong className='font-bold text-3xl md:text-5xl  text-[#ea45bb] text-center'>“Just” a study room? Think again!</strong>
            </div>
            <div className='grid grid-cols-1 space-y-2 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:p-26 mt-8'>
                {
                    homeCardData.map((data, index) => {
                        return < HomeCard key={index} image={data.image} title={data.title} description={data.description} />
                    })
                }
            </div>
            {/* Get Started */}
            <div className='flex md:flex-row flex-col items-center justify-around mt-50 mx-4 mb-32'>
                <div className='flex flex-col items-center justify-center '>
                    <strong className='font-semibold text-4xl text-[#ea45bb] dark:text-white'>Get Started</strong>
                    <strong className='font-semibold text-4xl dark:text-white'>with us today</strong>
                    <div className='mt-4 max-w-[350px] text-center'>
                        <strong className='font-semibold text-sm  dark:text-white'>
                            Join our platform and start collaborating with students all over the world
                            and gain access to a wealth of resources, study materials, and AI-powered tools designed to enhance your academic journey. Collaborate with peers, share insights, and achieve your goals like never before.
                        </strong>
                    </div>
                    <div className='flex mt-8 gap-4'>
                        <button onClick={() => {
                            router.push("/auth/signup")
                        }} className=' bg-orange-600 cursor-pointer p-2 rounded-2xl'> Create your Own Account</button>
                    </div>
                </div>
                <div className='hidden md:flex'>
                    <video src="/studingVideo.mp4" width={550} height={600} preload='true' disablePictureInPicture loop autoPlay muted className=''></video>
                </div>
            </div>
        </div>
    )
}

export default Home