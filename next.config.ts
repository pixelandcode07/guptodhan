// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '"static.vecteezy.com"',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;