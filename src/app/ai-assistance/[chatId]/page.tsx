"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import InputMessage from "@/components/AI-Assistant/InputText/Index";
import AppSidebar from "@/components/AI-Assistant/Sidebar/Index";
import { useSidebar } from "@/components/ui/sidebar";
import { sendMessage } from "@/lib/helper/sendAiMessage";
import AIHeader from "@/components/AI-Assistant/AiHeader";
import AiMessages from "@/components/AI-Assistant/AiMessages";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "@/state/Global";
import { RootState } from "@/state/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppendMessageMutation, useLazyGetAiChatByIdQuery } from "@/state/Api/ai-assistant/api";
const Chat = () => {
  const [appendMessage] = useAppendMessageMutation();
  const messages = useSelector((state: RootState) => state.global.messages);
  const newChatId = useSelector((state: RootState) => state.global.newChatId);
  const dispatch = useDispatch()
  const { chatId }: { chatId: string } = useParams()
  const { toggleSidebar } = useSidebar()
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<{ setValue: (val: string) => void, getValue: () => string, clear: () => void }>(null);
  const [loading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [animateInputToBottom, setAnimateInputToBottom] = useState(false);
  const [triggerGetChatById] = useLazyGetAiChatByIdQuery();
  const [fetchingMessages, setFetchingMessages] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateInputToBottom(true);
    }, 100);
    document.getElementById("targetDiv")?.scrollIntoView({ behavior: "smooth" });
    if(!chatId || chatId===newChatId)return

    const fetchData = async () => {
      setFetchingMessages(true)
      const { data } = await triggerGetChatById({ chatId });
      dispatch(setMessages(data?.data?.getAiChatById?.Messages || []));
      setFetchingMessages(false)
    };

    fetchData();

    document.getElementById("targetDiv")?.scrollIntoView({ behavior: "smooth" });
    
    return () => clearTimeout(timeout);
  }, [chatId, triggerGetChatById,newChatId, dispatch]);


  // Memoized state setter
  const [selectedTextForQuery, _setSelectedTextForQuery] = useState('');
  const setSelectedTextForQuery = useCallback((text: string) => {
    _setSelectedTextForQuery(text);
  }, []);

  const handleCopy = useCallback((content: string, index: number) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      });
  }, []);

  const handleEdit = useCallback((content: string) => {
    if (inputRef.current) {
      inputRef.current?.clear();
      inputRef.current?.setValue(content);
    }
  }, []);

  const sendMessageToAi = useCallback((InputMessage: string) => {
    if (chatId.trim() === "") return;
    sendMessage({
      selectedTextForQuery,
      inputText: InputMessage,
      chatId,
      appendMessage
    });
  }, [selectedTextForQuery, chatId, appendMessage]);


  const sendEdditedMessageToAi = useCallback((InputMessage: string, selectedText: string) => {
    if (chatId.trim() === "") return;
    sendMessage({
      selectedTextForQuery: selectedText,
      inputText: InputMessage,
      chatId,
      appendMessage
    });
  }
    , [chatId, appendMessage]);

  return (
    <div className="h-[100vh] overflow-hidden absolute top-0 w-full dark:bg-neutral-900 bg-white dark:text-white">
      {/* Header */}
      <AIHeader
        id={chatId}
        open={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      <AppSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* loading messages */}
      {
        fetchingMessages && messages?.length === 0 && (
          <div className="absolute top-40 w-screen h-4/5 flex gap-10 flex-col md:px-30">
            <Skeleton className="w-1/2 h-1/9  translate-x-full" />
            <Skeleton className="w-4/5 h-4/6  mr-1/2" />
          </div>
        )
      }
      {/* Chat Messages */}
      <AiMessages
        sendMessage={sendEdditedMessageToAi}
        setSelectedTextForQuery={setSelectedTextForQuery}
        loading={loading}
        handleCopy={handleCopy}
        handleEdit={handleEdit}
        copiedIndex={copiedIndex}
        chatId={chatId}
        messages={messages}
      />
      {/* Input Message */}
      <div className={`${animateInputToBottom ? "-bottom-14" : "bottom-1/3"} transition-all duration-700 md:px-4 bg-transparent px-2 flex flex-col-reverse gap-1  items-center justify-center absolute w-full dark:text-white z-10`}>
        <InputMessage
          chatStarted={chatId !== ""}
          selectedTextForQuery={selectedTextForQuery}
          setSelectedTextForQuery={setSelectedTextForQuery}
          ref={inputRef}
          sendMessage={sendMessageToAi}
        />
      </div>
    </div>
  );
};

export default React.memo(Chat);