"use client"
import Image from "next/image";
import { FaCamera } from "react-icons/fa6";
import coverImg from "@/public/settings/settingsCover.avif";
import profileImg from "@/public/settings/profileImg.png";
import { MdNotificationsActive } from "react-icons/md";
import { LiaLanguageSolid } from "react-icons/lia";
import { TbExchange } from "react-icons/tb";
import { Switch } from 'antd';
import UserInfo from "./UserInfo";
import PersonalInformation from "./PersonalInformation";
import { useUser } from "@/hooks/get-user.hook";
import { useMutation } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import toast from "react-hot-toast";
import { useState } from "react";

const SettingsContent = () => {
    const { userData, userRefetch, isLoading } = useUser();
    const axiosPrivate = axiosPrivateClient();
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Note: handle cover and profile image change mutation
    const handleImagesChange = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosPrivate.post(
                "/user/avatar/update",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response?.data;
        },

        onSuccess: () => {
            toast.success("Images updated successfully");
            setAvatarPreview(null);
            setCoverPreview(null);
            userRefetch();
        },

        onError: () => {
            toast.error("Image update failed");
            setAvatarPreview(null);
            setCoverPreview(null);
        }
    });

    const { isPending } = handleImagesChange;


    // Note: handle cover and profile image change
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        const formData = new FormData();

        if (e.target.name === "avatar") {
            setAvatarPreview(previewUrl);
            formData.append("avatar", file);
        } else {
            setCoverPreview(previewUrl);
            formData.append("cover", file);
        }

        handleImagesChange.mutate(formData);
    };

    if(isLoading) <><h1 className="text-3xl font-semibold">Loading....</h1></>


    // Note: main ui component
    return (
        <div className="w-full relative pb-16">
            {/* cover image */}
            <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[430px] rounded-xl">
                <Image
                    src={coverPreview || userData?.cover || coverImg}
                    alt="Cover"
                    fill
                    className={`object-cover rounded-xl ${isPending ? "opacity-60" : ""}`}
                />

                <label
                    htmlFor="cover"
                    className="cursor-pointer absolute right-2 sm:right-3 md:right-4 lg:right-5 bottom-2 sm:bottom-3 flex items-center justify-center bg-[#F84E12] size-10 sm:size-12 md:size-14 rounded-full shadow-lg"
                >
                    <FaCamera className="size-4 sm:size-5 text-white" />
                    <input
                        onChange={handleCoverImageChange}
                        type="file"
                        id="cover"
                        name="cover"
                        className="hidden"
                        disabled={isPending}
                    />
                </label>

                {/* Profile Image */}
                <div className="absolute -bottom-16 sm:-bottom-18 md:-bottom-20 left-4 sm:left-6 md:left-8 lg:left-12 size-[100px] sm:size-[120px] md:size-[140px] lg:size-[160px] rounded-full ring-8 sm:ring-10 md:ring-12 lg:ring-[15px] ring-[#F5F5F9] bg-white">
                    <Image
                        src={avatarPreview || userData?.avatar || profileImg}
                        width={520}
                        height={200}
                        alt="Profile"
                        className={`w-full h-full object-cover rounded-full ${isPending ? "opacity-60" : ""}`}
                    />

                    <label
                        htmlFor="avatar"
                        className="cursor-pointer absolute right-1 bottom-1 sm:bottom-2 flex items-center justify-center bg-[#F84E12] size-6 sm:size-7 md:size-8 rounded-full shadow-md">
                        <FaCamera className="size-3 sm:size-4 text-white" />

                        <input
                            onChange={handleCoverImageChange}
                            type="file"
                            id="avatar"
                            name="avatar"
                            className="hidden"
                            disabled={isPending}
                        />
                    </label>
                </div>
            </div>

            {/* User Info Section */}
            <div className="mt-20 sm:mt-24 md:mt-28 lg:mt-30 md:px-8 lg:px-12">
                {/* user card info and payment methods details */}
                <UserInfo />

                {/* Settings Buttons */}
                <div className="mt-6 sm:mt-8 md:mt-10 space-y-3 sm:space-y-4">
                    <div className="cursor-pointer w-full flex justify-between items-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition">
                        <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg">
                            <MdNotificationsActive className="text-xl sm:text-2xl" />
                            Notifications
                        </p>
                        <Switch
                            className="custom-switch scale-75 sm:scale-90 md:scale-100"
                        />
                    </div>

                    <button className="cursor-pointer w-full flex justify-between items-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition">
                        <p className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg">
                            <LiaLanguageSolid className="text-xl sm:text-2xl" />
                            Change Language
                        </p>

                        <TbExchange className="text-xl sm:text-2xl" />
                    </button>
                </div>
            </div>

            <PersonalInformation />
        </div>
    );
};
export default SettingsContent;