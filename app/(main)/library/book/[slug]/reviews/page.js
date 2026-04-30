import { axiosPrivateServer } from "@/lib/axios.private.server";
import { notFound } from "next/navigation";
import BookReviewsList from "@/components/library/books/details/BookReviewsList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Book Reviews",
  description: "Read all reviews for this book.",
};

const BookReviewsPage = async ({ params }) => {
  const { slug } = await params;
  let book;

  try {
    const axiosInstance = await axiosPrivateServer();
    const response = await axiosInstance.get(`/book/details/${slug}`);
    book = response?.data?.data;
    if (!book) throw new Error("Book not found");
  } catch (err) {
    console.error("Failed to fetch book for reviews:", err);
    notFound();
  }

  return (
    <div className="container">
      <div className="flex flex-col gap-6">
        <Link 
          href={`/library/book/${slug}`}
          className="flex items-center gap-2 text-primary hover:underline w-fit"
        >
          <ChevronLeft size={20} />
          Back to Book Details
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary">
            Reviews for {`"` + book?.title + `"`}
          </h1>
          <p className="text-gray-500">
            Total {book?.no_of_reviews || 0} reviews
          </p>
        </div>

        <BookReviewsList bookId={book.id} />
      </div>
    </div>
  );
};

export default BookReviewsPage;
