"use client"
import ErrorScreen from "@/components/common/ErrorScreen";

const Error = ({ error, reset }) => {
  // main render
  return (
    <div className='w-full h-screen flex justify-center items-center '>
      <ErrorScreen reset={reset} error={error} />
    </div>
  );
};
export default Error;