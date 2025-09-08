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
                hostname: 'i.ibb.co.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'app-area.guptodhan.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;