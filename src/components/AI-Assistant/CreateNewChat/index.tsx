
import React, {useState} from 'react'
import Modal from '@/components/Multipurpose/Modal'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import Button from '../../Multipurpose/Button/Index'
import { Send } from 'lucide-react'
const ModalNewChat = ({ isOpen, onClose , onClick }:{
    isOpen:boolean,
    onClose:()=>void,
    onClick:(chatName:string)=>void,
}) => {
    const [chatName,setChatName]=useState<string>("")
    return (
        <Modal isOpen={isOpen} onClose={onClose} name={"Create New Chat"} >
            <div>
                <div className="grid gap-4 px-2 md:px-8 py-4 text-white">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Chat Name
                        </Label>
                        <Input
                            value={chatName}
                            onChange={(e)=>{
                                setChatName(e.target.value);
                            }}
                            id="name"
                            placeholder='New Chat'
                            className="col-span-3"
                        />
                    </div>
                    <Button onClick={()=>{
                        onClick(chatName);
                        setChatName("");
                        onClose()
                        }} text='Submit' icon={Send}></Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalNewChat