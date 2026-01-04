import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'studio-3773255922-b8e2f',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:1086718943196:web:47cc924c6affced9e43919',
    NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyBc1jQPJTZ47RZzMj5fhow4xVcscI2KKk8',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'studio-3773255922-b8e2f.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-7E4W59K7E5',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1086718943196',
  },
};

export default nextConfig;
