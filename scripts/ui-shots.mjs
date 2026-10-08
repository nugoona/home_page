/*
  🖼 **누구나 홈페이지 화면 촬영기** (2026-08-29 신설)

  🔴 왜 만들었나: `CLAUDE.md`의 작업 플로우 정본(DESIGN §8.15)은
  *"카피 → 칸 설계 → Clone 발췌 → 메인 직접 구현 → **캡처 확인 루프**"* 를 요구하는데,
  이 저장소에는 **캡처를 자동으로 하는 도구가 하나도 없었다.** `scripts/`엔 `update-ctx.js` 뿐이고
  `package.json`에도 dev/build/start/lint 뿐이었다. 그래서 지금까지 사람이 손으로 찍어 왔고,
  그 흔적이 저장소 맨 위에 쌓인 `pricing-pc-v2/v3/v4/v5/v6.png` 다 — 버전이 6개까지 붙었다는 것은
  **확인 왕복이 그만큼 비쌌다**는 뜻이다.
  7월부터 멈춰 있는 다음 작업이 하필 **"모바일 홈 보수공사"**(PC 개편이 모바일에 미검증)인데,
  모바일을 찍는 수단이 없었다.

  쓰는 법:
    node scripts/ui-shots.mjs              (실제 페이지 전부 · 모바일+PC)
    node scripts/ui-shots.mjs 홈 가격        (이름/주소에 그 말이 든 것만)
    node scripts/ui-shots.mjs --lab         (그래픽 소스 갤러리 등 /lab/* 까지)
    node scripts/ui-shots.mjs --only=mobile (모바일만 · pc 도 가능)
    node scripts/ui-shots.mjs 홈 --slice     (긴 페이지를 화면 단위로 잘라 여러 장 — 판정용)
  결과: nugoona/public/ui-shots/*.png  +  nugoona/public/ui-shots.html
        폰에서 http://100.112.202.111:3131/ui-shots.html · PC에서 http://localhost:3131/ui-shots.html

  🛑 dev 서버(3131)가 떠 있어야 한다. `cd nugoona && npm run dev -- -p 3131`

  🔴🔴 **함정 — 그냥 fullPage로 찍으면 안 된다.**
  이 사이트는 등장 애니메이션(`components/motion/FadeUp.tsx`, framer-motion)이 화면에 들어올 때
  발동한다. 그냥 전체를 찍으면 **아직 안 들어온 섹션이 투명한 채로** 찍혀 "디자인이 깨진 것처럼"
  보인다. 해법은 `nugoona/DESIGN.md §8.15 "렌더 캡처 노하우"` 에 이미 실증돼 있다 —
  `[style*="opacity: 0"]{opacity:1!important}` 주입. 이 파일의 `settlePage` 가 그것을 쓴다.
  🛑 정본 경고 두 가지를 그대로 지킨다: **전역 opacity 강제 금지**(노이즈 왜곡) ·
     **스크롤 상태에서 캡처 = 백지**(반드시 맨 위로 되돌린 뒤 찍는다).

  🛑 결과물은 `.gitignore` 에 올려 두었다. 촬영본을 저장소에 커밋하지 마라 — 그게 루트가
     png 17개로 어질러진 원인이었다.
*/
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const BASE = process.env.UI_SHOTS_BASE || "http://localhost:3131";
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "nugoona", "public", "ui-shots");
const INDEX_HTML = path.join(ROOT, "nugoona", "public", "ui-shots.html");

/**
 * playwright 를 어디서 가져오나.
 * 🔑 `nugoona/package.json` 은 지금 **7월 미커밋 변경이 얹혀 있는 상태**라, 촬영기 하나 때문에
 *    거기에 의존성을 밀어 넣으면 남의 작업과 섞인다. 그래서 있는 것을 찾아 쓴다:
 *    ① nugoona 로컬(정식으로 설치하면 자동으로 이쪽) → ② 같은 PC의 ngn_upload(이미 설치돼 있음).
 *    나중에 `cd nugoona && npm i -D playwright` 하면 아무 것도 안 고쳐도 ①로 옮겨 간다.
 */
