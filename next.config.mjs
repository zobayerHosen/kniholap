/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Existing ones
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media-cldnry.s-nbcnews.com",
        port: "",
        pathname: "/**",
      },
      //   Dynamically allow your backend (from .env)
      ...(process.env.NEXT_PUBLIC_BASE_URL
        ? [
            {
              protocol: "https",
              // hostname: new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname,
              // hostname: "marikbtv.reigeeky.com",
              hostname: "admin.kniholap.sk",
              port: "",
              pathname: "/**", // Allow all paths under your base URL
              // Or be more strict:
              // pathname: "/uploads/**",
            },
          ]
        : []),
    ],

  },
};
export default nextConfig;