import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { extensionMap, groupType } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { format, parseISO } from 'date-fns';
import { IGroupMember } from '@/lib/utils';
import { Cross, DownloadIcon, FileArchiveIcon, FilesIcon, FileVideo, GitPullRequest, Group, Info, Link2, Loader2, Pencil, Search, User2Icon, UserPlus, VideoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AttachmentType } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { UserType } from '@/lib/utils';
import debounce from 'lodash.debounce';
import Time from '@/components/Multipurpose/formattedTime/Index';
import { useAcceptInviteRequestMutation, useAddMemberMutation, useDemoteAdminMutation, useGetAttachmentsQuery, usePromoteAdminMutation, useRejectInviteRequestMutation, useRemoveMemberMutation } from '@/state/Api/group/api';
import { useSearchUserMutation } from '@/state/Api/user/api';
import { useSelector } from 'react-redux';
import { themeStatetype } from '@/state/Global';
import { toast } from 'sonner';
interface LinkMeta {
  title: string;
  description?: string;
  image?: {
    url?: string | null
  };
  url: string;
}

interface LinkPreviewProps {
  link: string;
}
type fileInput = {
  fileUrl: string,
  fileName: string,
  fileType?: string,
}
type IInviteRequest = {
  user: UserType;
  status: "pending" | "accepted" | "rejected";
  invitedAt: Date;
}
const handleDownload = async ({ fileUrl, fileName, fileType }: fileInput) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();

  const mimeType = fileType || blob.type;
  const extension = extensionMap[mimeType as keyof typeof extensionMap] || extensionMap["default"];

  const downloadUrl = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${fileName || "document"}${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
const ChatNavbar = ({ typingUsers, GroupInfo, isMenuOpen, isFileOpen, isChatOpen, refetch, setIsMenuOpen, openChat, openFile }: {
  GroupInfo: groupType
  isMenuOpen: boolean
  isChatOpen: boolean
  isFileOpen: boolean
  typingUsers: Array<string>
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  openChat: () => void;
  openFile: () => void;
  refetch: () => void;
}) => {
  const {
    data: Response
  } = useGetAttachmentsQuery({ groupId: GroupInfo.id })
  const Attachments = Response?.data?.getAttachments
  const userData = useSelector((state: { global: themeStatetype }) => state.global.user)
  const mediaAttachments = Attachments?.filter((att) => att.fileType.startsWith("video") || att.fileType.startsWith("image"))
  const filesAttachments = Attachments?.filter((att) => !att.fileType.startsWith("audio") && !att.fileType.startsWith("video") && !att.fileType.startsWith("image"))
  const isAdmin = GroupInfo?.admins?.find((item) => item.admin.id === userData.id)
  const isLeader = GroupInfo.leader.id === userData.id
  const userStatus = isAdmin ? "admin" : isLeader ? "leader" : "member";
  return (
    <nav className=" sticky bg-accent rounded-t-lg h-20 max-h-[10%] top-0 justify-between flex items-center px-2 md:px-4 py-2">
      {/* group details */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-1 sm:gap-3 justify-between">
            <Image src={'/image2.jpg'} alt="profile image" width={50} height={50} className="size-12 rounded-full" />
            <div className="leading-4 dark:text-white">
              <h1 className='text-sm md:text-lg'>{GroupInfo?.name}</h1>
              <div className="flex text-pink-400 text-[0.7rem]">
                <span>{GroupInfo.members.length} members</span>
                {
                  typingUsers?.length > 0 && <span> . {typingUsers?.length} typing</span>
                }
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=' h-full overflow-hidden w-88 md:w-114'>
          <Tabs defaultValue="overview" >
            <TabsList className='overflow-auto '>
              <TabsTrigger value="overview"><Info></Info><span>Overview</span></TabsTrigger>
              <TabsTrigger value="members"><Group></Group><span>Members</span></TabsTrigger>
              <TabsTrigger value="media"><VideoIcon></VideoIcon> <span>Media</span></TabsTrigger>
              <TabsTrigger value="files"><FilesIcon></FilesIcon><span>Files</span></TabsTrigger>
              <TabsTrigger value="links"><Link2></Link2> <span>Links</span></TabsTrigger>
              <TabsTrigger value="invite"><UserPlus /> <span>Invite</span></TabsTrigger>
              <TabsTrigger value="requests"><GitPullRequest /> <span>Requests</span></TabsTrigger>
            </TabsList>
            <div className='max-h-150 h-fit bg-accent rounded min-h-100 w-full overflow-x-hidden overflow-y-auto'>
              <OverviewComponent groupName={GroupInfo.name} profilePicture={GroupInfo.profilePicture} description={GroupInfo.description} createdAt={GroupInfo.createdAt} />
              <MembersComponent groupId={GroupInfo.id} userStatus={userStatus} members={GroupInfo.members} />
              <MediaComponent mediaAttachments={mediaAttachments} />
              <FileComponent filesAttachments={filesAttachments} />
              <LinkComponent links={GroupInfo.links} />
              <InviteComponent groupId={GroupInfo.id} />
              <RequestComponent refetch={refetch} Requests={GroupInfo.inviteRequests} groupId={GroupInfo.id} />
            </div>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Sidebar Buttons */}
      <div className="flex gap-1  h-full justify-center items-center">

        {/* Open Chats */}
        <button
          onClick={openChat}
          className={`${isChatOpen ? "bg-pink-200" : ""} sm:flex hidden cursor-pointer text-pink-500 font-semibold py-1 px-1 md:px-3 rounded-lg`}>
          Chats
        </button>

        {/* Open file Details */}
        <button
          onClick={openFile}
          className={`${isFileOpen ? "bg-pink-200" : " "} cursor-pointer text-pink-500 font-semibold py-1 px-1 md:px-3 rounded-lg`}>
          Files
        </button>

        {/* Open Menu */}
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen)
          }}
          className={`${isMenuOpen ? "bg-pink-200" : " "} lg:hidden cursor-pointer text-pink-500 font-semibold py-1 px-1 md:px-3 rounded-lg`}>
          Menu
        </button>
      </div>
    </nav>
  )
}