function loadPlaywright() {
  const candidates = [
    path.join(ROOT, "nugoona", "package.json"),
    "F:/github/ngn_upload/package.json",
  ];
  for (const anchor of candidates) {
    try {
      return createRequire(anchor)("playwright");
    } catch {
      /* 다음 후보 */
    }
  }
  console.error("\n🛑 playwright 를 찾지 못했습니다.");
  console.error("   nugoona 폴더에서 한 번만 설치하십시오:  npm i -D playwright\n");
  process.exit(1);
}

/**
 * 찍을 화면. 🛑 `/lab/*` 은 기본에서 뺀다 — 26개나 되고, 그것은 완성 화면이 아니라
 * **그래픽 소스 갤러리**(CLAUDE.md 작업 규칙: `/lab/sources` 33종 · `/lab/vercel` 10종)다.
 * 목업 재료를 고를 때만 `--lab` 으로 부른다.
 */
const PAGES = [
  { name: "01-홈", url: "/" },
  { name: "02-누구나콘텐츠", url: "/content" },
  { name: "03-누구나광고", url: "/ads" },
  { name: "04-기능", url: "/features" },
  { name: "05-요금", url: "/pricing" },
  { name: "06-회사소개", url: "/about" },
  { name: "07-시작하기", url: "/start" },
  { name: "08-스타일가이드", url: "/styles" },
  { name: "09-개인정보", url: "/privacy" },
  { name: "10-이용약관", url: "/terms" },
  // 시안 비교용 임시 페이지 — 낙점 후 원본 반영하면 이 줄과 app/ads2/ 를 함께 지운다
  { name: "11-광고시안", url: "/ads2" },
  { name: "12-콘텐츠시안", url: "/content2" },
  { name: "13-메인시안", url: "/home2" },
];

const LAB_PAGES = [
  { name: "lab-소스갤러리", url: "/lab/sources" },
  { name: "lab-버셀클론", url: "/lab/vercel" },
  { name: "lab-목록", url: "/lab" },
];

/** 사장님 폰 기준 폭과 PC 기준 폭. 둘 다 찍어야 "PC만 고치고 모바일은 방치"가 안 생긴다. */
const VIEWPORTS = [
  { key: "mobile", label: "모바일", width: 390, height: 844 },
  { key: "pc", label: "PC", width: 1280, height: 800 },
];

const args = process.argv.slice(2);
const withLab = args.includes("--lab");
/**
 * 긴 페이지를 화면 높이 단위로 잘라 여러 장으로 찍는다.
 * 🔴 왜 필요한가: 모바일 홈은 한 장으로 찍으면 **14,000px** 가 넘는다. 그 한 장을 열어 봐야
 *    글자 굵기도 여백도 판정할 수 없다(축소돼서 안 보인다). §8.9 의 "허용값" 을 눈으로 재려면
 *    화면에 실제로 보이는 만큼씩 잘라야 한다.
 */
const sliced = args.includes("--slice");
const onlyArg = args.find(a => a.startsWith("--only="));
const only = onlyArg ? onlyArg.split("=")[1].trim() : "";
const filters = args.filter(a => !a.startsWith("--"));

const targets = (withLab ? [...PAGES, ...LAB_PAGES] : PAGES).filter(p =>
  filters.length === 0 || filters.some(f => p.name.includes(f) || p.url.includes(f)),
);
const viewports = VIEWPORTS.filter(v => !only || v.key === only);

if (targets.length === 0) {
  console.error(`🛑 "${filters.join(" ")}" 에 해당하는 화면이 없습니다.`);
  console.error(`   있는 것: ${PAGES.map(p => p.name).join(" · ")}`);
  process.exit(1);
}

