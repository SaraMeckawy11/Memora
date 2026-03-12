/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'experimental-edge' runtime if you plan to use edge functions, otherwise default to nodejs
  // runtime: 'edge', 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  // Force rebuild comment
};

export default nextConfig;
