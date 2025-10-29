import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1761638951887.cluster-utvmpwb6ojhlcsay7va6s7qkck.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
