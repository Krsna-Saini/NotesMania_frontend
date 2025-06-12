"use client";
import React, { useState, memo, useRef, RefObject } from "react";
import MarkdownRenderer from "@/components/AI-Assistant/AIresponse/Index";
import { CheckCheckIcon, Copy, DropletOffIcon, InfoIcon, PencilLineIcon, SparkleIcon, } from "lucide-react"
import Button from "../../Multipurpose/Button/Index";
import TextArrowIcon from "@/components/Icons/TextArrow";

interface Message {
  role: "user" | "assistant";
  content: string;
  selectedText?: string | null;
  pending?: boolean;
  error?: boolean
}
const AiMessages = ({ loading, className, messages, sendMessage, setSelectedTextForQuery, handleEdit, handleCopy, chatId }: {
  messages: Message[],
  handleEdit?: (content: string) => void,
  handleCopy: (content: string, index: number) => void,
  copiedIndex: number | null,
  chatId: string
  loading?: boolean
  className?: string
  sendMessage?: (InputMessage: string, selectedText: string) => void,
  setSelectedTextForQuery?: (content: string) => void
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`flex pt-16 flex-col dark:bg-neutral-900 h-full border-y-2 ${className} ${(!chatId) && "hidden"}   ${messages.length && "border-y-2"}`}>
      <div ref={wrapperRef} className="md:px-30  px-2 overflow-x-hidden flex-1 overflow-y-auto ">
        <div className="p-4 space-y-16  ">
          {messages.length > 0 && messages.map((msg, index) => (
            <RenderMessages loading={loading} sendMessage={sendMessage} key={index} msg={msg} handleEdit={handleEdit} setSelectedTextForQuery={setSelectedTextForQuery} wrapperRef={wrapperRef} index={index} handleCopy={handleCopy} />
          ))}
          {/* target div for scroll down */}
        </div>
        <div id="targetDiv" className={`${loading ? "h-[50vh]" : "h-[40vh]"}`}></div>
      </div>

    </div>
  )
}
export default memo(AiMessages)

const RenderMessages = ({ msg, setSelectedTextForQuery, loading, wrapperRef, sendMessage }: {
  msg: Message,
  setSelectedTextForQuery?: (content: string) => void,
  wrapperRef: RefObject<HTMLDivElement | null>,
  index: number,
  handleCopy: (content: string, index: number) => void,
  handleEdit?: (content: string) => void
  sendMessage?: (InputMessage: string, selectedText: string) => void
  loading?: boolean
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const [edditedText, setEditedText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // function for copy text
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // function to handle editing 
  const handleEditting = (text: string) => {
    setEditedText(text);
    setEdited(true);

    // Use setTimeout to ensure the textarea is rendered before adjusting height
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, 0);

  };
  return (
    <div className={`flex flex-col relative`}>
      <div
        className={`flex  flex-col gap-2 relative w-full ${msg.role === "user" ? "items-end " : "items-start"} `}
      >
        {/* User Messages */}
        {
          msg.role === "user" && (
            <div className="md:max-w-[50%] max-w-[90%] flex items-end flex-col justify-end ">

              {/* Rendering selected Text */}
              {
                msg.selectedText?.trim() && (
                  <div className='relative w-full flex justify-between mt-3 p-3 rounded-t-3xl rounded-lg  text-gray-500 dark:text-gray-300'>
                    <button className='w-[10%] flex items-start'><TextArrowIcon className='h-fit' /></button>
                    <span className='w-full line-clamp-3 text-sm'>{msg.selectedText}</span>
                  </div>
                )
              }
              {/* Rendering main Message */}
              <div className={` rounded-lg w-fit text-white`}>{

                edited
                  ?
                  // checking if user is Edditing the previous message 
                  (
                    <textarea
                      ref={textareaRef}
                      className="w-[50vw] max-h-[80vh] overflow-auto bg-gray-500 text-white rounded-lg p-2 resize-none "
                      value={edditedText}
                      onChange={(e) => {
                        setEditedText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight > 400 ? 400 : e.target.scrollHeight}px`;
                      }}
                      style={{
                        minHeight: '40px',
                        lineHeight: '1.5',
                      }}
                      autoFocus
                    />
                  )
                  :
                  // rendering the main message
                  (
                    <div className="flex items-end flex-col">
                      <div className="overflow-x-auto bg-gray-500 rounded-2xl w-fit whitespace-break-spaces px-3 py-2  max-h-[100vh]">{msg.content}</div>
                    </div>
                  )

              }
              </div>
              {/* control Buttons */}
              {
                (!edited)
                  ?
                  (
                    <div className=" w-full cursor-pointer mt-2 mr-1 flex gap-1.5 justify-end">


                      {/* button to copy prompt */}

                      <Button role="Copy Content" align="bottom" onClick={() => {
                        handleCopy(msg.content);
                      }}>
                        <div className="cursor-pointer p-1  rounded-lg hover:bg-gray-200 h-fit dark:hover:bg-neutral-700 ">
                          {
                            copied ? (
                              <CheckCheckIcon className="size-5" />
                            ) : (
                              <Copy className="size-5" />
                            )
                          }
                        </div>


                        {/* button to edit the prompt (only when there is no loading and sendMessages is provided) */}

                      </Button>
                      {
                        sendMessage && !loading && (
                          <Button role="Send Prompt" align="bottom" onClick={() => {
                            handleEditting(msg.content)
                          }}>
                            <div className="cursor-pointer flex items-center justify-center gap-1 p-1  rounded-lg hover:bg-gray-200 h-fit dark:hover:bg-neutral-700 " >
                              <PencilLineIcon className="size-5" />
                              <span className="text-sm">Edit</span>
                            </div>
                          </Button>
                        )
                      }
                    </div>
                  )
                  :
                  (
                    <div>
                      {/* button to send the eddited prompt and to cancel the editing */}
                      {
                        sendMessage && (
                          <div className=" w-full cursor-pointer mt-2 mr-2 flex gap-2 justify-end">

                            <Button icon={SparkleIcon} text="Send" align="bottom" role="Set Prompt" onClick={() => {
                              sendMessage(edditedText, msg.selectedText || "");
                              setEdited(false)
                              setEditedText("")
                            }}></Button>
                            <Button icon={DropletOffIcon} role="Close Editting" align="bottom" text="Cancel" onClick={() => {
                              setEdited(false)
                              setEditedText("")
                            }}></Button>
                          </div>
                        )
                      }
                    </div>
                  )
              }
            </div>
          )
        }
        {/* AI Messages */}
        {


          // Rendering a non-error message

          msg.role === "assistant" && !msg.error && (
            <div className=" max-w-[95%] ">
              <div className={`md:px-14 md:py-6 py-2 rounded-lg text-gray-700   dark:text-gray-200`}>
                {
                  msg.role === "assistant" && (
                    <MarkdownRenderer setSelectedTextForQuery={setSelectedTextForQuery} scrollRef={wrapperRef} content={msg.content} pending={msg?.pending || false} />
                  )
                }
              </div>


              {/* control Buttons */}

              <div className=" md:ml-8 cursor-pointer h-fit  bg-transparent  flex  justify-start ml-4 rounded">
                <Button role="Copy Content" align="bottom" onClick={() => {
                  handleCopy(msg.content);
                }}>
                  <div className="cursor-pointer p-2 rounded-lg mt-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    {
                      copied ? (
                        <span className="size-6" ><CheckCheckIcon /></span>
                      ) : (
                        <span className="size-6" ><Copy /></span>
                      )
                    }
                  </div>
                </Button>
              </div>
            </div>
          )}


        {/* Error Message */}
        
        {
          msg.error && (
            <div className="dark:text-red-400 md:ml-8 text-red-600 bg-red-100 rounded-xl border border-red-500 px-2 flex gap-1 items-center text-sm py-4 ">
              <InfoIcon />
              {msg.content}
            </div>
          )
        }
      </div>
    </div>
  )
}