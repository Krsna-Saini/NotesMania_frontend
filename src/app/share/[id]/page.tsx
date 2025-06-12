"use client";
import React, { useState, useCallback, useEffect } from "react";
import AiMessages from "@/components/AI-Assistant/AiMessages";
import { useParams } from "next/navigation";
import { LockKeyhole, Rocket } from "lucide-react"
import Button from "@/components/Multipurpose/Button/Index";
import { useLazyGetAiChatByIdQuery } from "@/state/Api/ai-assistant/api";
const Chat = () => {

  interface Message {
    role: "user" | "assistant";
    content: string;
    pending?: boolean;
  }
  const { id } = useParams();
  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  useEffect(() => {
    document.getElementById("targetDiv")?.scrollIntoView({ behavior: "smooth" });
  }, [chatId]);
  const handleCopy = useCallback((content: string, index: number) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      });
  }, []);

  const [triggerGetChatById] = useLazyGetAiChatByIdQuery();
  useEffect(() => {
    if (id) {
      setChatId(typeof id === "string" ? id : id[0]);
      triggerGetChatById({ chatId: typeof id === "string" ? id : id[0] }).then(({ data }) => {
        setMessages(data?.data?.getAiChatById?.Messages || []);
      });
    }
  }
    , [triggerGetChatById, id]);
  return (
    <div className="h-[100vh] overflow-hidden w-[100vw] dark:bg-black bg-white  dark:text-white">

      {/* Header */}
      <div className="flex h-16 md:h-18 border-b-2 dark:border-gray-600 border-gray-300  gap-2 p-2 sticky top-0 z-20 items-center justify-end ">
        <div className=" w-fit h-[100%] left-1 md:left-auto md:right-1/2  md:translate-x-1/2 absolute top-0 flex items-center justify-center text-center text-2xl md:text-4xl lg:text-5xl  font-semibold ">
          <div className="bg-gradient-to-r via-[#ed0f82] from-[#d54cff] to-[#ff118c] bg-clip-text text-transparent">
            Chat Assistant
          </div>
        </div>
      </div>
      {/* Imported Chat */}
      {chatId && (
        <div className="fixed -right-8 top-1/2 -translate-y-1/2 rotate-90 z-50">
          <button
            className="p-2 px-4 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform duration-300"
            style={{
              background: 'linear-gradient(135deg, #ff032d, #ff03fb,#d54cff )',
              boxShadow: '0 0 10px #ff032d, 0 0 20px #ff03fb, 0 0 30px #d54cff',
            }}
          >
            Imported Chat
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <AiMessages
        className="dark:bg-[#101010] bg-gray-100"
        handleCopy={handleCopy}
        copiedIndex={copiedIndex}
        chatId={chatId}
        messages={messages}
      />

      {/* Bottom */}
      <div className="absolute bottom-0 h-18 items-center py-2 flex flex-col justify-start w-full border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900">
        <Button icon={Rocket} text="Upgrade" />
        <div className="flex text-sm mx-auto absolute  right-1/2 translate-x-1/2 bottom-1 items-center gap-1 text-gray-800 dark:text-gray-300"><LockKeyhole className="text-[#ff118c]" size={14}></LockKeyhole><span className="text-nowrap">Upgrade to save the chat and ask more</span>  </div>
      </div>
    </div>
  );
};

export default React.memo(Chat);