import React from 'react'

const TextArrowIcon = ({ func, className }: {
    func?: () => void,
    className?: string
}) => {
    return (
        <div className={`${className}`} onClick={() => {
            if (func) func();
        }} >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path fillRule="evenodd" clipRule="evenodd" d="M5 6C5.55228 6 6 6.44772 6 7V11C6 11.5523 6.44772 12 7 12H16.5858L14.2929 9.70711C13.9024 9.31658 13.9024 8.68342 14.2929 8.29289C14.6834 7.90237 15.3166 7.90237 15.7071 8.29289L19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L15.7071 17.7071C15.3166 18.0976 14.6834 18.0976 14.2929 17.7071C13.9024 17.3166 13.9024 16.6834 14.2929 16.2929L16.5858 14H7C5.34315 14 4 12.6569 4 11V7C4 6.44772 4.44772 6 5 6Z" fill="currentColor">
                </path>
            </svg>
        </div>
    )
}

export default TextArrowIcon