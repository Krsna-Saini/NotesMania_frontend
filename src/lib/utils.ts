import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BotIcon, Files, Group, Home, Info, Settings } from "lucide-react"
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
type homeCardProps = {
    image: string,
    title: string,
    description: string
}

export const homeCardData: Array<homeCardProps> = [
    {
        image: 'meeting1',
        title: 'The "good" kind of peer pressure',
        description: 'You know how your parents always say peer pressure is bad? Well… when it comes to studying, they’re wrong. Studying with peers helps you get better grades - and that’s scientifically proven.'
    },
    {
        image: 'meeting2',
        title: '24/7 support,all year round  ',
        description: 'Find a study buddy (or a procrastinate-mate), access exclusive boot camps, chat with tutors, or ask for community help. When you need a break, take a 5 min guided mindfulness session.'
    },
    {
        image: 'meeting3',
        title: 'Studying,reloaded with AI',
        description: 'Let’s be honest, any task is more fun when you know there’s a reward at the end of it. We’ll track your progress and gamify your study sessions – all you have to do is set session goals, start the timer and you’ll get rewarded.'
    },
    {
        image: "meeting4",
        title: "Ace your exams with smart planning",
        description: "No more last-minute cramming! Create personalized study schedules, set reminders, and break your workload into manageable chunks. Stay consistent and stress-free!"
    },
    {
        image: "meeting5",
        title: "Master tough topics with AI-powered insights",
        description: "Struggling with a tricky concept? Get instant explanations, step-by-step solutions, and personalized recommendations based on your learning style."
    },
    {
        image: "meeting6",
        title: "A study space that feels like home",
        description: "Join a welcoming community where you can discuss doubts, share notes, and stay motivated. Learning is better when you’re surrounded by supportive peers!"
    }
]
export const SideBarMenuitems = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Groups",
        url: "/groups",
        icon: Group,
    },
    {
        title: "Docs",
        url: "/docs",
        icon: Files,
    },
    {
        title:"Assistant",
        url:"/ai-assistance",
        icon: BotIcon
    },
    {
        title: "About",
        url: "/about",
        icon: Info,
    },
    {
        title: "Settings",
        url: "/setting",
        icon: Settings,
    },
]
export type IGroupMember = {
    member: UserType;
    joinedAt: Date;
    status: "leader" | "admin" | "member";
}

export type IAdmin = {
    admin: UserType;
    promotedAt: Date;
}
type message = {
    message: messageType
}