export default ChatNavbar

const OverviewComponent = ({ groupName, profilePicture, description, createdAt }: {
  groupName: string
  profilePicture: string | undefined
  description: string | undefined
  createdAt: Date
}) => {
  const formatted = format(parseISO(createdAt.toString()), "dd/MM/yyyy");
  return (
    <TabsContent value="overview" className='px-2 h-full'>
      <DropdownMenuLabel className='sm:w-68 w-48 sticky top-0 bg-accent'>Overview</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className='w-full'>

        {/* Profile Photo */}
        <div className='w-full py-3 flex justify-center'>
          <div className='w-fit relative'>
            {
              profilePicture ?
                <Image src={"/meeting4.jpg"} height={500} width={500} alt='ProfileImage' className='size-28 shadow-accent-foreground shadow rounded-full ' />
                :
                <User2Icon className='size-28 border-2 border-black rounded-full ' />
            }

            {/* Edit Profile Image */}
            <div className='absolute -bottom-6 left-2 mt-4 w-full flex justify-end'>
              <span className="relative p-2 cursor-pointer rounded-full hover:bg-accent">
                <Pencil className="size-4 " />
                <Cross
                  size={4}
                  className=" absolute top-2 left-1.5 size-2 dark:bg-gray-700  rounded-full"
                />
              </span>
            </div>
          </div>
        </div>

        {/* group Info */}
        <div className='max-w-full w-fit my-4 flex flex-col gap-2'>
          <h2 className='text-xl font-semibold text-center'>{groupName || "Group"}</h2>
          <div className='mt-2'>
            <span className='font-light dark:text-gray-200 text-gray-700 text-sm'>Description</span>
            <p className='line-clamp-3 text-sm font-semibold '>{description || "Describe group"}</p>
          </div>
          <div className='mt-2'>
            <span className='font-light dark:text-gray-200 text-gray-700 text-sm'>CreatedAt</span>
            <p className='line-clamp-3 text-sm font-semibold '>{formatted || "Describe group"}</p>
          </div>
        </div>
      </div>

      <DropdownMenuSeparator />

      {/* Buttons */}
      <div className='w-full flex items-center justify-center gap-2 py-2'>
        <button className='bg-rose-200 text-sm text-red-600 md:px-4 p-2 rounded-lg cursor-pointer'>
          Report Group
        </button>
        <button className='bg-gray-200 text-sm text-gray-600 md:px-4 p-2 rounded-lg cursor-pointer'>
          Leave Group
        </button>
      </div>

    </TabsContent>
  )
}