/**
 * 등장 애니메이션을 전부 노출시킨 뒤 맨 위로 돌려놓는다.
 *
 * 🔑 **1차 = 정본이 실증한 방법**(`nugoona/DESIGN.md §8.15 "렌더 캡처 노하우 (전부 실증)"`):
 *    `[style*="opacity: 0"]{opacity:1!important}` 를 주입한다. FadeUp(framer-motion)이 인라인
 *    스타일로 opacity 0을 걸어 두므로 이 선택자 하나로 전부 드러난다.
 *    🛑 **전역 `* { opacity: 1 }` 로 넓히지 마라** — 정본에 "노이즈 왜곡"이라 적혀 있다.
 *       일부러 반투명하게 만든 장식·마스크까지 불투명해져 실물과 다른 사진이 나온다.
 *
 * 🔑 **2차 = 스크롤 한 바퀴.** CSS로는 못 깨우는 것(ScrollTrigger 류, IntersectionObserver 로
 *    클래스를 붙이는 구현)이 남아 있어서 보조로 돈다.
 * 🛑 **반드시 맨 위로 되돌린 뒤 찍는다.** 정본 경고: *"스크롤 상태에서 캡처 = 백지."*
 */
async function settlePage(page) {
  await page.addStyleTag({
    content: `[style*="opacity: 0"]{opacity:1!important;transform:none!important}`,
  });
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 200));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
  });
  // 폰트·이미지가 자리를 잡을 시간. 이게 짧으면 글자 크기가 출렁인 채로 찍힌다.
  await page.waitForTimeout(600);
}

async function main() {
  const { chromium } = loadPlaywright();

  // dev 서버가 없으면 찍을 게 없다. 먼저 알려주고 끝낸다.
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    console.error(`\n🛑 ${BASE} 에 연결하지 못했습니다. dev 서버를 먼저 켜십시오:`);
    console.error("   cd nugoona && npm run dev -- -p 3131\n");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const shots = [];
  let failed = 0;

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2, // 흐릿한 사진으로는 글자 굵기·간격을 판정할 수 없다
      isMobile: vp.key === "mobile",
      hasTouch: vp.key === "mobile",
      locale: "ko-KR",
    });
    const page = await context.newPage();

    for (const target of targets) {
      process.stdout.write(`  ${vp.label} ${target.name} … `);
      try {
        await page.goto(BASE + target.url, { waitUntil: "networkidle", timeout: 45000 });
        await settlePage(page);

        if (sliced) {
          const total = await page.evaluate(() => document.body.scrollHeight);
          const cuts = Math.ceil(total / vp.height);
          for (let i = 0; i < cuts; i++) {
            const y = i * vp.height;
            const file = `${target.name}-${vp.key}-${String(i + 1).padStart(2, "0")}.png`;
            await page.screenshot({
              path: path.join(OUT_DIR, file),
              // 🛑 `fullPage` 를 함께 줘야 clip 좌표가 **문서 좌표**로 해석된다. 이걸 빼면
              //    뷰포트 좌표로 읽혀 두 번째 조각부터 같은 그림이 반복된다(정본 §8.15의
              //    "문서좌표 clip" 이 가리키는 지점).
              fullPage: true,
              clip: { x: 0, y, width: vp.width, height: Math.min(vp.height, total - y) },
            });
            const { size } = fs.statSync(path.join(OUT_DIR, file));
            shots.push({
              ...target,
              name: `${target.name} (${i + 1}/${cuts})`,
              vp: vp.key,
              vpLabel: vp.label,
              file,
              size,
            });
          }
          console.log(`✅ ${cuts}조각 (총 ${total}px)`);
        } else {
          const file = `${target.name}-${vp.key}.png`;
          await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
          const { size } = fs.statSync(path.join(OUT_DIR, file));
          shots.push({ ...target, vp: vp.key, vpLabel: vp.label, file, size });
          console.log(`✅ ${Math.round(size / 1024)}KB`);
        }
      } catch (e) {
        failed++;
        console.log(`❌ ${e.message.split("\n")[0].slice(0, 70)}`);
      }
    }
    await context.close();
  }
  await browser.close();

  writeIndex(shots);
  console.log(`\n📸 ${shots.length}장 저장 · 실패 ${failed}건`);
  console.log(`   PC   http://localhost:3131/ui-shots.html`);
  console.log(`   모바일 http://100.112.202.111:3131/ui-shots.html`);
}