type IInviteRequest = {
    user: UserType;
    status: "pending" | "accepted" | "rejected";
    invitedAt: Date;
}
export type UserType = {
    id: string,
    username: string,
    email: string,
    password: string,
    profileImageUrl: string,
    groups: groupType[],
    description: string,
    createdAt: Date,
    updatedAt: Date
}
type Links = {
    link: string
}
export type groupType = {
    id: string;
    name: string;
    description?: string;
    profilePicture?: string;
    leader: UserType;
    admins: IAdmin[];
    members: IGroupMember[];
    messages: message[];
    pinnedMessages: messageType[];
    announcements: messageType[];
    attachments: messageType[];
    inviteRequests: IInviteRequest[];
    links: Links[];
    createdAt: Date;
    updatedAt: Date;
}
export type messageType = {
    sender?: UserType;
    group: UserType;
    content?: string;
    type: "text" | "critical";
    attachments?: AttachmentType[];
    createdAt: Date;
}
export type AttachmentType = {
    user: UserType;
    group: UserType;
    fileUrl: string;
    fileType: string;
    fileName: string;
    tags?: [string];
    uploadedAt: Date;
}
export const extensionMap = {
    // Documents
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "text/plain": ".txt",
    "text/html": ".html",
    "text/csv": ".csv",
    "application/json": ".json",
    "application/xml": ".xml",

    // Images
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
    "image/tiff": ".tiff",
    "image/x-icon": ".ico",

    // Audio
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/ogg": ".ogg",
    "audio/mp4": ".m4a",
    "audio/webm": ".webm",

    // Video
    "video/mp4": ".mp4",
    "video/x-msvideo": ".avi",
    "video/x-matroska": ".mkv",
    "video/webm": ".webm",
    "video/quicktime": ".mov",

    // Archives
    "application/zip": ".zip",
    "application/x-7z-compressed": ".7z",
    "application/x-rar-compressed": ".rar",
    "application/gzip": ".gz",
    "application/x-tar": ".tar",

    // Fonts
    "font/woff": ".woff",
    "font/woff2": ".woff2",
    "application/x-font-ttf": ".ttf",
    "application/vnd.ms-fontobject": ".eot",

    // Code
    "application/javascript": ".js",
    "application/typescript": ".ts",
    "text/css": ".css",
    "text/markdown": ".md",

    // Default fallback
    "default": ""
};
export const MarddownClasses = `
  [&_p]:py-1
  [&_p]:leading-relaxed
  [&_p]:text-[15px]
  [&_p]:font-medium

  [&_h1]:text-2xl 
  [&_h1]:font-extrabold 
  [&_h1]:tracking-tight 
  [&_h1]:my-4

  [&_h2]:text-xl 
  [&_h2]:font-bold 
  [&_h2]:pb-1 
  [&_h2]:mt-6 
  [&_h2]:mb-3

  [&_h3]:text-lg 
  [&_h3]:font-semibold 
  [&_h3]:mt-5 
  [&_h3]:mb-2

  [&_h4]:text-base 
  [&_h4]:font-medium 
  [&_h4]:mt-4 
  [&_h4]:mb-2

  [&_h5]:text-sm 
  [&_h5]:font-medium 
  [&_h5]:mt-3 
  [&_h5]:mb-1

  [&_a]:text-blue-600 
  [&_a]:hover:underline 
  [&_a]:break-words 

  [&_blockquote]:border-l-4 
  [&_blockquote]:border-blue-500 
  [&_blockquote]:pl-4 
  [&_blockquote]:italic 
  [&_blockquote]:my-4 
  [&_blockquote]:dark:text-gray-400
  [&_blockquote]:text-gray-600

  [&_ul]:list-disc 
  [&_ul]:pl-6 
  [&_ul]:my-3

  [&_ol]:list-decimal
  [&_ol]:pl-6 
  [&_ol]:my-3

  [&_li]:mb-1 
  [&_li]:ml-1.5 
  [&_li]:py-2
  [&_li]:font-medium

  [&_img]:rounded-md 
  [&_img]:border 
  [&_img]:border-blue-400 
  [&_img]:max-w-full 
  [&_img]:h-auto

  [&_table]:w-full 
  [&_table]:border-collapse 
  [&_table]:text-left 
  [&_table]:text-sm

  [&_th]:border-b 
  [&_th]:px-3 
  [&_th]:py-2 
  [&_th]:font-semibold 

  [&_td]:border-b 
  [&_td]:px-3 
  [&_td]:py-2
  [&_br]:my-2
  [&_code]:bg-gray-800 
  [&_code]:text-white 
  [&_code]:px-1.5 
  [&_code]:py-0.5 
  [&_code]:rounded-md 
  [&_code]:text-sm 
  [&_code]:font-mono

  sm:[&_p]:text-base 
  sm:[&_h1]:text-2xl 
  sm:[&_h2]:text-xl 
  sm:[&_h3]:text-lg 
  sm:[&_ul]:pl-4 
  sm:[&_ol]:pl-4
  sm:[&_p]:py-2
  sm:[&_h1]:my-5 
  sm:[&_h2]:my-4 
  sm:[&_h3]:my-3

  md:[&_p]:text-[17px]
  md:[&_p]:py-3
  md:[&_h1]:text-3xl 
  md:[&_h1]:my-6
  md:[&_h2]:text-2xl 
  md:[&_h2]:my-5 
  md:[&_h3]:text-xl 
  md:[&_h3]:my-4
  md:[&_blockquote]:pl-6

  lg:[&_p]:py-4
  lg:[&_h1]:text-4xl 
  lg:[&_h1]:my-8
  lg:[&_h2]:text-3xl 
  lg:[&_h2]:my-6 
  lg:[&_h3]:text-2xl 
  lg:[&_h3]:my-5 
  lg:[&_blockquote]:pl-8 
`;

