"use client";

import React, { useEffect } from 'react';
import axiosPublic from '@/lib/axios.public';
import { useMutation } from '@tanstack/react-query';
import { LucideLoader2 } from 'lucide-react';

const PrivacyPolicy = () => {
    const axios = axiosPublic();

    const { mutate, data, isPending, isError } = useMutation({
        mutationFn: async () => {
            const response = await axios.get('/privacy-policy');
            return response.data;
        }
    });

    useEffect(() => {
        mutate();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="container ">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

            {isPending && (
                <div className="flex justify-center items-center py-20">
                    <LucideLoader2 className="animate-spin text-primary text-4xl" />
                </div>
            )}

            {isError && (
                <div className="text-center text-red-500 py-10">
                    Failed to load privacy policy. Please try again later.
                </div>
            )}

            {data?.data?.[0]?.page_content && (
                <div
                    className="prose max-w-none prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-700 prose-li:text-gray-700 bg-white p-6 md:p-10 rounded-2xl shadow-sm"
                    dangerouslySetInnerHTML={{ __html: data.data[0].page_content }}
                />
            )}
        </div>
    );
};

export default PrivacyPolicy;
