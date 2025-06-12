'use client'
import { useState } from "react";
import { useParams } from "next/navigation";
import ChatInput from "@/components/Groups/ChatBoxInput/Index";
import ChatNavbar from "@/components/Groups/Navbar";
import ChatBox from "@/components/Groups/chatBox";
import { useSelector } from "react-redux";
import { themeStatetype } from "@/state/Global";
import { TypingUserSubscription } from "@/state/wsApi";
import Sidebar from "@/components/Groups/Sidebar";
import FileSidebar from "@/components/Groups/fileSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetGroupByIdQuery, useGetGroupsQuery } from "@/state/Api/group/api";
const GroupDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetGroupByIdQuery(id)
  const GroupInfo = data?.data.getGroup

  const userData = useSelector((state: { global: themeStatetype }) => state.global.user)

  const { data: groupsData } = useGetGroupsQuery({});
  const groups = groupsData?.data?.listGroups;

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const isMobile = !useIsMobile()
  const openChat = () => {
    if (isMobile && isFileOpen && !isChatOpen) {
      setIsFileOpen(false)
      setTimeout(() => {
        setIsChatOpen(true);
      }, 500);
    }
    else {
      setIsChatOpen(!isChatOpen)
    }
  }
  const openFile = () => {
    if (isMobile && isChatOpen && !isFileOpen) {
      setIsChatOpen(false)
      setTimeout(() => {
        setIsFileOpen(true);
      }, 500);
    }
    else {
      setIsFileOpen(!isFileOpen)
    }
  }
  const handleTypingUser = (typingUser: string[]) => {
    setTypingUsers(typingUser);
  }
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  if (id === "_auto") {
    return (
      <div className="h-full w-screen flex absolute top-0  overflow-hidden bg-white dark:bg-black">
        <div className="h-full flex w-fit">
          <Sidebar groupMembers={[]} isMenuOpen={true} GroupData={groups} isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </div>
        <div className="bg-[url('/chatbackground.jpg')] invert dark:invert-0 bg-center w-full p-2">

        </div>
      </div>
    )
  }
  return (
    <div className="h-full w-screen flex absolute top-0  bg-white dark:bg-neutral-900">
      <div className="h-full flex w-fill">
        <Sidebar groupMembers={GroupInfo?.members || {}} isMenuOpen={isMenuOpen} GroupData={groups} isOpen={isChatOpen} setIsOpen={openChat} />
      </div>
      <div className="w-full py-2 ml-1 bg-white dark:bg-neutral-900">
        <div className="flex flex-col relative h-full border rounded-lg shadow-md ">
          < TypingUserSubscription groupId={String(id)} onTypingUser={handleTypingUser} />
          {/* top bar */}
          <ChatNavbar refetch={refetch} typingUsers={typingUsers} openChat={openChat} openFile={openFile} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isChatOpen={isChatOpen} isFileOpen={isFileOpen} GroupInfo={GroupInfo} />
          {/* Group Content */}
          <ChatBox refetch={refetch} groupId={String(id)} />
          {/* input box */}
          <div className=" w-full flex items-center justify-center mb-2">
            <ChatInput groupId={GroupInfo?.id} senderId={userData.id} />
          </div>
        </div>
      </div>
      <div className="h-full flex w-fit">
        <FileSidebar isOpen={isFileOpen} setIsOpen={openFile} />
      </div>
    </div>
  );
};

export default GroupDetail;
