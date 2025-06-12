'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Multipurpose/Header'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../Button/Index'

const Modal = ({ children, isOpen, onClose, name }: {
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
    name: string,
}) => {
    const [isBrowser, setIsBrowser] = useState(false)

    useEffect(() => {
        setIsBrowser(true)
    }, [])

    if (!isOpen) return null

    const modalContent = (
        <div className='fixed inset-0 z-50 flex h-full w-full justify-center items-center overflow-y-auto dark:bg-[rgba(0,0,0,0.7)] bg-[rgba(255,255,255,0.7)] py-4'>
            <motion.div 
                initial={{ opacity: 0, y: 0, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className='w-fit max-w-[90vw] md:max-w-xl rounded-lg bg-[#343232] shadow-lg dark:bg-dark-secondary'
            >
                <div className='border-b-gray-400  border-b-[1px] px-2 md:px-4'>
                    <Header
                        name={name}
                        buttonComponent={
                            <Button role='Close' align='left'>
                                <X
                                    className='cursor-pointer text-white'
                                    onClick={onClose}
                                />
                            </Button>
                        }
                    />
                </div>
                <div className="">{children}</div>
            </motion.div>
        </div>
    )

    if (isBrowser) {
        return ReactDOM.createPortal(modalContent, document.body)
    } else {
        return null
    }
}

export default Modal
