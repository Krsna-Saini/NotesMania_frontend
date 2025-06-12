import React from "react";
import MessageComp from "@/components/Groups/Message/Index";
import MessageSubscription from "@/state/wsApi";
import { messageType } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { themeStatetype } from "@/state/Global";
import { useGetMessagesByIdQuery } from "@/state/Api/group/api";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ NEW

type MessageType = {
  message: messageType;
};

const ChatBox = ({
  groupId,
  refetch,
}: {
  groupId: string;
  refetch: () => void;
}) => {
  const {
    data: chatData,
    refetch: refetchMessages,
    isLoading,
  } = useGetMessagesByIdQuery({ groupId });

  const [messages, setMessages] = useState<MessageType[]>([]);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: { global: themeStatetype }) => state.global.user);
  const [isVisible, setIsVisible] = useState(false);
  const [newMessage, setNewMessage] = useState(0);
  const userId = userData?.id;

  useEffect(() => {
    refetchMessages();
  }, [groupId,refetchMessages]);

  useEffect(() => {
    if (chatData?.data?.getGroup?.messages) {
      setMessages(chatData.data.getGroup.messages);
    }
  }, [chatData?.data?.getGroup?.messages, groupId]);

  const handleNewMessage = (newMessage: messageType) => {
    refetch();
    setMessages((prev) => [...prev, { message: newMessage }]);

    if (!isVisible) {
      setNewMessage((prev) => prev + 1);
    }
  };

  useLayoutEffect(() => {
    if (isVisible) {
      bottomDivRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root: null, threshold: 1 }
    );

    const currentRef = bottomDivRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setNewMessage(0);
    }
  }, [isVisible]);

  return (
    <div className="flex flex-col overflow-y-scroll max-h-full h-full">
      <MessageSubscription groupId={groupId} onNewMessage={handleNewMessage} />

      <div className="relative flex overflow-y-auto min-h-[75%] overflow-x-hidden flex-col">
        {isLoading ? (
          <div className="flex flex-col gap-4 px-4 py-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <Skeleton className="h-10 w-3/4 max-w-[250px] rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {messages.map((msgWrapper, index) => {
              const previous_msg = messages[index - 1]?.message;
              const next_msg = messages[index + 1]?.message;
              const msg = msgWrapper.message;

              let message_Location: "top" | "middle" | "bottom" = "top";

              if (
                previous_msg &&
                next_msg &&
                previous_msg?.sender?.id === msg.sender?.id &&
                next_msg?.sender?.id === msg.sender?.id
              ) {
                message_Location = "middle";
              } else if (
                previous_msg &&
                previous_msg?.sender?.id === msg.sender?.id &&
                (!next_msg || (next_msg && next_msg?.sender?.id !== msg.sender?.id))
              ) {
                message_Location = "bottom";
              }

              if (msg?.type === "critical") {
                return (
                  <div
                    key={index}
                    className="w-full py-1 my-2 text-sm text-center font-semibold text-pink-600 bg-rose-50"
                  >
                    <span className="mr-1 underline underline-offset-[2.5px] cursor-pointer text-rose-600">
                      @{msg.sender?.username}:
                    </span>
                    {msg.content}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`flex w-full px-4
                    ${msg?.sender?.id === userId ? "justify-end" : "justify-start ml-6 md:ml-10"}
                    ${msg?.sender?.id === userId && "mt-2"}
                  `}
                >
                  <div className="w-fit">
                    <MessageComp
                      message={msg}
                      userMessage={msg.sender?.id === userId}
                      message_location={message_Location}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
        
      <div className="h-10 w-full" ref={bottomDivRef}></div>
      </div>
      <div
        className={`${!newMessage && "hidden"
          } absolute bottom-24 md:bottom-28 right-6 flex items-center gap-2 bg-accent rounded-full p-2 px-4`}
      >
        <span className="absolute right-0.5 -top-2">
          <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
            {newMessage < 21 ? newMessage : "20+"}
          </Badge>
        </span>
        <Image
          height={300}
          width={300}
          src="/newMessage.gif"
          alt="newMessage"
          className="h-[30px] w-[30px]"
        />
        <span>Message</span>
      </div>

      {!isVisible && (
        <div className="absolute bottom-24 md:bottom-28 right-1/2">
          <button
            onClick={() => {
              bottomDivRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hover:bg-accent cursor-pointer backdrop-blur-sm rounded-full p-2"
          >
            <ArrowDown size={20} className="text-accent-foreground" />
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatBox);
