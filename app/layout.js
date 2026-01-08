import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import { cookies } from "next/headers";
import { axiosPrivateServer } from "@/lib/axios.private.server";
import { getUserProfile } from "@/lib/api/get-user-profile";
// Add this new viewport export
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://kniholap.netlify.app");

export const viewport = {
  themeColor: "black",
};

export const metadata = {
  title: "Kniholap",
  description:
    "Your One-Stop Book Marketplace & Digital Library.Trade physical books, read premium eBooks, and connect with readers worldwide.",
  openGraph: {
    title: "Kniholap",
    description:
      "Your One-Stop Book Marketplace & Digital Library.Trade physical books, read premium eBooks, and connect with readers worldwide.",
    url: BASE_URL,
    siteName: "Kniholap",
    images: [
      {
        url: "/images/meta_images/facebook_meta.png",
        width: 1200,
        height: 630,
        alt: "Kniholap - Your One-Stop Book Marketplace & Digital Library",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter Card meta tags
  twitter: {
    card: "summary_large_image",
    title: "Kniholap",
    description:
      "Your One-Stop Book Marketplace & Digital Library.Trade physical books, read premium eBooks, and connect with readers worldwide.",
    images: ["/images/meta_images/facebook_meta.png"],
    site: "@yourtwitterhandle",
    creator: "@yourtwitterhandle",
  },
  // Additional meta tags
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  icons: {},
};

// Primary Font
const primaryFont = Roboto({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Secondary Font
const secondaryFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-secondary",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export default async function RootLayout({ children }) {
  // get user data
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.AUTH_TOKEN_NAME)?.value || null;
  const axiosInstance = await axiosPrivateServer();
  let userData = null;
  if (token) {
    try {
      userData = await getUserProfile(axiosInstance);
    } catch (err) {
      console.error("Failed to fetch user on server:", err);
    }
  }
  console.log("Server user data:", userData);
  // main render
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${primaryFont.variable} ${secondaryFont.variable}`}
    >
      <body suppressHydrationWarning>
        <Toaster position="top-center" />
        <AntdRegistry>
          <Providers serverUserData={userData} serverAccessToken={token}>
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
