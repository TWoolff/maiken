/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ hostname: 'images.ctfassets.net' }],
	},
	experimental: {
		viewTransition: true,
	},
}

export default nextConfig
