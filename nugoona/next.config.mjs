/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 개발 서버를 폰(LAN/Tailscale IP)에서 접속 허용 — 없으면 HMR 웹소켓이 403 차단돼 하이드레이션이 멈춤
  allowedDevOrigins: ['100.117.180.66'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'www.nugoona.co.kr' },
    ],
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/contents', destination: '/content', permanent: true },
      { source: '/dashboard', destination: '/features', permanent: true },
      { source: '/proposal', destination: '/pricing', permanent: true },
      { source: '/survey', destination: '/start', permanent: true },
      { source: '/contact', destination: '/start', permanent: true },
      { source: '/services', destination: '/features', permanent: true },
      { source: '/portfolio', destination: '/features', permanent: true },
      { source: '/technology', destination: '/features', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/services.html', destination: '/features', permanent: true },
      { source: '/portfolio.html', destination: '/features', permanent: true },
      { source: '/technology.html', destination: '/features', permanent: true },
      { source: '/proposal.html', destination: '/pricing', permanent: true },
      { source: '/survey.html', destination: '/start', permanent: true },
      { source: '/contact.html', destination: '/start', permanent: true },
    ];
  },
};

export default nextConfig;
