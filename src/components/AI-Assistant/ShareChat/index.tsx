"use client"
import React from 'react'
import Modal from '@/components/Multipurpose/Modal'
import Button from '../../Multipurpose/Button/Index'
import {  CheckCheck, Link } from 'lucide-react'
const ModalShareChat = ({ isOpen, onClose , id }:{
    isOpen:boolean,
    onClose:()=>void,
    id:string,
}) => {
    const [iscoppied,setIsCopied]=React.useState<boolean>(false)
    return (
        <Modal isOpen={isOpen} onClose={onClose} name={"Share public link to chat"} >
            <div>
                <div className="flex flex-col justify-center items-center gap-4 px-2 md:px-6 py-8  text-white">
                    <div className="flex items-center px-2 font-light">
                        <p>Your name, custom instructions, and any messages you add after sharing stay private.</p>
                    </div>
                    <div className='flex items-center md:p-4 p-2 rounded-full  border-gray-300 border gap-3  md:gap-10 w-fit '>
                        <span className='max-w-50 md:max-w-70 truncate'>https://chatgpt-gray-xi.vercel.app/share/{id}</span>
                        <div>
                            <Button onClick={()=>{
                                navigator.clipboard.writeText(`https://chatgpt-gray-xi.vercel.app/share/${id}`)
                                setIsCopied(true)
                                setTimeout(() => {
                                    setIsCopied(false)
                                }, 1500);
                            }} text={iscoppied?"Coppied":"Copy"} icon={iscoppied?CheckCheck:Link}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalShareChat