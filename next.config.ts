import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "items-images-sandbox.s3.us-west-2.amazonaws.com", // 여기에 실제 이미지 도메인 입력
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
