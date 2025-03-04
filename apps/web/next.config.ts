import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.pinimg.com',
          port: '',
          pathname: '**',
          search: '',
        },
        {
          protocol: 'https',
          hostname: 'learnyst-user-assets.s3.ap-south-1.amazonaws.com',
          port: '',
          pathname: '**',
          search: '',
        },
        {
          protocol: 'https',
          hostname: 'critique-y.s3.ap-south-1.amazonaws.com',
          port: '',
          pathname: '**',
          search: '',
        },
      ],
    },
};

export default nextConfig;
