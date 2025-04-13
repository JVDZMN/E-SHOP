'use client'
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import React, { useEffect, useState } from 'react'
import { CiCamera } from "react-icons/ci";

type Props = {
    disabled: boolean,
    onChange: (value: string) => void,
    onRemove: (value: string) => void,
    value: string[],
    type: "standard" | "profile" | "cover",
    dontShowPreview: boolean,
    cloudinaryKey:string
}
export default function ImageUpload({ disabled, onChange, onRemove, value, type, dontShowPreview,cloudinaryKey }: Props)
{
    const onUpload = (result: any) => {
        console.log(result)
        onChange(result.info.secure_url)
    }

    
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted) { return null }
    if (type === "profile") {
    return (
        <div className="flex justify-center">
        <div className="relative rounded-full w-52 h-52 bg-gray-200 border-2 border-white shadow-2xl overflow-hidden">
            {/* Show image if uploaded */}
            {value.length > 0 && (
            <Image
                src={value[0]}
                alt=""
                width={300}
                height={300}
                className="w-52 h-52 rounded-full object-cover absolute top-0 left-0"
            />
            )}

            {/* Upload button with camera icon */}
            <CldUploadWidget uploadPreset={cloudinaryKey} onSuccess={onUpload}>
            {({ open }) => (
                <button
                type="button"
                onClick={() => open()}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-md hover:scale-105 transition z-10"
                >
                <CiCamera className="w-5 h-5 text-gray-700 " />
                </button>
            )}
            </CldUploadWidget>
        </div>
        </div>
    );
    }


    else return (
    <div>
      
    </div>
  )
}
 