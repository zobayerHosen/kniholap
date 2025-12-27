import SoldBookDetailsComponent from "../../my-sold-books/components/SoldBookDetailsComponent";

export default async function ChatBookSeller({ params }) {
  const { id } = await params;

  return (
    <>
      <SoldBookDetailsComponent params_id={id} />
    </>
  );
}
