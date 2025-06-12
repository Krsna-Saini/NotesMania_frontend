import React, { useEffect, useState, ElementType } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft} from "lucide-react";

interface ButtonProps {
    isloading?: boolean;
    type?: "button" | "submit" | "reset";
    classes?: string;
    onClick?: () => void;
    icon?: string | ElementType;
    text?: string;
    role?: string;
    align?: "right" | "left" | "top" | "bottom";
    hideText?: boolean;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    isloading = false,
    type = "button",
    classes = "",
    onClick,
    icon,
    text,
    hideText,
    role,
    children,
    align = "left"
}) => {
    const [show, setShow] = useState(false);
    const [delayedShow, setDelayedShow] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (show) {
            timer = setTimeout(() => setDelayedShow(true), 500);
        } else {
            setDelayedShow(false);
        }
        return () => clearTimeout(timer);
    }, [show]);
    const SpecialClasses=`flex items-center gap-1 px-2 py-1 xl:py-2 xl:px-3 
                    bg-black hover:bg-gray-800 border-2 border-gray-400 
                    rounded-full relative`
    return (
        <button
            type={type}
            className={`flex relative items-center justify-center h-min 
                ${isloading ? "cursor-none" : "cursor-pointer"} ${classes}`}
            onClick={onClick}
            disabled={isloading}
        >
            <div
                className={icon && SpecialClasses}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {/* Icon Handling (Either Image Path or React Icon Component) */}
                {icon && !isloading && (
                    typeof icon === "string" ? (
                        <div className="h-6 w-10 overflow-hidden flex items-center justify-center">
                            <Image src={icon} width={150} height={150} className="rounded-full size-20 object-cover" alt="icon" />
                        </div>
                    ) : (
                        React.createElement(icon, { size: 15, className: "text-white" })
                    )
                )}
                {/* Button Text */}
                {text && (
                    <p className={`text-white sm:flex text-sm whitespace-nowrap ${hideText ? 'hidden' : 'flex'}`}>{text}</p>
                )}
                {children}
            </div>

            {/* Tooltip (Role) */}
            {role && (
                <div
                    className={`absolute border-gray-600 z-[1000] border-2 h-fit  bg-black text-white rounded-lg px-2 py-2 xl:px-3 text-sm 
                         transition-all duration-500 ease-in-out flex-col items-center justify-center
                        ${align === "left" && "right-[120%]"}
                        ${align === "right" && "left-[120%]"}
                        ${align === "top" && "-top-[150%] "}
                        ${align === "bottom" && "top-[150%]"}
                        ${delayedShow ? "flex" : "hidden"}
                        `}
                >
                    <div className={` relative items-center justify-center flex`}>
                        <p className="whitespace-nowrap">{role}</p>
                    </div>
                    {/* Tooltip Arrow */}
                    {
                        align === "left" && <div className="h-full w-full  flex flex-col items-center justify-center">
                            <ChevronLeft className={`absolute left-full  rotate-180 top-1/2 -translate-x-[8px] -translate-y-1/2   text-gray-600 size-6`} />
                            <span className={`absolute left-full -translate-y-[10px] -translate-x-[4px] rotate-45  bg-black text-gray-600 size-2`} />
                        </div>
                    }
                    {
                        align === "right" && <div className="h-full absolute w-full flex items-center justify-center">
                            <ChevronLeft className={`absolute right-[100%] translate-x-[8px] z-[50] text-gray-600 size-6`} />
                            <span className={`absolute -left-[4px] rotate-45  size-2  text-gray-600  bg-black`} />
                        </div>
                    }
                    {
                        align === "top" && <div className="h-full w-full flex flex-col-reverse items-center justify-center">
                            <ChevronDown className={`absolute text-gray-600 size-6 top-full -translate-y-[8.2px] `} />
                            <span className={`absolute -translate-y-[4px] rotate-45 bg-black size-2 z-[50] top-full `} />
                        </div>
                    }
                    {
                        align === "bottom" && <div className="h-full w-full flex items-center justify-center">
                            <ChevronDown className={`absolute rotate-180 z-[50]  translate-y-[8px] bottom-full text-gray-600 size-6`} />
                            <span className={`absolute rotate-45 -translate-y-[4px] top-0 bg-black size-3 text-gray-600`} />
                        </div>
                    }
                </div>
            )}
        </button>
    );
};

export default Button;
