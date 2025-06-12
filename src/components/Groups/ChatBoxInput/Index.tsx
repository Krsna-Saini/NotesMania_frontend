import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import { ArrowUp, Mic2Icon, MicIcon, Paperclip } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import useVoiceInput from "../useVoiceInput";
import useAudioRecorder from "../VoiceInput/Index";
import FilePreview from "../Preview/Index";
import Button from "@/components/Multipurpose/Button/Index";
import debounce from 'lodash.debounce';
import { useSendMessageMutation } from "@/state/Api/group/api";
import { useUpdateStopTypingMutation, useUpdateTypingMutation } from "@/state/Api/user/api";

const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL
const ChatInput = ({ senderId, groupId,setSendingMessage ,sendingMessage}: {
    senderId: string,
    groupId: string,
    setSendingMessage:Dispatch<SetStateAction<boolean>>
    sendingMessage:boolean
}) => {
    // State to manage the visibility of the preview
    const [showpreview, setShowPreview] = useState(false)
    const { isRecording, audioFile, startRecording, stopRecording } = useAudioRecorder();
    const { transcript, isListening, startListening, stopListening } = useVoiceInput();
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [sendMessage] = useSendMessageMutation()
    const [UpdateTyping] = useUpdateTypingMutation()
    const [UpdateStopTyping] = useUpdateStopTypingMutation()

    const debouncedStartTyping = useCallback(
        
        debounce(() => {
            UpdateTyping({userId:senderId,groupId:groupId})
        }, 300), // Trigger "typing" update after 300ms of user input
        [senderId, groupId]
    );

    const debouncedStopTyping = useCallback(
        debounce(() => {
            UpdateStopTyping({ userId: senderId, groupId })
        }, 1000), // Trigger "stop typing" after 1s of inactivity
        [senderId, groupId]
    );

    useEffect(() => {
        return () => {
            debouncedStartTyping.cancel();
            debouncedStopTyping.cancel();
        };
    }, [debouncedStartTyping, debouncedStopTyping]);


    useEffect(() => {
        setText(transcript);
    }, [transcript])
    // Handle text change
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText(value);
        debouncedStartTyping();  // User started typing
        debouncedStopTyping();   // Wait for user to stop typing
    };
    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    // Handle paste event (for images)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePaste = (e: { clipboardData: { items: any }; }) => {
        const items = e.clipboardData.items;
        const pastedFiles = [];
        for (const item of items) {
            if (item.kind === "file") {
                pastedFiles.push(item.getAsFile());
            }
        }
        if (pastedFiles.length > 0) setFiles([...files, ...pastedFiles]);
    };

    const toggleVoiceInput = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Handle send
    const handleSend = async () => {
        setSendingMessage(true)
        let attachments = []
        if (files.length > 0 || audioFile) {
            const formdata = new FormData()
            files.forEach((file) => {
                formdata.append('files', file)
            });
            if (audioFile) {
                formdata.append('files', audioFile)
            }
            formdata.append('userId', senderId);
            formdata.append('groupId', groupId);

            const response = await fetch(`${Backend_url}/upload`, {
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'application/json'
                }
            })
            attachments = await response.json()
            if(attachments.length===0 && (files.length>0 || audioFile)){
                return console.log("attachment is not uploaded")
            }
        }
        if (text || attachments) {
            sendMessage({
                senderId: senderId,
                groupId: groupId,
                type: "text",
                content: text,
                attachments: attachments.attachmentsArray || []
            }).then((data) => {
                console.log(data)
            })
        }
        setText('')
        setFiles([])
    };

    return (
        <div className=" bg-gray-200 w-full mx-3 px-4 md:py-2 dark:bg-gray-600 md:mx-auto relative sm:mx-10 max-w-3xl sm:w-8/10 flex flex-col justify-center items-center rounded-2xl sm:rounded-[30px] gap-2 border">
            {/* show preview */}
            <div className={`${showpreview ? "flex" : "hidden"} absolute rounded-2xl -top-3 -translate-y-full bg-accent items-center md:p-4 w-full max-w-[80vw] lg:max-w-[55vw] overflow-x-auto `}>
                {
                    (!files.length && !audioFile) && (
                        <div className="text-2xl w-full text-center font-semibold text-red-400 dark:text-red-200">
                            Nothing to preview
                        </div>
                    )
                }
                {
                    files.map((file, index) => (
                        <FilePreview key={index} file={file} />
                    ))
                }
                {
                    audioFile && <FilePreview key={'audiofile'} file={audioFile} />
                }
            </div>
            {/* handle input */}
            <div className="flex flex-col w-full items-center px-2  rounded-full">
                {/* text input */}
                <div className="w-full flex ">
                    {
                        (isListening || isRecording) ? (
                            <div className="w-full max-h-[40px] overflow-hidden flex items-center">
                                <Image width={100} height={100} src="/voice1.gif" alt="" className="w-[200px] h-[54px] " />
                            </div>
                        )
                            : (
                                <input
                                    value={text}
                                    onChange={handleTextChange}
                                    onPaste={handlePaste}
                                    placeholder="Type a message..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    className="w-full p-2 forced-color-adjust-none border-none outline-none"
                                />
                            )
                    }
                </div>
                {/* buttons */}
                <div className="flex w-full h-fit pb-1">
                    <div className="flex justify-between w-full  gap-3">
                        <div className="flex gap-1.5 items-center">
                            {/* File Input Button */}
                            <div>
                                <input type="file" multiple onChange={handleFileChange} className="hidden" id="fileInput" />
                                <label htmlFor="fileInput" className="cursor-pointer text-blue-400"><Paperclip /></label>

                            </div>
                            {/* Speak to write button */}
                            <Button onClick={toggleVoiceInput} hideText={true} icon={Mic2Icon} role="Speak to write" text="Speak" align="top" />
                            {/* Record Voice Message */}
                            <Button onClick={() => {
                                if (!isRecording) {
                                    startRecording()
                                }
                                else {
                                    stopRecording()
                                }
                            }} text="Voice" icon={MicIcon} hideText={true} align="top" role="Record Voice message" />
                        </div>
                        {/* Preview */}
                        <div className="flex items-center justify-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div onClick={() => setShowPreview(!showpreview)}>
                                            <Image src={'/file.png'} alt="file image" width={64} height={64} className="max-w-[28px] flex dark:hidden cursor-pointer" />
                                            <Image src={'/file (1).png'} alt="file image" width={64} height={64} className="max-w-[28px] hidden dark:flex cursor-pointer" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="dark:bg-white bg-black cursor-pointer text-white dark:text-black px-2 py-1 mb-1 rounded-full">Show Preview</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className="flex gap-0.5">
                                <span>{files.length}</span>
                                <span> File</span>
                            </div>
                            <div className="h-8 border-l-2 border-gray-500 dark:bg-gray-300"></div>
                            <button
                                className=" cursor-pointer "
                                onClick={handleSend}
                                disabled={sendingMessage}
                            >
                                <div className="md:h-10 h-8 w-12 md:w-16 rounded-full flex overflow-hidden items-center justify-center">
                                    {
                                        sendingMessage ? (
                                            <Image className="object-contain scale-[3] md:scale-[4]" src="/loading2.gif" alt="sending" width={32} height={32} />
                                        ) : (
                                            <ArrowUp className="text-black size-6  md:size-8 translate-x-2 md:translate-x-3 p-1 bg-white rounded-full scale-125" />
                                        )
                                    }
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
