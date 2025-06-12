import React, { useRef, useEffect, useState} from 'react';
import { messageType } from '@/lib/utils'
import Image from 'next/image'
import { DownloadCloudIcon, File, User } from 'lucide-react'
import Time from '../../Multipurpose/formattedTime/Index'
import SolidTriangle from '@/components/Icons/solidtriangle';
import FilterLinks from '../FilterLinks';
import { motion } from 'framer-motion';
import { handleDownload } from '@/lib/utils';

const MessageComp = ({ message, userMessage, message_location }: { message: messageType, userMessage: boolean, message_location: "top" | "middle" | "bottom" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const attachments = message.attachments || [];
  const audioFiles = attachments.filter((att) => att.fileType.startsWith("audio"))
  const videoFiles = attachments.filter((att) => att.fileType.startsWith("video"))
  const imageFiles = attachments.filter((att) => att.fileType.startsWith("image"))
  const documentFiles = attachments.filter((att) => !att.fileType.startsWith("audio") && !att.fileType.startsWith("video") && !att.fileType.startsWith("image"))
  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      setShouldScroll(text.scrollWidth > container.clientWidth);
    }
  }, []);
  return (
    <motion.div
      layout
      initial={{ y:20, opacity: 0, scale: 0.8 }}
      animate={{y:0, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      ref={textRef} className='min-w-[200px] relative  max-w-80 md:max-w-2xl md:min-w-[350px] w-full rounded-3xl px-1 md:px-2  flex'>
      {/* User and time detail */}
      <div className='p-2 absolute top-0 left-0 -translate-x-8/10'>
        {
          !userMessage && message_location === "top" && (
            <>
              {
                message.sender?.profileImageUrl ?
                  <Image src={message.sender.profileImageUrl} alt="profile image" width={100} height={100} className='size-9 rounded-full object-cover' />
                  :
                  <User className='size-9  border-2 border-black dark:border-white rounded-full' />
              }
            </>
          )

        }
      </div>
      <div className='flex flex-col w-full mt-2'>

        <div className='max-w-full'>
          <div className={` ${userMessage ? "gap-2" : "justify-between"}  flex  w-full px-2 `}>
            <p className='text-sm dark:text-white'>{userMessage ? "You ," : message.sender?.username}</p>
            <p className='text-sm'>
              <Time commentDate={message.createdAt} />
            </p>
          </div>

          {/* rendering content */}
          <div className={`flex relative my-1 mx-2 flex-col p-1 w-full rounded-xl ${userMessage ? "bg-gray-200 dark:bg-neutral-800" : "bg-gray-100 dark:bg-neutral-700"}`}>
            <div
              className={`absolute 
                        ${userMessage ?
                  "right-0 rotate-45 translate-x-1/2 text-gray-200 dark:text-neutral-800"
                  : "left-0 -translate-x-1/2 -rotate-45 text-gray-100 dark:text-neutral-700"
                } 
                        ${message_location === "top" ? " top-0 -translate-y-1/2" : "hidden"
                } 
                        `
              }>
              <SolidTriangle />
            </div>


            {
              message.content && (
                <div className='p-2 px-4 dark:text-white'>
                  <div className="break-words max-w-full h-auto">
                    <FilterLinks content={message.content} />
                  </div>
                </div>
              )
            }
            {/* rendering content */}
            {
              attachments.length > 0 && (
                <div className='p-4  dark:text-white'>
                  <div ref={containerRef} className={`flex flex-col max-w-80 gap-2  ${shouldScroll ? "overflow-x-auto" : ""}`}>
                    {
                      audioFiles.map((audio, index) => (
                        <AudioComponent key={index} fileName={audio.fileName} fileUrl={audio.fileUrl} />
                      ))
                    }
                    {
                      videoFiles.map((video, index) => (
                        <VideoComponent key={index} fileName={video.fileName} fileUrl={video.fileUrl} />
                      ))
                    }
                    {
                      imageFiles.map((image, index) => (
                        <ImageComponent key={index} fileName={image.fileName} fileUrl={image.fileUrl} />
                      ))
                    }
                    {
                      documentFiles.map((doc, index) => (
                        <DocumentComponent key={index} fileName={doc.fileName} fileUrl={doc.fileUrl} fileType={doc.fileType} />
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MessageComp
const AudioComponent = ({ fileName, fileUrl }: { fileUrl: string, fileName: string }) => {
  return (
    <div className='relative flex p-2 justify-between items-center  bg-gray-200 dark:bg-neutral-800 rounded-lg '>
      <div className='flex flex-col items-center gap-2 w-full'>
        <div >
          <audio src={fileUrl} controls className=' rounded' />
        </div>
        <span className='text-sm'>{fileName}</span>
      </div>
    </div>
  )
}
const ImageComponent = ({ fileName, fileUrl }: { fileUrl: string, fileName: string }) => {
  const [dowloading, setdowloading] = useState<boolean>(false)
  return (
    <div className='relative flex justify-between items-center '>
      <div className='flex gap-2 w-full px-2 py-1 items-center justify-between rounded bg-white dark:bg-black cursor-pointer'>
        <div className='flex items-center gap-2'>
          <div className='p-2 rounded-lg  '>
            <img src={fileUrl} alt={fileName} className='size-10 object-cover rounded' />
          </div>
          <span className='text-sm line-clamp-1 '>{fileName}</span>

        </div>
        {
          dowloading ? (
            <div>
              <Image
                alt='dowloading gif'
                width={500}
                height={300}
                src={'/dowload.gif'}
                className='size-11 min-w-10 invert-100 rounded-full'
              />
            </div>
          ) : (
            <DownloadCloudIcon onClick={
              () => handleDownload({ fileName, fileUrl, setdowloading })} className='size-10 cursor-pointer min-w-10 p-2 border-pink-600 border  bg-pink-300 hover:bg-pink-400 rounded-full' />
          )
        }
      </div>
    </div>
  )
}
const VideoComponent = ({ fileName, fileUrl }: { fileUrl: string, fileName: string }) => {
  const [dowloading, setdowloading] = useState<boolean>(false)
  return (
    <div className='relative flex justify-between items-center '>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex items-center gap-3 p-2 rounded-lg bg-teal-200 hover:bg-teal-200 cursor-pointer'>
          <div className='p-2 rounded-lg'>
            <video src={fileUrl} controls className='size-9 object-cover rounded-full' />
          </div>
          <span className='text-sm'>{fileName}</span>
        </div>
      </div>
      {
        dowloading ? (
          <div>
            <Image
              alt='dowloading gif'
              width={500}
              height={300}
              src={'/dowload.gif'}
              className='size-11 invert-100  rounded-full'
            />
          </div>
        ) : (
          <DownloadCloudIcon onClick={
            () => handleDownload({ fileName, fileUrl, fileType: "video", setdowloading })} className='size-10 cursor-pointer p-2  bg-gray-200 dark:bg-black rounded-full' />
        )
      }
    </div>
  )
}



const DocumentComponent = ({ fileName, fileUrl, fileType }: {
  fileUrl: string,
  fileName: string,
  fileType: string,
}) => {
  const [dowloading, setdowloading] = useState<boolean>(false)
  return (
    <div className='relative flex justify-between items-center '>
      <div className='flex gap-2 w-full p-2 items-center justify-between rounded bg-indigo-100 hover:bg-indigo-200 cursor-pointer'>
        <div className='flex items-center gap-3 p-2  '>
          <div className='p-2 rounded-lg bg-indigo-300 '>
            <File className='text-indigo-600 bg-indigo-300  rounded-full' />
          </div>
          <span className='text-sm line-clamp-1'>{fileName}</span>

        </div>
        {
          dowloading ? (
            <div>
              <Image
                alt='dowloading gif'
                width={500}
                height={300}
                src={'/dowload.gif'}
                className='size-11 min-w-10 invert-100 rounded-full'
              />
            </div>
          ) : (
            <DownloadCloudIcon onClick={
              () => handleDownload({ fileName, fileUrl, fileType, setdowloading })} className='size-10 cursor-pointer min-w-10 p-2  bg-indigo-300 hover:bg-indigo-400 rounded-full' />
          )
        }
      </div>

    </div>
  )
}
export const Message = React.memo(MessageComp, (prevProps, nextProps) => {
  // Compare the message content and attachments
  const isSameContent = prevProps.message.content === nextProps.message.content;
  const isSameAttachments = JSON.stringify(prevProps.message.attachments) === JSON.stringify(nextProps.message.attachments);
  // If both content and attachments are the same, do not re-render
  return isSameContent && isSameAttachments;
});