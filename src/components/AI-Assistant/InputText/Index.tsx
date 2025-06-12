'use client'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import TextArrowIcon from '../../Icons/TextArrow';
import { useSelector } from 'react-redux';
import { RootState } from "@/state/store";

const InputMessage = forwardRef(({chatStarted, sendMessage, selectedTextForQuery, setSelectedTextForQuery }: {
  sendMessage: (inputText: string) => void,
  chatStarted: boolean,
  setSelectedTextForQuery: (content: string) => void
  selectedTextForQuery: string
}, ref) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const loading = useSelector((state :RootState)=>state.global.loading)
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

  const handleSendMessage = () => {
    if (loading) return;
    if (!inputRef.current?.value.trim()) return;
    const inputText = inputRef.current.value;
    sendMessage(inputText);
    setSelectedTextForQuery('')
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.style.height = 'auto';
    }
  };

  return (
    <div className='w-full mb-2 px-4 absolute bottom-2'>
      {/* Scroll Down */}
      <div className={`${!chatStarted && "hidden"} absolute -top-8 right-1/2 translate-x-1/2 cursor-pointer border border-neutral-500 rounded-full w-fit h-fit `} onClick={() => document.getElementById('targetDiv')?.scrollIntoView({ behavior: 'smooth' })}>
        <ArrowDown className="size-6 bg-transparent p-1 " />
      </div>
      {/* Input Component */}
      <div className="  max-w-3xl mx-auto">
        <div className=' relative py-2 rounded-4xl md:px-4 px-3 bg-neutral-800 text-white justify-center'>
          {/* Rendering selected Text */}
          {
            selectedTextForQuery.trim() && (
              <div className='relative w-full flex justify-between mt-3 p-3 rounded-t-3xl rounded-lg bg-neutral-500 text-white'>
                <button className='w-[10%] flex items-start'><TextArrowIcon className='h-fit' /></button>
                <span className='w-full line-clamp-3 text-sm'>{selectedTextForQuery}</span>
                <button className=' h-full ml-1 flex items-start justify-center cursor-pointer' onClick={() => setSelectedTextForQuery("")}><X /></button>
              </div>
            )
          }
          {/* Input Prompt */}
          <textarea
            aria-label="Type your message"
            rows={1}
            className="custom-textarea flex-1 px-6 py-2 mt-2  mb-10 overflow-y-auto resize-none focus:outline-none w-full"
            placeholder="Type your message..."
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // 🔥 Prevents the newline
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
            disabled={loading || inputRef.current?.value.trim()=== ""}
          >
            <div className="md:h-14 h-10 w-12 md:w-16 rounded-full flex overflow-hidden items-center justify-center">
              {
                loading ? (
                  <Image className="object-contain scale-[3] md:scale-[4]" src="/loading2.gif" alt="Loading" width={32} height={32} />
                ) : (
                  <ArrowUp className="text-black size-6  md:size-8 translate-x-2 md:translate-x-3 p-1 bg-white rounded-full scale-125" />
                )
              }
            </div>
          </button>
        </div>
      </div>
    </div>
  )
});

InputMessage.displayName = "InputMessage";

export default InputMessage;
