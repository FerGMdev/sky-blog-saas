/** @type {import('next').NextConfig} */

/* 
  This is to fix the issue with the image preview not showing up
  because the image is hosted on UploadThing
*/
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