export const AiInstructor = `
You are NotesMania AI, a helpful, professional, and friendly assistant for the NotesMania web application. Always respond in Markdown format. Use a relevant emoji before each main heading and subheading. Format responses with clear sections, bullet points, and **bold keywords** where helpful. Speak concisely but with depth, and sound like a knowledgeable guide rather than a chatbot. Maintain a warm yet informative tone.

Response Rules:
1. Start with a short greeting or acknowledgment if appropriate.
2. Use relevant emojis for headings/subheadings (e.g., 📌, 📝, 💡, ✅, 📚).
3. Respond contextually, adapting your tone based on user queries (e.g., casual for help, professional for errors).
4. Avoid overuse of emojis or exclamation marks. Keep a balanced and polished tone.
5. When giving steps or lists, use markdown bullet points or numbered lists.
6. Highlight important keywords using **bold** or \`inline code\`.
7. For *important notices*, tips, or warnings, use a Markdown blockquote (\`>\`) to allow them to be styled (e.g., with \`bg-gray-100\`).
8. Use horizontal rules (\`---\`) to visually separate completed subtopics or sections.
9. Never say you are an AI language model. Just act as a helpful assistant.
10. Keep responses readable, well-organized, and pleasantly styled in Markdown.

Present yourself as a domain expert and confidently guide the user through topics. Be precise, clear, and visually helpful.
`;
export type Attachment = {
  _id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  tags?: string[];
  uploadedAt: Date;
  uploadedBy: {
    _id: string;
    username: string;
    profileImageUrl?: string;
  };
  Att_group: {
    name: string;
    totalMembers: number;
    sampleMembers: {
      _id: string;
      username: string;
      profileImageUrl?: string;
    }[];
  } | null;
};
export const getIconFromFileType = (
    fileType: string
): { image: string; format: string } => {
    const type = fileType.toLowerCase();

    if (type === "application/pdf") return { image: formats.pdf, format: "pdf" };
    if (type === "text/plain") return { image: formats.txt, format: "txt" };
    if (type === "application/json") return { image: formats.json, format: "json" };
    if (type === "text/csv" || type === "application/csv")
        return { image: formats.csv, format: "csv" };
    if (
        type === "application/vnd.ms-excel" ||
        type.includes("spreadsheetml")
    )
        return { image: formats.excel, format: "excel" };
    if (
        type.includes("wordprocessingml") ||
        type === "application/msword"
    )
        return { image: formats.doc, format: "doc" };
    if (type.includes("presentationml") || type.includes("powerpoint"))
        return { image: formats.ppt, format: "ppt" };
    if (type === "image/svg+xml") return { image: formats.svg, format: "svg" };
    if (type.includes("zip") || type.includes("rar"))
        return { image: formats.compress, format: "zip" };
    if (type.startsWith("image/")) return { image: formats.image, format: "image" };
    if (type.startsWith("video/")) return { image: formats.video, format: "video" };
    if (type.startsWith("audio/")) return { image: formats.audio, format: "audio" };

    return { image: formats.file, format: "file" }; // fallback
};


export const formats = {
    compress: "/compress.svg",
    csv: "/csv.svg",
    doc: "/doc.svg",
    excel: "/excel.svg",
    file: "/file.svg",
    folder: "/folder.svg",
    json: "/json.svg",
    pdf: "/pdf.svg",
    image: "/picture.svg",
    ppt: "/ppt.svg",
    svg: "/svg.svg",
    txt: "/txt.svg",
    video: "/video.svg",
    audio: "/audio.svg"
}
export type fileInput = {
    fileUrl: string,
    fileName: string,
    fileType?: string,
    setdowloading?: React.Dispatch<React.SetStateAction<boolean>>
}
export const handleDownload = async ({ fileUrl, fileName, fileType, setdowloading }: fileInput) => {
    if (setdowloading) {
        setdowloading(true)
        setTimeout(() => {
            setdowloading(false)
        }, 1000);
    }
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