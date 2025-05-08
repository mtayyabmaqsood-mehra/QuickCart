// /** @type {import('next').NextConfig} */
// module.exports = {
//     eslint: {
//       ignoreDuringBuilds: true,
//     },
//   };
  
// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'res.cloudinary.com',
//                 pathname: '**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'raw.githubusercontent.com',
//                 pathname: '**',
//             },
//         ],
//     },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          pathname: '**',
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  
