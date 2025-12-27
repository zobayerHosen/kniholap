import React from "react";
import MyPurchasedBooksComponent from "../components/MyPurchasedBooksComponent";

export default async function MyPurchasedBookDetails({ params }) {
  const { id } = await params;
  return <MyPurchasedBooksComponent params_id={id} />;
}