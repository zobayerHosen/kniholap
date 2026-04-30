// app/book/[slug]/page.jsx   (or .js)
import { notFound, redirect } from "next/navigation";

// The reading functionality has been moved to the mobile application.
// This page is now disabled on the website.

export default async function BookDetailsPage({ params }) {
  // redirect("/download-app");
  notFound();

  /*
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
      <div className="w-full flex flex-col gap-4 lg:gap-10 justify-start">
        <div className="w-full flex flex-col lg:gap-4 gap-2">
          <h1 className="xl:text-4xl text-xl sm:text-2xl font-bold font-secondary">
            {book?.title || "Book Title"}
          </h1>
          <div className="w-full flex justify-between flex-col xl:flex-row items-center gap-2 xl:gap-6">
            <div className="w-full flex justify-start md:flex-row flex-col md:items-center gap-2 md:gap-4">
              <p className="lg:text-xl text-base shrink-0">
                Author:{" "}
                <span className="text-[#A27B5C]">
                  {book?.author || "Unknown"}
                </span>
              </p>

              <div className="flex justify-start items-center gap-4">
                <GiveReview book={book} />
                <ToggleComplete book={book} />
              </div>

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

            <div className="shrink-0 self-end flex gap-6 justify-end items-center">
              <PdfDownload book={book} />
              <ToggleBookMark book={book} />
            </div>
          </div>
        </div>
        <BookPdfClient book={book} />
      </div>
    </div>
  );
  */
}
