import React, { useState } from "react"
import SidebarIcon from "../../Icons/Sidebar/Index"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    useSidebar,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import NewChatIcon from "../../Icons/newChat"
import { Cross, Pencil, MessageCircle, Save, DropletOff } from "lucide-react"
import ModalNewChat from "@/components/AI-Assistant/CreateNewChat";
import Button from "../../Multipurpose/Button/Index"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "@/state/Global"
import { useAddAiResponseMutation, useGetAiHistoryByUserQuery, useUpdateChatNameMutation } from "@/state/Api/ai-assistant/api"
import { RootState } from "@/state/store"
const AppSidebar = ({ setIsOpen, isOpen }: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean
}) => {
    const dispatch = useDispatch()
    const path = usePathname()
    const router = useRouter()
    const userData = useSelector((state: RootState) => state.global.user)
    const userId  = userData.id
    const [addAiResponse] = useAddAiResponseMutation();
    const [updateChatName] = useUpdateChatNameMutation();
    const { toggleSidebar, open } = useSidebar()
    const [UpdatingName, setUpdatingName] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>("")
    const [EditingId, setIsEditing] = useState<string>("")

    const { data: Response, refetch, isLoading } = useGetAiHistoryByUserQuery({ userId: userId || "" })
    const ChatData = Response?.data?.getAiHistoryByUser || [];
    
    const HandleClick = async (chatId: string) => {
        dispatch(setMessages([]))
        router.push(`/chat/${chatId}`);
    };

    const handleUpdateChatName = async (chatId: string, chatName: string) => {
        setUpdatingName(true)
        if(userId){
            await updateChatName({ chatId, name: chatName , userId:userId})
        }  
        await refetch()
        setUpdatingName(false)
        setIsEditing("")
    }

    const handleCreateNewChat = async (chatName: string) => {
        const data = await addAiResponse({
            userId: userId || "",
            name: chatName
        }).unwrap()
        router.push(`/chat/${data?.data?.addAiResponse?.id}`)
    }

    return (
        <div >
            <ModalNewChat onClick={handleCreateNewChat} isOpen={isOpen} onClose={() => { setIsOpen(false) }} />
            <Sidebar className="bg-black z-[100] border-r border-gray-600">
                <Command>
                    <SidebarContent>
                        <SidebarGroup>
                            <div className={`flex w-full p-2 justify-between md:${!open && "hidden"}`}>
                                <Button role="Create New chat" align="right">
                                    <NewChatIcon func={() => {
                                        setIsOpen(true)
                                    }} className="size-9 flex items-center justify-center dark:hover:bg-gray-700 hover:bg-gray-200  rounded-lg cursor-pointer" />
                                </Button>
                                <Button role="Close Sidebar" align="left">
                                    <SidebarIcon func={toggleSidebar} className="size-9 flex items-center justify-center dark:hover:bg-gray-700 hover:bg-gray-200 rounded-lg cursor-pointer" />
                                </Button>
                            </div>
                            <div className={`flex w-full mb-2 justify-between md:${!open && "hidden"}`}>
                                <CommandInput placeholder="Type a command or search..." />
                            </div>
                        </SidebarGroup>
                        <SidebarGroup>
                            <CommandList>
                                {
                                    ChatData.length !== 0 && <CommandEmpty>No results found.</CommandEmpty>
                                }
                                <SidebarGroupContent >
                                    <SidebarMenu >
                                        <CommandGroup className=" p-0" heading={`${open ? "Previous" : ""}`}>
                                            {isLoading ? (
                                                <div>
                                                    <SidebarMenuItem className="flex flex-col gap-0.5">
                                                        <Skeleton className="h-10 w-full rounded "></Skeleton>
                                                        <Skeleton className="h-10 w-full rounded "></Skeleton>
                                                        <Skeleton className="h-10 w-full rounded "></Skeleton>
                                                        <Skeleton className="h-10 w-full rounded "></Skeleton>
                                                    </SidebarMenuItem>
                                                </div>
                                            ) : ChatData.map((item) => (
                                                <div key={item.id}>
                                                    <CommandItem className={`p-0 ${path.includes(item.id) && "bg-accent"} hover:bg-accent cursor-pointer`}>
                                                        <SidebarMenuItem className="flex items-center w-full justify-between" >
                                                            <SidebarMenuButton asChild>
                                                                {
                                                                    EditingId == item.id ? (
                                                                        <input
                                                                            type="text"
                                                                            value={newName}
                                                                            onChange={(e) => setNewName(e.target.value)}
                                                                            className="bg-transparent mx-2 dark:text-white border-b-2 border-gray-500 focus:outline-none"
                                                                        />
                                                                    ) : (
                                                                        <div onClick={() => HandleClick(item.id)} className="curseur-pointer">
                                                                            <MessageCircle />
                                                                            <span className="max-w-40">{item.name}</span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </SidebarMenuButton>
                                                            <div className={`${!open && "hidden"}`}>
                                                                {
                                                                    EditingId == item.id ? (
                                                                        <div className="flex gap-1 items-center justify-center">
                                                                            <Button role="Cancel Editting" align={"left"} onClick={() => {
                                                                                setIsEditing("")
                                                                            }}>
                                                                                <div className="flex items-center gap-1 text-xs cursor-pointer text-white hover:bg-gray-300  dark:hover:bg-gray-700 px-2 py-1 rounded transition-all"
                                                                                >
                                                                                    <DropletOff className="size-4 text-black dark:text-white" />
                                                                                </div>
                                                                            </Button>
                                                                            {
                                                                                UpdatingName ? (
                                                                                    <div className="flex items-center justify-center overflow-hidden size-7 rounded-full">
                                                                                        <Image
                                                                                            src="/loading2.gif"
                                                                                            alt="Loading..."
                                                                                            className="h-[80px] w-[80px] scale-200 text-white object-contain "
                                                                                            width={200}
                                                                                            height={200}
                                                                                        />
                                                                                    </div>
                                                                                ) : (
                                                                                    <Button role="Save Name" align={"left"} onClick={() => {
                                                                                        handleUpdateChatName(item.id, newName)
                                                                                    }}>
                                                                                        <div className="flex items-center gap-1 text-xs cursor-pointer  hover:bg-gray-300 dark:hover:bg-gray-700 px-2 py-1 rounded transition-all"
                                                                                        >
                                                                                            <Save className="size-4 dark:text-white" />
                                                                                        </div>
                                                                                    </Button>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <Button role="Edit Name" align={"left"} onClick={() => {
                                                                            setIsEditing(item.id)
                                                                            setNewName(item.name)
                                                                        }}>
                                                                            <div className="flex items-center gap-1 text-xs cursor-pointer dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 px-2 py-1 rounded transition-all"
                                                                            >
                                                                                <span className="relative">
                                                                                    <Pencil className="size-4 " />
                                                                                    <Cross
                                                                                        size={4}
                                                                                        className=" absolute top-0 -left-0.5 size-2 dark:bg-gray-700  rounded-full"
                                                                                    />
                                                                                </span>
                                                                            </div>
                                                                        </Button>
                                                                    )
                                                                }
                                                            </div>
                                                        </SidebarMenuItem>
                                                    </CommandItem>
                                                </div>
                                            ))}
                                        </CommandGroup>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CommandList>
                        </SidebarGroup>
                    </SidebarContent>
                </Command>
            </Sidebar >
        </div>
    )
}
export default React.memo(AppSidebar)