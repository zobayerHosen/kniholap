"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GrCloudUpload } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import BookAddModal from "./BookAddModal";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import { useMutation } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useOptions } from "@/hooks/options.hook";
import toast from "react-hot-toast";
import useGetLanguageOptions from "@/hooks/language.hook";

const AddNewBookForm = () => {
    const axiosInstance = axiosPrivateClient();
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [subImages, setSubImages] = useState([]);
    const [subImagePreviews, setSubImagePreviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { categoryList } = useOptions();
    const { getLanguage } = useGetLanguageOptions();

    // Note: book categories options
    const categoryOptions = categoryList?.map(category => ({
        value: category?.id,
        label: category?.title
    }));

    // Note: language options id and name convert into value and lable
    const languageOptions = getLanguage?.map((lang) => ({
        value: lang?.id,
        label: lang?.name
    }));

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm();

    // Note: Handle Cover Image Change
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Note: Remove Cover Image
    const removeCover = () => {
        setCoverFile(null);
        setCoverPreview(null);
        document.getElementById('cover_image').value = '';
    };

    // Note: Handle Sub Images Change (Multiple)
    const handleSubImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPreviews = files.map(file => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newPreviews).then(previews => {
            setSubImages(prev => [...prev, ...files]);
            setSubImagePreviews(prev => [...prev, ...previews]);
        });
    };

    // Note: Remove Single Sub Image
    const removeSubImage = (index) => {
        setSubImages(prev => prev.filter((_, i) => i !== index));
        setSubImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Note: Open Success Modal
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    // Note: Mutation to Add Book
    const mutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post('/auth/seller/book/store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        },
        onSuccess: (data) => {
            showModal();
            setCoverFile(null);
            setCoverPreview(null);
            setSubImages(null);
            setSubImagePreviews(null);
            reset();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to publish book. Please try again.");
        }
    });

    // Note: Form Submit Handler
    const onSubmit = (data) => {
        const formData = new FormData();

        // Append text fields
        formData.append('title', data.title);
        formData.append('author', data.author);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('isbn', data.isbn);
        formData.append('condition', data.condition);
        formData.append('weight_gram', data.weight_gram);
        formData.append('description', data.description);
        formData.append('language_id', data.language_id);
        formData.append('shipping_cost', data.shipping_cost)

        // Note: Append categories as array 
        if (data?.category_ids && data?.category_ids?.length > 0) {
            data?.category_ids?.forEach(id => formData.append('category_ids[]', id));
        }

        // Note: Append cover image
        if (coverFile) {
            formData.append('cover_image', coverFile);
        }

        // Append multiple sub images
        // subImages.forEach((image, index) => {
        //     formData.append('images[]', image);
        // });

        subImages.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        mutation.mutate(formData);
    };

    // Note: main ui component
    return (
        <div className="w-full flex items-start">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">

                {/* Cover Image Upload */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    <label
                        htmlFor="cover_image"
                        className={`block w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all
                            ${coverPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-[#FFB800]'}`}
                    >
                        <input
                            type="file"
                            id="cover_image"
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverChange}
                        />
                        {coverPreview ? (
                            <div className="relative h-full flex items-center justify-center">
                                <img src={coverPreview} alt="Cover preview" className="max-h-full rounded-lg" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeCover(); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                >
                                    <RxCross2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-3">
                                <GrCloudUpload className="text-5xl text-gray-400" />
                                <p className="text-lg">Click to upload cover image</p>
                                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                    </label>
                </div>

                {/* Sub Images Upload */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                    <label
                        htmlFor="images"
                        className="block w-full min-h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-[#FFB800] transition-all p-6"
                    >
                        <input
                            type="file"
                            id="images"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleSubImagesChange}
                        />
                        {subImagePreviews?.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                {subImagePreviews?.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeSubImage(index); }}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <RxCross2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-400 rounded-lg">
                                    <GrCloudUpload className="text-3xl text-gray-400" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500">
                                <GrCloudUpload className="text-5xl" />
                                <p>Click to upload additional images</p>
                                <p className="text-sm">You can select multiple images</p>
                            </div>
                        )}
                    </label>
                </div>

                {/* Rest of your inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* book title */}
                    <CommonInputWrapper
                        label="Book Title:"
                        type="text"
                        name="title"
                        placeholder="Enter book title"
                        register_as="title"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "Book title is required"
                        }}
                    />
                    {/* book author name */}
                    <CommonInputWrapper
                        label="Book Author"
                        name="author"
                        register={register}
                        register_as="author"
                        placeholder="Author name"
                        errors={errors}
                        validationRules={{
                            required: "Book author is required"
                        }}
                    />
                    {/* price input */}
                    <CommonInputWrapper
                        label="Price"
                        type="number"
                        name="price"
                        register_as="price"
                        register={register}
                        placeholder="Book price"
                        errors={errors}
                        validationRules={{
                            required: "Book price is required"
                        }}
                    />
                    {/* quantity input */}
                    <CommonInputWrapper
                        label="Quantity"
                        type="number"
                        name="stock"
                        register={register}
                        register_as="stock"
                        placeholder="Book quantity"
                        errors={errors}
                        validationRules={{
                            required: "Book quantity is required"
                        }}
                    />

                    {/* isbn input */}
                    <CommonInputWrapper
                        label="ISBN"
                        name="isbn"
                        register_as="isbn"
                        register={register}
                        placeholder="Enter ISBN"
                        errors={errors}
                        validationRules={{
                            required: "ISBN is required"
                        }}
                    />
                    {/* condition */}
                    <CommonInputWrapper
                        label="Condition"
                        name="condition"
                        register_as="condition"
                        register={register}
                        placeholder="Enter Condition"
                        errors={errors}
                        validationRules={{
                            required: "Condition is required"
                        }}
                    />
                    {/* category select */}
                    <CommonInputWrapper
                        type="select"
                        label="Categories"
                        name="category_ids"
                        register_as="category_ids"
                        control={control}
                        options={categoryOptions || []}
                        selectMode="multiple"
                        validationRules={{ required: "Category required" }}
                        placeholder="Select Categories"
                        errors={errors}
                        innerWrapper="h-[58px]"
                        selectClass="text-black!"
                    />
                    {/* select book language */}
                    <CommonInputWrapper
                        type="select"
                        label="Book Language"
                        name="language_id"
                        register_as="language_id"
                        control={control}
                        options={languageOptions || []}
                        validationRules={{ required: "Book language is required" }}
                        placeholder="Select Language"
                        errors={errors}
                        innerWrapper="h-[58px]"
                        selectClass="text-black!"
                    />

                    {/* weight input */}
                    <CommonInputWrapper
                        label="Weight (gram)"
                        type="number"
                        name="weight_gram"
                        register_as="weight_gram"
                        register={register}
                        placeholder="Enter Weight in gram"
                        errors={errors}
                        validationRules={
                            {
                                required: "Weight is required"
                            }
                        }
                    />
                    {/* shipping cost */}
                    <CommonInputWrapper
                        label="Shipping Cost"
                        type="number"
                        name="shipping_cost"
                        register_as="shipping_cost"
                        register={register}
                        placeholder="Enter Shipping Cost"
                        errors={errors}
                        validationRules={
                            {
                                required: "Shipping Cost is required"
                            }
                        }
                    />
                </div>

                <CommonInputWrapper
                    label="Description"
                    type="textarea"
                    name="description"
                    register={register}
                    register_as="description"
                    placeholder="Write about the book..."
                    errors={errors}
                    validationRules={{ required: "Description is required" }}
                />

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="cursor-pointer w-full bg-[#aa4b29] hover:bg-[#8b3a1a] text-white font-semibold text-xl py-4 rounded-lg transition disabled:opacity-70"
                >
                    {mutation.isPending ? 'Publishing Book...' : 'Publish Book'}
                </button>
            </form>

            <BookAddModal isModalOpen={isModalOpen} handleCancel={handleCancel} />
        </div>
    );
};

export default AddNewBookForm;