/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import debounce from "lodash.debounce";
import Time from "@/components/Multipurpose/formattedTime/Index";
import LogoIcon from "@/components/Icons/logoIcon";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";         // ✅ NEW
import { Loader2 } from "lucide-react";                     // ✅ NEW
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  User2,
} from "lucide-react";

import { SideBarMenuitems } from "@/lib/utils";
import { UserType, groupType } from "@/lib/utils";
import { useSelector } from "react-redux";
import { themeStatetype } from "@/state/Global";
import {
  useCreateGroupMutation,
  useInviteRequestMutation,
  useSearchGroupsMutation,
} from "@/state/Api/group/api";
import { toast } from "sonner";

type typeMember = {
  member: UserType;
};

/* ----------------------------------------------------------------- */
/*                          MAIN  SIDEBAR                            */
/* ----------------------------------------------------------------- */
const Sidebar = ({
  GroupData,
  isOpen,
  setIsOpen,
  groupMembers,
  isMenuOpen,
}: {
  GroupData: groupType[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen?: boolean;
  groupMembers: typeMember[];
}) => {
  const userData = useSelector(
    (state: { global: themeStatetype }) => state.global.user
  );

  /* If parent hasn’t delivered data yet, show skeletons */
  const groupsLoading = !GroupData;
  const membersLoading = !groupMembers;

  return (
    <div className="relative flex">
      {/* ============== MENU SIDEBAR ============== */}
      <div
        className={`${isMenuOpen ? "w-[60px] " : "lg:w-[60px] lg:scale-100 w-0 scale-0"
          } absolute lg:relative transition-all duration-500 flex z-50 bg-white dark:bg-neutral-900 flex-col items-center justify-between h-full`}
      >
        <LogoIcon />

        <div className="flex flex-col gap-2">
          {SideBarMenuitems.map((item, index) => (
            <MenuComponent key={index} item={item} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 mb-3">
          <Image
            width={500}
            height={500}
            src={"/meeting4.jpg"}
            className="w-[40px] h-[40px] object-cover rounded-full"
            alt="Profile Image"
          />
        </div>
      </div>

      {/* ============== GROUP SIDEBAR ============== */}
      <div
        className={`${isOpen ? "w-[300px]" : "px-0 w-0 lg:w-[67px]"} ${isMenuOpen ? "left-[60px] w-[67px] border-l-2" : ""
          } sm:border-l-2 rounded-xl border-gray-300 transition-all flex flex-col overflow-hidden lg:left-0 lg:relative absolute duration-500 h-[100vh] max-h-[100vh] pb-3 bg-white dark:bg-neutral-900 z-40`}
      >
        {/* ------- HEADER -------- */}
        <div className="flex bg-white dark:bg-neutral-900 z-50 mx-3 border-b-2 border-gray-300 py-3 justify-between items-center">
          <div className="flex gap-4 items-center">
            <button
              className="p-2 bg-gray-300 rounded-lg cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <strong className="text-2xl font-semibold">Chat</strong>
          </div>
          <CreateAndJoinGroupComponent userId={userData.id} />
        </div>

        {/* ------- USER PROFILE ------- */}
        <div className="relative w-full">
          <div className="w-full flex flex-col items-center gap-2 p-2 ">
            <Image
              width={500}
              height={500}
              src={"/meeting4.jpg"}
              className={`${isOpen ? "w-[150px] h-[150px]" : "w-[60px] h-[60px]"
                } transition-all duration-500 object-cover rounded-full`}
              alt="Profile Image"
            />
          </div>
          <div
            className={`${isOpen ? "scale-100" : "scale-0 h-0 w-0"
              } transition-all overflow-hidden duration-500 flex flex-col items-center mb-5`}
          >
            <h2 className="text-xl font-semibold">{userData.username}</h2>
            <p className="text-gray-500 bg-[#fee4ff] rounded px-1 text-sm">
              {userData.email}
            </p>
          </div>
        </div>

        {/* ------- GROUPS & MEMBERS ------- */}
        <Command className="h-full">
          {/* --- Horizontal member avatars row --- */}
          <div className="w-[300px] overflow-x-auto h-fit flex gap-3 p-2">
            {isOpen &&
              (membersLoading ? (
                /* Skeleton row for members */
                <div className="flex gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-[40px] h-[40px] rounded-full shrink-0"
                    />
                  ))}
                </div>
              ) : groupMembers?.length ? (
                groupMembers.map((member, index) => (
                  <div key={index} className="h-fit w-fit">
                    <div className="w-[50px] flex-col items-center">
                      {member.member.profileImageUrl ? (
                        <Image
                          width={100}
                          height={100}
                          src={member.member.profileImageUrl}
                          className="w-[40px] h-[40px] object-cover rounded-full"
                          alt={member.member.username}
                        />
                      ) : (
                        <User2 className="w-[40px] h-[40px] rounded-full" />
                      )}
                      <div className="w-full flex justify-center">
                        <span className="font-medium text-[0.6rem] line-clamp-1 w-[40px]">
                          {member.member.username}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : null)}
          </div>

          {/* Search input only when sidebar open */}
          {isOpen && (
            <div className="mx-2 mt-2">
              <CommandInput
                placeholder="Search "
                className="font-semibold placeholder:text-gray-500"
              />
            </div>
          )}

          {/* --- Groups list --- */}
          <CommandList className="overflow-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              className="h-1/3 overflow-auto"
              heading={`${isOpen ? "Groups" : ""}`}
            >
              {groupsLoading ? (
                /* Skeleton list for groups */
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="my-1 mx-3 h-[48px] rounded-md"
                    />
                  ))}
                </>
              ) : (
                GroupData?.map((group) => (
                  <CommandItem key={group.id} className="p-0">
                    <GruopComponent group={group} />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};
export default Sidebar;

/* ----------------------------------------------------------------- */
/*                          GROUP CARD                               */
/* ----------------------------------------------------------------- */
const GruopComponent = ({ group }: { group: groupType }) => (
  <div className="flex w-full overflow-hidden dark:hover:bg-accent hover:bg-gray-200 rounded-md">
    <div className="flex w-fit items-center gap-3 mx-3 py-1 cursor-pointer">
      <div className="w-[60px] h-[50px] flex items-center">
        <Image
          width={500}
          height={500}
          src={"/image2.jpg"}
          className="rounded-full w-[35px] h-[35px]"
          alt={group.name || "Profile Image"}
        />
      </div>
      <Link href={`/groups/${group.id}`} className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[1.09rem] line-clamp-1">
            {group.name}
          </h2>
          <Time commentDate={new Date()} />
        </div>
        <p className="text-gray-400 text-sm -translate-y-1 line-clamp-1">
          {group.description}
        </p>
      </Link>
    </div>
  </div>
);

/* ----------------------------------------------------------------- */
/*                          MENU ICON                                */
/* ----------------------------------------------------------------- */
const MenuComponent = ({
  item,
}: {
  item: { icon: React.ElementType; title: string; url: string };
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative flex items-center"
    >
      <Link
        href={item.url}
        className="flex dark:hover:bg-[#f0a3f1] hover:bg-[#fee4ff] items-center justify-center p-2 rounded-lg"
      >
        <item.icon className="size-6 text-gray-500 dark:text-gray-200" />
      </Link>
      {showTooltip && (
        <div className="absolute left-[120%] bg-accent p-2 rounded-2xl">
          {item.title}
        </div>
      )}
    </div>
  );
};

/* ----------------------------------------------------------------- */
/*            CREATE-AND-JOIN GROUP  (with loading states)            */
/* ----------------------------------------------------------------- */
const CreateAndJoinGroupComponent = ({ userId }: { userId: string }) => {
  /* ---------------- hooks & state ---------------- */
  const [groupname, setGroupname] = useState("");
  const [groups, setGroups] = useState<groupType[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);     // ✅ NEW
  const [createLoading, setCreateLoading] = useState(false);     // ✅ NEW
  const [sendLoadingId, setSendLoadingId] = useState<string | null>(null); // ✅ NEW

  const [searchGroups] = useSearchGroupsMutation();
  const [inviteRequest] = useInviteRequestMutation();
  const [createGroup] = useCreateGroupMutation();

  /* ---------------- search (debounced) ---------------- */
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchLoading(true);
        searchGroups({ groupName: value })
          .unwrap()
          .then((data) => setGroups(data.data.searchGroups))
          .catch(console.error)
          .finally(() => setSearchLoading(false));
      }, 500),
    [searchGroups]
  );

  useEffect(() => {
    if (groupname) debouncedSearch(groupname);
    else setGroups([]);

    return () => debouncedSearch.cancel();
  }, [groupname, debouncedSearch]);

  /* ---------------- handlers ---------------- */
  const handleSendRequest = (groupId: string) => {
    setSendLoadingId(groupId);
    inviteRequest({ groupId, userId })
      .unwrap()
      .then((data) => {
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("Request sent sucessfully")
        }
      })
      .catch(console.error)
      .finally(() => setSendLoadingId(null));
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupname.trim()) return;

    setCreateLoading(true);
    createGroup({ name: groupname.trim(), leader: userId })
      .unwrap()
      .then((data) => {
        setGroupname("")
        if (data.errors) {
          toast.error(data?.errors[0].message || "there is some error")
        }
        else {
          toast.success("Group created sucessfully")
        }
      })
      .catch(console.error)
      .finally(() => setCreateLoading(false));
  };

  /* ---------------- UI ---------------- */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <MoreVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        {/* ---------- CREATE GROUP ---------- */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Create Group</DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            sideOffset={4}
            className="w-48 md:w-64 p-4 rounded-xl bg-white dark:bg-neutral-900"
          >
            <form className="flex flex-col gap-3" onSubmit={handleCreateGroup}>
              <label className="text-sm font-medium text-muted-foreground">
                Group Name
              </label>
              <Input
                placeholder="Enter group name"
                required
                value={groupname}
                onChange={(e) => setGroupname(e.target.value)}
              />
              <button
                type="submit"
                disabled={createLoading}
                className="px-5 py-1 my-2 mx-auto w-fit rounded-md font-medium bg-accent-foreground text-accent transition disabled:opacity-50"
              >
                {createLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </form>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* ---------- SEND REQUEST ---------- */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Send Request</DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            sideOffset={4}
            className="p-4 w-86 min-h shadow-xl bg-white dark:bg-neutral-900 rounded-xl"
          >
            {/* Search input */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-200"
              />
              <input
                type="search"
                value={groupname}
                onChange={(e) => setGroupname(e.target.value)}
                placeholder="Enter group name"
                className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-900 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Group search results */}
            <div className="flex flex-col gap-2 py-4">
              {searchLoading ? (
                /* --- Skeleton during search --- */
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 flex items-center gap-3 rounded-lg bg-white dark:bg-neutral-900 border"
                    >
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-4 w-[60%]" />
                        <Skeleton className="h-3 w-[40%]" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                groups?.map((group) => (
                  <div
                    key={group.id}
                    className="p-2 flex items-center justify-between rounded-lg bg-white dark:bg-neutral-900 shadow-sm border border-border"
                  >
                    {/* Avatar & name */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={"/meeting4.jpg"}
                        height={40}
                        width={40}
                        alt="Group"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-0.5">
                        <h2 className="font-semibold text-sm line-clamp-1">
                          {group.name}
                        </h2>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {group.description || "No description"}
                        </span>
                      </div>
                    </div>

                    {/* Send button */}
                    <button
                      onClick={() => handleSendRequest(group.id)}
                      disabled={sendLoadingId === group.id}
                      className="px-3 py-1 text-sm rounded-md font-medium bg-accent-foreground text-accent transition disabled:opacity-50"
                    >
                      {sendLoadingId === group.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send"
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
