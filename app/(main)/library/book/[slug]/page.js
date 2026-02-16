import StarRating from "@/components/common/StarRating";
import BookImages from "@/components/library/books/BookImages";
import RelatedBooks from "@/components/library/books/RelatedBooks";
import { axiosPrivateServer } from "@/lib/axios.private.server";
import { notFound } from "next/navigation";
import Description from "@/components/library/books/details/Description";
import CheckoutButton from "@/components/library/books/details/CheckoutButton";
import GiveReview from "@/components/library/books/GiveReview";
export const metadata = {
  title: "Book Details",
  description:
    "Your One-Stop Book Marketplace & Digital Library.Trade physical books, read premium eBooks, and connect with readers worldwide. ",
};
const BookDetails = async ({ params }) => {
  const { slug } = await params;
  let book;
  try {
    const axiosInstance = await axiosPrivateServer();
    const response = await axiosInstance.get(`/book/details/${slug}`);
    book = response?.data?.data;
    console.log(book);
    if (!book) throw new Error("Book not found");
  } catch (err) {
    console.error("Failed to fetch book:", err);
    notFound();
  }
  console.log("Main Book Details Data:---->", book);

  // Note: main render
  return (
    <div className="container flex flex-col gap-8 lg:gap-16 justify-start">
      <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-5 xl:gap-10">
        {/* swiper */}
        <div className="w-full md:w-[45%]">
          <BookImages book={book} />
        </div>
        {/* details */}
        <div className="w-full md:w-[55%] flex flex-col gap-2 xl:gap-6">
          <h1 className="xl:text-4xl text-xl sm:text-2xl font-bold font-secondary">
            {book?.title || "Book Title"}
          </h1>
          <div className="flex flex-col gap-2 lg:gap-4">
            {/* author */}
            <p className="sm:text-xl text-base xs:text-lg">
              <span className="font-semibold">Author:</span>
              <span className="text-[#A27B5C] ml-2">
                {book?.author || "Unknown"}
              </span>
            </p>
            {/* rating */}
            <div className="flex items-center">
              <StarRating rating={book?.total_rating_avg} />
              <span className="ml-2 flex items-center text-xs sm:text-base text-gray-500">
                {book?.total_rating_avg || 0} ({book?.no_of_reviews || 0}{" "}
                reviews)
              </span>
            </div>
            <GiveReview
              book={book}
              className="w-fit bg-red-300 py-1.5! px-7! text-[#333] font-medium"
            />

            {/* price */}
            <p className="text-base">
              Price: €<label className="font-semibold">{book?.price || "00"}</label>
            </p>
            {/* shipping cost */}
            <p className="text-base">
              Shipping Cost:{" "}
              <label className="font-semibold">{book?.shipping_cost || "00"}</label>
            </p>
            {/* isbn */}
            <p className="text-base">
              ISBN: <label className="font-semibold">{book?.isbn || "N/F"}</label>
            </p>

            {/* categories */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <p className=" text-lg font-bold">Book Categories</p>
              <div className="w-full flex gap-1 justify-start items-center flex-wrap">
                {book?.book_categories?.map((category, index) => (
                  <div
                    className="flex justify-center items-center rounded bg-primary text-white font-semibold sm:px-2  py-1 px-2 text-xs xs:text-sm sm:text-base"
                    key={category.id}
                  >
                    {category?.category?.title || "Unknown"}
                  </div>
                ))}
              </div>
            </div>
            {/* description */}
            <Description book={book} />
            {/* action buttons */}
            <CheckoutButton book={book} />
          </div>
        </div>
      </div>
      <RelatedBooks book={book} />
    </div>
  );
};
export default BookDetails;
