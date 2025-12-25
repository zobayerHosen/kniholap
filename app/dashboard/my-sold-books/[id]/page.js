import SoldBookDetailsComponent from "../components/SoldBookDetailsComponent";

export default async function SoldBookDetailsPage({ params }) {
  const { id } = await params;
  console.log("Server params id --->", id);

  return <SoldBookDetailsComponent params_id={id} />;
}
