"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader, Paperclip, Plus, X } from "lucide-react"
import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { themeStatetype } from "@/state/Global"
import { toast } from "sonner"

const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL

export default function AddAttachmentDropdown({refetch}:{
    refetch:()=> void
}) {
    const [file, setFile] = useState<File | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setuploading] = useState(false)
    const userData = useSelector((state: { global: themeStatetype }) => state.global.user)
    const handleAddTag = () => {
        const tag = tagInput.trim()
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag])
        }
        setTagInput("")
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
        console.log("remove tag ", tagToRemove)
    }
    const handleSend = async () => {
        setuploading(true)
        if (file) {
            const formdata = new FormData()
            formdata.append("files", file)
            formdata.append('userId', userData.id);
            formdata.append("tags", JSON.stringify(tags))
            const response = await fetch(`${Backend_url}/upload`, {
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'application/json'
                }
            })
            if(response.ok){
                refetch()
                toast.success("File Added Sucessfully")
            }
            else {
                toast.error("There is some error Saving file ")
            }
        }
        setuploading(false)
        setFile(null)
        setTags([])
        setTagInput("")
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Add Attachment
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 p-4 space-y-3" align="end">
                {/* File Upload */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">File</label>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file && (
                        <p className="text-xs text-muted-foreground">
                            Selected: {file.name}
                        </p>
                    )}
                </div>

                {/* Tag Input */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddTag()
                                }
                            }}
                            placeholder="Type and press Enter"
                        />
                        <Button size="icon" type="button" onClick={handleAddTag}>
                            <Plus size={16} />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)}>
                                    <X
                                        size={14}
                                        className="cursor-pointer"

                                    />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full"
                    onClick={handleSend}
                    disabled={(!file && tags.length === 0) || uploading}
                >
                    {
                        uploading? (
                            <div className="flex items-center gap-2 text-sm text-muted">
                                <Loader className="h-5 w-5 animate-spin" />
                                <span>Submitting...</span>
                            </div>
                        ) : (
                            <div>
                                Submit
                            </div>
                        )
                    }
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
