"use client";
import React, { useState, useRef, useCallback } from "react";
import InputMessage from "@/components/AI-Assistant/HomePageInput";
import AppSidebar from "@/components/AI-Assistant/Sidebar/Index";
import { useSidebar } from "@/components/ui/sidebar";
import { sendMessage } from "@/lib/helper/sendAiMessage";
import AIHeader from "@/components/AI-Assistant/AiHeader";
import { useAppendMessageMutation } from "@/state/Api/ai-assistant/api";
const Chat = () => {
  const [appendMessage] = useAppendMessageMutation();
  const {toggleSidebar}=useSidebar()
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<{ setValue: (val: string) => void, getValue: () => string, clear: () => void }>(null);
  const sendMessageToAi = useCallback((InputMessage: string , chatId:string) => {
    
    sendMessage({
      selectedTextForQuery:"",
      inputText: InputMessage,
      chatId,
      appendMessage
    });
  }, [ appendMessage]);
  return (
    <div className="h-[100vh] overflow-hidden absolute top-0 w-full dark:bg-neutral-900 bg-white dark:text-white">
      {/* Header */}
      <AIHeader
        id={""}
        open={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      <AppSidebar setIsOpen={setIsOpen} isOpen={isOpen}/>

      {/* Input Message */}
      <div className={` bottom-1/3 transition-all duration-700 md:px-4 bg-transparent px-2 flex flex-col-reverse gap-1  items-center justify-center absolute w-full dark:text-white z-10`}>
        <InputMessage
          ref={inputRef}
          sendMessage={sendMessageToAi}
        />
      </div>
    </div>
  );
};

export default React.memo(Chat);