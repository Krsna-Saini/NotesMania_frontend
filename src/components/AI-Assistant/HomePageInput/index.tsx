'use client'
import { ArrowUp } from 'lucide-react'
import React, { useRef, forwardRef, useImperativeHandle, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages, setNewChatId, themeStatetype } from '@/state/Global/index'
import { generateChatTitle } from '@/lib/helper/generateTitle'
import { useAddAiResponseMutation, useUpdateChatNameMutation } from '@/state/Api/ai-assistant/api'
const InputMessage = forwardRef(({ sendMessage }: {
    sendMessage: (inputText: string, chatId: string) => void,
}, ref) => {
    const dispatch = useDispatch()
    const [addAiResponse] = useAddAiResponseMutation()
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const userData=useSelector((state:{global:themeStatetype})=>state.global.user)
    const userId=userData.id
    const router = useRouter()
    const [creatingNewChat, setCreatingNewChat] = useState<boolean>(false)
    const [updateChatName] = useUpdateChatNameMutation();
    // Allow parent to access inputRef methods
    useImperativeHandle(ref, () => ({
        setValue: (value: string) => {
            if (inputRef.current) {
                inputRef.current.value = value;
                inputRef.current.style.height = 'auto';
                inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
            }
        },
        getValue: () => inputRef.current?.value ?? '',
        clear: () => {
            if (inputRef.current) inputRef.current.value = '';
        }
    }));

    const handleSendMessage = async () => {
        if (!inputRef.current?.value.trim()) return;

        const inputText = inputRef.current.value;
        setCreatingNewChat(true);

        try {
            // 1. Create blank chat (no name yet)
            const chatData = await addAiResponse({
                userId: userId || "",
                name: "New Chat",
            }).unwrap();
            console.log(chatData)
            const newChatId = chatData?.data?.addAiResponse?.id;
            if (!newChatId) throw new Error("Chat ID not received");

            dispatch(setMessages([])); // Clear previous
            dispatch(setNewChatId(newChatId));
            router.push(`/ai-assistance/${newChatId}`); // Route immediately

            // 2. Start conversation right away
            sendMessage(inputText, newChatId);

            // 3. Generate & update chat title in background
            generateChatTitle({ inputText })
                .then(async (title) => {
                    if (!title || !userId) return;
                    await updateChatName({chatId:newChatId,name:title , userId:userId})
                })
                .catch((err)=>{
                    console.log(err)
                });

            // 4. Clear input
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.style.height = 'auto';
            }

            setCreatingNewChat(false);
        } catch (err) {
            console.error("Failed to create chat or send message", err);
            setCreatingNewChat(false);
        }
    };


    return (
        <div className='w-full mb-2 px-4 absolute bottom-2'>
            {/* Welcome Message */}

            <div className='flex flex-col items-center justify-center w-full h-full'>
                <div className='flex flex-col items-center justify-center w-full h-full'>
                    <Image src="/help.png" alt="AI Assistant" width={100} height={100} className='object-contain dark:invert' />
                    <h1 className='text-2xl font-bold text-center'>Welcome to AI Assistant</h1>
                    <p className='text-sm text-gray-500'>Start your conversation with AI</p>
                </div>
            </div>
            {/* Input Component */}
            <div className="  max-w-3xl mx-auto">
                <div className=' relative py-2 rounded-4xl md:px-4 px-3 bg-neutral-800 text-white justify-center'>
                    {creatingNewChat ?
                        <div className='flex w-full items-center justify-center py-8'>
                            <Image className="object-contain scale-[2] md:scale-[3]" src="/homepageLoading.gif" alt="Loading" width={32} height={32} />
                        </div>
                        :
                        (
                            <div>
                                <textarea
                                    aria-label="Type your message"
                                    rows={1}
                                    className="custom-textarea flex-1 px-6 py-2 mt-2  mb-10 overflow-y-auto resize-none focus:outline-none w-full"
                                    placeholder="Type your message..."
                                    ref={inputRef}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    onInput={() => {
                                        if (inputRef.current) {
                                            inputRef.current.style.height = 'auto';
                                            const scrollHeight = inputRef.current.scrollHeight;
                                            const height = Math.min(scrollHeight, 128);
                                            inputRef.current.style.height = `${height}px`
                                        }
                                    }}
                                />
                                {/* Submit Button */}
                                <button
                                    className=" absolute cursor-pointer bottom-1 right-3"
                                    onClick={handleSendMessage}
                                    disabled={inputRef.current?.value.trim() === "" || creatingNewChat}
                                >
                                    <div className="md:h-14 h-10 w-12 md:w-16 rounded-full flex overflow-hidden items-center justify-center">
                                        <ArrowUp className="text-black size-6  md:size-8 translate-x-2 md:translate-x-3 p-1 bg-white rounded-full scale-125" />
                                    </div>
                                </button>
                            </div>
                        )
                    }
                    {/* Input Prompt */}
                </div>
            </div>
        </div>
    )
});

InputMessage.displayName = "InputMessage";

export default InputMessage;
