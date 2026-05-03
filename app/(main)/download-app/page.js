import DownloadApp from "@/components/home/DownloadApp";

export const metadata = {
  title: "Download Kniholap App",
  description: "Get the Kniholap app on your mobile device to read your favorite books anywhere, anytime.",
};

const DownloadAppPage = () => {
  return (
    <div className="py-10 md:py-20">
      <DownloadApp />
    </div>
  );
};

export default DownloadAppPage;
