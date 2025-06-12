import React from "react";
import Image from "next/image";
const FilePreview = ({ file }: { file: File }) => {
    if (!file) return null;
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type;
    return (
        <div className="flex items-center border rounded-lg">
            {/* Image Preview */}
            {fileType.startsWith("image/") && (
                <Image width={300} height={300} src={fileUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border shadow-md" />
            )}

            {/* Audio Preview */}
            {fileType.startsWith("audio/") && (
                <audio controls className="w-[220px]">
                    <source src={fileUrl} type={fileType} />
                    Your browser does not support the audio element.
                </audio>
            )}

            {/* Video Preview */}
            {fileType.startsWith("video/") && (
                <video controls className="w-20 h-20  rounded-lg shadow-md">
                    <source src={fileUrl} type={fileType} />
                    Your browser does not support the video element.
                </video>
            )}

            {/* other document Preview */}
            {!fileType.startsWith("image/") &&
                !fileType.startsWith("audio/") &&
                !fileType.startsWith("video/") && (
                <iframe src={fileUrl} className="w-20 h-20  border rounded-lg shadow-md"></iframe>
            )}
        </div>
    );
};

export default FilePreview;
