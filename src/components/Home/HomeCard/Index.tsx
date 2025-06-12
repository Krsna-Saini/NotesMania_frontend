
import Image from 'next/image'
import React from 'react'
type homeCardProps={
    image:string,
    title:string,
    description:string
}
const HomeCard = ({image,title,description}:homeCardProps) => {
  return (
    <div className='flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover:shadow-[#dd2bab] rounded-lg'>
       <Image src={`/${image?image:'meeting1'}.jpg`} width={1000} height={1000} className='rounded-full w-[220px] h-[220px] object-cover'  alt="meeting"/>
       <strong className='font-semibold text-2xl w-3/4 text-center text-[#f37cd1] mt-2'>
       {title?title:'The "good" kind of peer pressure'}
       </strong>
       <p className='font-semibold mt-6 w-3/4 text-center dark:text-white '>
       {description
       ?description
       :`You know how your parents always say peer pressure is bad? Well… when it comes to studying, they’re wrong.
       Studying with peers helps you get better grades - and that’s scientifically proven.`}
       </p>
</div>
  )
}

export default HomeCard