const MembersComponent = ({
  members,
  userStatus,
  groupId,
}: {
  members: IGroupMember[];
  userStatus: "admin" | "leader" | "member";
  groupId: string;
}) => {
  const [promoteAdmin] = usePromoteAdminMutation();
  const [demoteAdmin] = useDemoteAdminMutation();
  const [removeMember] = useRemoveMemberMutation();

  const handlePromoteAdmin = ({ userId }: { userId: string }) => {
    if (userStatus === "member") {
      return console.log("Only Leader and Admin can promote.");
    }
    const promotingtoast = toast.loading("Promoting to admin...");
    promoteAdmin({ groupId, userId })
      .unwrap()
      .then((data) => {
        console.log(data)
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("Promoted to  sucessfully")
        }
      })
      .catch(console.error)
      .finally(()=>{
         toast.dismiss(promotingtoast)
      })
  };

  const handleDemoteAdmin = ({ userId }: { userId: string }) => {
    if (userStatus !== "leader") {
      return console.log("Only Leader can demote Admin.");
    }
    const demotingAdmin = toast.loading("Demoting.... ")
    demoteAdmin({ groupId, userId })
      .unwrap()
      .then((data) => {
        console.log(data)
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("Admin Demoted sucessfully")
        }
      })
      .catch(console.error)
      .finally(()=>{
         toast.dismiss(demotingAdmin)
      });
  };

  const handleRemoveMember = ({
    userId,
    status,
  }: {
    userId: string;
    status: "leader" | "admin" | "member";
  }) => {
    if (status === "admin" && userStatus !== "leader") {
      return console.log("Only Leader can remove Admin.");
    }
    removeMember({ groupId, userId })
      .unwrap()
      .then((data) => {
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("Member removed sucessfully")
        }
      })
      .catch(console.error);
  };

  return (
    <TabsContent value="members" className="px-2 h-full">
      <DropdownMenuLabel className="sticky top-0 bg-accent">Members</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="flex flex-col gap-1 py-4">
        {members?.length ? (
          members.map((member, index) => {
            const canShowContextMenu =
              member.status !== "leader" && userStatus !== "member";

            const showDemote = member.status === "admin";
            const showPromote = member.status === "member";

            return (
              <div key={index}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="p-2 flex items-center gap-3 rounded-lg w-full bg-white dark:bg-black">
                      <div className="w-fit">
                        <Image
                          src={"/meeting4.jpg"} // Placeholder image
                          height={40}
                          width={40}
                          alt="ProfileImage"
                          className="w-10 h-10 rounded-full shadow shadow-accent-foreground"
                        />
                      </div>

                      <div className="flex-grow p-1 flex flex-col gap-1 overflow-hidden">
                        <h2 className="font-semibold text-sm line-clamp-1">
                          {member.member.username}
                        </h2>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {member.member.description || "No description"}
                        </span>
                      </div>

                      {(member.status === "admin" || member.status === "leader") && (
                        <Badge className="bg-green-500">{member.status}</Badge>
                      )}
                    </div>
                  </ContextMenuTrigger>

                  {canShowContextMenu && (
                    <ContextMenuContent>
                      {showDemote && (
                        <ContextMenuItem>
                          <button onClick={() => handleDemoteAdmin({ userId: member.member.id })}>
                            Demote Admin
                          </button>
                        </ContextMenuItem>
                      )}
                      {showPromote && (
                        <ContextMenuItem >
                          <button onClick={() => handlePromoteAdmin({ userId: member.member.id })}>
                            Promote Admin
                          </button>
                        </ContextMenuItem>
                      )}
                      <ContextMenuItem >
                        <button
                          onClick={() =>
                            handleRemoveMember({
                              userId: member.member.id,
                              status: member.status,
                            })
                          }
                        >
                          Remove Member
                        </button>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  )}
                </ContextMenu>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center">No members found.</p>
        )}
      </div>
    </TabsContent>
  );
};
const MediaComponent = ({ mediaAttachments }: {
  mediaAttachments: AttachmentType[] | undefined
}) => {
  return (
    <TabsContent value="media" className='px-2 h-full'>
      <DropdownMenuLabel className='sticky top-0 bg-accent'>Media</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className='flex flex-col gap-1 py-4'>
        {
          mediaAttachments?.length && mediaAttachments.map((attachment, index) => {
            return (
              <div key={index} className='p-2 flex items-center rounded-lg w-full bg-white dark:bg-black'>
                <div className='w-fit mr-2'>
                  {
                    attachment.fileUrl ?
                      <img src={attachment.fileUrl} height={500} width={500} alt='ProfileImage' className='min-w-10 w-10 h-10 shadow-accent-foreground shadow rounded-lg ' />
                      :
                      <FileVideo className='min-size-10 border-2 border-black rounded-full ' />
                  }
                </div>
                <div className='overflow-hidden w-50 max-w-full flex items-center'>
                  <h2 className='font-semibold line-clamp-1'>{attachment.fileName}</h2>
                </div>
                <div className='w-12 border-l border-accent-foreground flex items-center justify-end'>
                  <button
                    onClick={() => handleDownload({ fileUrl: attachment.fileUrl, fileName: attachment.fileName, fileType: attachment.fileType })}
                    className='p-2 rounded-full hover:bg-accent'>
                    <DownloadIcon className='cursor-pointer' />
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>
    </TabsContent>
  )
}

const FileComponent = ({ filesAttachments }: {
  filesAttachments: AttachmentType[] | undefined
}) => {
  console.log(filesAttachments)
  return (
    <TabsContent value="files" className='px-2 h-full'>
      <DropdownMenuLabel className='sticky top-0 bg-accent'>Files</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className='flex flex-col gap-1 py-4'>
        {
          filesAttachments?.length && filesAttachments.map((attachment, index) => {
            return (
              <div key={index} className='p-2 flex items-center rounded-lg w-full bg-white dark:bg-black'>
                <div className='w-fit mr-2 p-2 rounded-lg bg-purple-200'>
                  <FileArchiveIcon className='min-size-10 text-purple-600 ' />
                </div>
                <div className='overflow-hidden w-50 max-w-full flex items-center'>
                  <h2 className='font-semibold line-clamp-1'>{attachment.fileName}</h2>
                </div>
                <div className='w-12 border-l border-accent-foreground flex items-center justify-end'>
                  <button
                    onClick={() => handleDownload({ fileUrl: attachment.fileUrl, fileName: attachment.fileName, fileType: attachment.fileType })}
                    className='p-2 rounded-full hover:bg-accent'>
                    <DownloadIcon className='cursor-pointer' />
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>
    </TabsContent>
  )
}

const LinkPreview = ({ link }: LinkPreviewProps) => {
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPreview = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://api.microlink.io?url=${link}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json());
        if (isMounted) {
          setMeta({
            title: data.data.title || link,
            description: data.data.description || "",
            image: data.data.image || null,
            url: data.data.url || link,
          });
        }
      } catch (err) {
        console.log(err)
        if (isMounted) {
          setError("Could not load preview");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPreview();

    return () => {
      isMounted = false;
    };
  }, [link]);
  if (loading) {
    return (
      <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse max-w-md">
        {/* Image skeleton */}
        <Skeleton className="h-24 w-24 rounded-xl bg-gray-200" />
        {/* Text skeletons */}
        <div className="flex flex-col flex-1 justify-between space-y-2">
          <Skeleton className="h-6 w-3/4 rounded bg-gray-200" />
          <Skeleton className="h-4 w-full rounded bg-gray-200" />
          <Skeleton className="h-4 w-5/6 rounded bg-gray-200" />
          <Skeleton className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 max-w-md">
        <p className="text-sm">Failed to load preview for:</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline line-clamp-1"
        >
          {link}
        </a>
      </div>
    );
  }
  return (
    <a
      href={meta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex max-w-md gap-2 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black p-2 shadow-md transition hover:shadow-lg"
    >
      {meta.image?.url ? (
        <img
          src={meta.image.url}
          alt={meta.title}
          className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="h-24 w-24 flex-shrink-0 rounded-xl dark:bg-neutral-800 bg-gray-100" />
      )}
      <div className="flex flex-col justify-between py-1 w-44">
        <h2 className="text-lg font-semibold dark:text-gray-100 text-gray-800 line-clamp-1 leading-6">
          {meta.title}
        </h2>
        {meta.description && (
          <p className="mt-1 text-sm dark:text-gray-300 text-gray-600 line-clamp-2 leading-3.5">
            {meta.description}
          </p>
        )}
        <p className="mt-2 text-xs text-blue-600 line-clamp-1 leading-3">{meta.url}</p>
      </div>
    </a>
  );
};
const LinkComponent = ({ links }: {
  links: LinkPreviewProps[] | undefined
}) => {
  return (
    <TabsContent value="links" className='px-2 h-full'>
      <DropdownMenuLabel className='sticky top-0 bg-accent'>Media</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className='flex flex-col gap-1 py-4'>
        {
          links?.length && links.map((link, index) => {
            return (
              <LinkPreview key={index} link={link.link} />
            )
          })
        }
      </div>
    </TabsContent>
  )
}


const InviteComponent = ({ groupId }: { groupId: string }) => {
  const [username, setUsername] = useState<string>("");
  const [Users, setUsers] = useState<Array<UserType>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addLoadingId, setAddLoadingId] = useState<string | null>(null);

  const [addMember] = useAddMemberMutation();
  const [searchUsers] = useSearchUserMutation();

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchLoading(true);
        searchUsers({ username: value })
          .unwrap()
          .then((data) => {
            setUsers(data.data.searchUser);
          })
          .catch((error) => {
            console.error(error);
            setUsers([]);
          })
          .finally(() => setSearchLoading(false));
      }, 500),
    [searchUsers]
  );

  useEffect(() => {
    if (username) {
      debouncedSearch(username);
    } else {
      setUsers([]);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [username, debouncedSearch]);

  const handleAddMember = (userId: string) => {
    setAddLoadingId(userId);
    addMember({ groupId, userId })
      .unwrap()
      .then((data) => {
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("User added sucessfully")
        }
      })
      .catch((err) => {
        console.log(err);

      })
      .finally(() => setAddLoadingId(null));
  };

  return (
    <TabsContent value="invite" className="px-2 h-full">
      <DropdownMenuLabel className="sticky top-0 bg-accent">Invite</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className="relative">
        <Search size={20} className="absolute left-2 top-1/2 text-gray-400 dark:text-gray-500 -translate-y-1/2" />
        <input
          type="search"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full pl-8 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-neutral-900 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="flex flex-col gap-2 py-4">
        {searchLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2 rounded-lg bg-white dark:bg-neutral-900 border border-border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-3 w-[40%]" />
              </div>
            </div>
          ))
        ) : Users.length > 0 ? (
          Users.map((user) => (
            <div
              key={user.id}
              className="p-2 flex items-center justify-between rounded-lg w-full bg-white dark:bg-neutral-900 shadow-sm border border-border"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={"/meeting4.jpg"}
                  height={40}
                  width={40}
                  alt="ProfileImage"
                  className="w-10 h-10 rounded-full shadow object-cover"
                />
                <div className="overflow-hidden w-50 max-w-full flex flex-col gap-0.5 justify-between leading-4">
                  <h2 className="font-semibold text-sm line-clamp-1">{user.username}</h2>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {user.email || "No email"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddMember(user.id)}
                disabled={addLoadingId === user.id}
                className="px-2 py-1 text-sm rounded-md font-medium bg-accent-foreground text-accent hover:scale-105 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {
                  addLoadingId === user.id ? (
                    <div className=' flex items-center gap-1'>
                      <Loader2 className='animate-spin size-4 ' />
                      <span className='text-xs'>Adding</span>
                    </div>
                  ) : (
                    <span className='text-xs'>Add</span>
                  )
                }

              </button>
            </div>
          ))
        ) : username.length > 0 ? (
          <p className="text-center text-sm text-muted-foreground mt-4">No users found.</p>
        ) : null}
      </div>
    </TabsContent>
  );
};


const RequestComponent = ({
  Requests,
  groupId,
  refetch,
}: {
  Requests: IInviteRequest[];
  groupId: string;
  refetch: () => void;
}) => {
  const [acceptRequest] = useAcceptInviteRequestMutation();
  const [rejectRequest] = useRejectInviteRequestMutation();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAcceptRequest = async (userId: string) => {
    setLoadingId(userId + "-accept");
    acceptRequest({ groupId, userId })
      .unwrap()
      .then((data) => {
        refetch();
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("User added sucessfully")
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoadingId(null));
  };

  const handleRejectRequest = async (userId: string) => {
    setLoadingId(userId + "-reject");
    rejectRequest({ groupId, userId })
      .unwrap()
      .then((data) => {
        refetch();
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("Request Rejected sucessfully")
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoadingId(null));
  };

  return (
    <TabsContent value="requests" className="px-2 h-full">
      <DropdownMenuLabel className="sticky top-0 bg-accent">
        Join Requests
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className="flex flex-col gap-2 py-4">
        {Requests?.length > 0 ? (
          Requests.map((req, index) => (
            <div
              key={index}
              className="p-2 flex items-center justify-between rounded-lg w-full bg-white dark:bg-neutral-900 shadow-sm border border-border"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={"/meeting4.jpg"}
                  height={40}
                  width={40}
                  alt="ProfileImage"
                  className="w-10 h-10 shadow rounded-full object-cover"
                />
                <div className="overflow-x-auto min-w-40 w-full flex flex-col gap-0.5 justify-between leading-4">
                  <div className="font-semibold text-sm flex items-center gap-1">
                    <p className="line-clamp-1">{req.user.username}</p>
                    <Badge className="bg-green-200 text-green-700">{req.status}</Badge>
                    <Badge className="bg-blue-200 text-blue-700">
                      <Time commentDate={req.invitedAt} />
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {req.user.email || "No email"}
                  </span>
                </div>
              </div>

              {req.status === "pending" && (
                <div className="flex flex-col gap-0.5 justify-end">
                  <button
                    onClick={() => handleRejectRequest(req.user.id)}
                    disabled={loadingId === req.user.id + "-reject"}
                    className="py-1 w-14 text-[0.7rem] rounded-md font-medium bg-destructive text-white hover:scale-105 cursor-pointer transition disabled:opacity-50"
                  >
                    {loadingId === req.user.id + "-reject" ? "..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(req.user.id)}
                    disabled={loadingId === req.user.id + "-accept"}
                    className="p-1 w-14 text-[0.7rem] rounded-md font-medium bg-accent-foreground text-accent hover:scale-105 cursor-pointer transition disabled:opacity-50"
                  >
                    {loadingId === req.user.id + "-accept" ? "..." : "Accept"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground mt-4">
            No pending requests.
          </div>
        )}
      </div>
    </TabsContent>
  );
};
