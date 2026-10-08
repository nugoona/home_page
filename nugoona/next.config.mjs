/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 개발 서버를 폰(LAN/Tailscale IP)에서 접속 허용 — 없으면 HMR 웹소켓이 403 차단돼 하이드레이션이 멈춤
  // ★2026-10-08 테일스케일 주소가 바뀌어 교체(옛 100.117.180.66 → 100.112.202.111, `tailscale ip -4` 실측)
  //    옛 주소를 남겨 두면 폰에서 화면이 뜨고도 멈춘다. 주소가 또 바뀌면 여기부터 고칠 것.
  allowedDevOrigins: ['100.112.202.111'],
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
