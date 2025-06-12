"use client";
import React, { useState } from 'react';
import Modal from '@/components/Multipurpose/Modal';
import { Trash, Loader2 } from 'lucide-react';
import { useDeleteChatMutation } from '@/state/Api/ai-assistant/api';
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';
import { themeStatetype } from '@/state/Global';

const ModalDeleteChat = ({ isOpen, onClose, id }: {
    isOpen: boolean,
    onClose: () => void,
    id: string,
}) => {
    const router = useRouter();
    const userData=useSelector((state:{global:themeStatetype})=>state.global.user)
    const userId=userData.id
    const [deleteChat] = useDeleteChatMutation();
    const [loading, setLoading] = useState(false); // <-- loading state

    const handleDeleteChat = async () => {
        if (!id || !userId) return;

        setLoading(true); // start loading
        try {
            await deleteChat({ chatId: id, userId });
            router.push('/');
            onClose();
        } catch (error) {
            console.error("Failed to delete chat:", error);
        } finally {
            setLoading(false); // stop loading
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} name={"Delete Chat History Permanently"}>
            <div className="flex flex-col justify-center items-center gap-4 px-2 md:px-6 py-8 text-white">
                <div className="flex items-center px-2 font-light">
                    <p className='text-red-300'>
                        Your Chat with AI-Assistant will be deleted and you will not be able to recover it.
                    </p>
                </div>
                <div className='w-full flex justify-center items-center mt-4'>
                    <button
                        className={`flex items-center gap-2 px-10 py-2 border-2 border-red-400 bg-red-200 rounded-lg ${
                            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        onClick={handleDeleteChat}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin text-red-600" size={16} />
                                <span className='text-red-600'>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <Trash size={16} className='text-red-600' />
                                <span className='text-red-600'>Delete</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalDeleteChat;
