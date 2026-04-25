// app/book/[slug]/page.jsx   (or .js)
import SectionTitle from "@/components/common/SectionTitle";
import StarRating from "@/components/common/StarRating";
import BookPdfClient from "@/components/library/books/BookPdfClient";
import GiveReview from "@/components/library/books/GiveReview";
import ToggleBookMark from "@/components/library/books/ToggleBookMark";
import ToggleComplete from "@/components/library/books/ToggleComplete";
import { axiosPrivateServer } from "@/lib/axios.private.server";
import Image from "next/image";
import { notFound } from "next/navigation";
import PdfDownload from "./components/PdfDownload";

export const metadata = {
  title: "Read Book",
  description:
    "Your One-Stop Book Marketplace & Digital Library.Trade physical books, read premium eBooks, and connect with readers worldwide.",
};

export default async function BookDetailsPage({ params }) {
  const { slug } = await params;
  let book;
  try {
    const axiosInstance = await axiosPrivateServer();
    const response = await axiosInstance.get(`/book/details/${slug}`);
    book = response?.data?.data;
    if (!book) throw new Error("Book not found");
  } catch (err) {
    console.error("Failed to fetch book:", err);
    notFound();
  }
  // main render
  return (
    <div className="container flex flex-col gap-2 sm:gap-4 md:gap-6 justify-start">
      <SectionTitle text="E-Book" />
      {/* Book Cover */}
      <div className="w-full bg-primary-rgb py-5 lg:py-10 px-3 sm:px-5 h-64 sm:h-80 md:h-[450px] lg:h-[500px] xl:h-[650px] sm:rounded-3xl rounded overflow-hidden">
        <Image
          src={book?.cover_image || "/placeholder-cover.jpg"}
          width={800}
          height={1000}
          alt={book?.title || "Book cover"}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {/* Book Info */}
      <div className="w-full flex flex-col gap-4 lg:gap-10 justify-start">
        <div className="w-full flex flex-col lg:gap-4 gap-2">
          <h1 className="xl:text-4xl text-xl sm:text-2xl font-bold font-secondary">
            {book?.title || "Book Title"}
          </h1>
          <div className="w-full flex justify-between flex-col xl:flex-row items-center gap-2 xl:gap-6">
            {/* Left: Author + Actions + Rating */}
            <div className="w-full flex justify-start md:flex-row flex-col md:items-center gap-2 md:gap-4">
              <p className="lg:text-xl text-base shrink-0">
                Author:{" "}
                <span className="text-[#A27B5C]">
                  {book?.author || "Unknown"}
                </span>
              </p>

              {/* Give review and toggle mark as completed */}
              <div className="flex justify-start items-center gap-4">
                <GiveReview book={book} />
                <ToggleComplete book={book} />
              </div>

              {/* Ratings */}
              <div className="flex gap-2 lg:text-base text-sm justify-start items-center">
                <span>Ratings:</span>
                <StarRating
                  rating={book?.total_rating_avg || "N/A"}
                  value={book?.total_rating_avg || "N/A"}
                  readOnly
                />
                <span>{book?.total_rating_avg || 0}</span>
                <span>({book?.no_of_reviews || 0} reviews)</span>
              </div>
            </div>

            {/* Right: Download + Bookmark */}
            <div className="shrink-0 self-end flex gap-6 justify-end items-center">
              <PdfDownload book={book} />
              <ToggleBookMark book={book} />
            </div>
          </div>
        </div>
        {/* PDF Viewer */}
        <BookPdfClient book={book} />
      </div>
    </div>
  );
}
