"use client";

import { useParams, useSearchParams } from "next/navigation";
import SoldBookDetailsComponent from "@/app/dashboard/my-sold-books/components/SoldBookDetailsComponent";
import MyPurchasedBooksComponent from "../../my-purchased-book/components/MyPurchasedBooksComponent";
import Error from "@/app/global-error";

const BookDetailsPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const showChat = searchParams.get("chat") === "true";

  if (type === "sold") {
    return <SoldBookDetailsComponent params_id={id} showChat={showChat} />;
  }

  if (type === "purchased") {
    return <MyPurchasedBooksComponent params_id={id} showChat={showChat} />;
  }
  return <Error />;
};
export default BookDetailsPage;