/**
 * 한 장씩 열어보지 않고 **쭉 넘겨 보도록** 모아 주는 페이지. 확인 비용을 줄이는 게 목적이다.
 * 🔑 이번에 찍은 것만이 아니라 **폴더에 있는 사진 전부**를 담는다. 한 페이지만 다시 찍었다고
 *    나머지가 목록에서 사라지면, 사장님이 "아까 보이던 게 없어졌다"고 헛걸음하신다.
 */
function writeIndex(justShot) {
  const stamp = new Date().toLocaleString("ko-KR");
  const shots = fs
    .readdirSync(OUT_DIR)
    .filter(f => f.endsWith(".png"))
    .map(file => {
      // 파일명 = <페이지>-<mobile|pc>[-조각번호].png
      const m = file.match(/^(.+)-(mobile|pc)(?:-(\d+))?\.png$/);
      if (!m) return null;
      const [, name, vp, slice] = m;
      const known = justShot.find(s => s.file === file);
      return {
        name: slice ? `${name} (${Number(slice)})` : name,
        sortKey: `${name}-${slice ? slice.padStart(3, "0") : "000"}`,
        url: known?.url ?? "",
        vp,
        vpLabel: vp === "mobile" ? "모바일" : "PC",
        file,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey, "ko"));

  const byPage = new Map();
  for (const s of shots) {
    if (!byPage.has(s.name)) byPage.set(s.name, []);
    byPage.get(s.name).push(s);
  }
  const sections = [...byPage.entries()]
    .map(([name, list]) => {
      const cards = list
        .map(
          s => `      <figure>
        <figcaption>${s.vpLabel} · ${s.vp === "mobile" ? "390" : "1280"}px</figcaption>
        <a href="/ui-shots/${s.file}" target="_blank"><img src="/ui-shots/${s.file}" alt="${name} ${s.vpLabel}"></a>
      </figure>`,
        )
        .join("\n");
      return `  <section>
    <h2>${name} <small>${list[0].url || ""}</small></h2>
    <div class="row">
${cards}
    </div>
  </section>`;
    })
    .join("\n");

  fs.writeFileSync(
    INDEX_HTML,
    `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>누구나 홈페이지 화면 모음</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; padding:24px; background:#0b0b0c; color:#e9e9ea;
         font-family:-apple-system,'Pretendard','Segoe UI',sans-serif; }
  h1 { font-size:20px; margin:0 0 4px; }
  .stamp { color:#8a8a8f; font-size:13px; margin-bottom:28px; }
  section { margin-bottom:44px; }
  h2 { font-size:16px; margin:0 0 12px; font-weight:600; }
  h2 small { color:#8a8a8f; font-weight:400; margin-left:8px; }
  .row { display:flex; gap:16px; flex-wrap:wrap; align-items:flex-start; }
  figure { margin:0; flex:1 1 320px; min-width:280px; }
  figcaption { color:#8a8a8f; font-size:12px; margin-bottom:6px; }
  img { width:100%; border:1px solid #2a2a2e; border-radius:6px; display:block; background:#fff; }
</style></head><body>
<h1>누구나 홈페이지 화면 모음</h1>
<div class="stamp">${stamp} · ${shots.length}장 · 사진을 누르면 원본 크기</div>
${sections}
</body></html>
`,
    "utf-8",
  );
}

main().catch(e => {
  console.error("🛑", e);
  process.exit(1);
});
