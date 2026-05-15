#!/usr/bin/env node
/**
 * docs/ctx/ 자동 재생성 스크립트
 * 사용: node scripts/update-ctx.js
 *
 * 생성 파일:
 *   docs/ctx/nugoona.md   — 누구나 디자인 시스템 (토큰 + 컴포넌트 + 규칙)
 *   docs/ctx/aurum.md     — 아우르메 디자인 시스템 (토큰 + 컴포넌트 + 규칙)
 *   docs/ctx/structure.md — 프로젝트 구조 + 기술 스택 비교
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CTX = path.join(ROOT, 'docs', 'ctx');

// ─── helpers ───

function readFile(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; }
}

function listFiles(dir, ext) {
  try {
    return fs.readdirSync(path.join(ROOT, dir))
      .filter(f => f.endsWith(ext) && !f.startsWith('.'))
      .sort();
  } catch { return []; }
}

function listDirs(dir) {
  try {
    return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name !== 'node_modules' && d.name !== '.next' && d.name !== 'out')
      .map(d => d.name)
      .sort();
  } catch { return []; }
}

function getFirstComment(filePath) {
  try {
    const lines = fs.readFileSync(path.join(ROOT, filePath), 'utf8').split('\n').slice(0, 20);
    for (const line of lines) {
      // // comment
      const m1 = line.match(/^\/\/\s*(.+)/);
      if (m1) return m1[1].trim();
      // /** comment or * comment
      const m2 = line.match(/^\s*\*\s+([^@*].+)/);
      if (m2) return m2[1].trim();
    }
    return '';
  } catch { return ''; }
}

function getDefaultExportName(filePath) {
  try {
    const src = fs.readFileSync(path.join(ROOT, filePath), 'utf8');
    const m = src.match(/export\s+default\s+function\s+(\w+)/);
    if (m) return m[1];
    const m2 = src.match(/export\s+default\s+(\w+)/);
    if (m2) return m2[1];
    return path.basename(filePath, path.extname(filePath));
  } catch { return path.basename(filePath, path.extname(filePath)); }
}

// ─── CSS Token Parser ───

function parseCSSTokens(cssContent, blockType) {
  const tokens = {};
  let inside = false;
  let braceDepth = 0;
  let currentCategory = '';
  let foundFirst = false;
  let insideMedia = false;

  const lines = cssContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip @media blocks (contain responsive overrides, not primary tokens)
    if (trimmed.startsWith('@media')) {
      insideMedia = true;
      continue;
    }
    if (insideMedia) {
      if (trimmed === '}') insideMedia = false;
      continue;
    }

    // Detect block start — only first occurrence
    if (blockType === '@theme' && trimmed.startsWith('@theme')) {
      // Skip `@theme inline` (shadcn internals)
      if (trimmed.includes('inline')) continue;
      if (foundFirst) continue;
      inside = true;
      braceDepth = 0;
      continue;
    }
    if (blockType === ':root' && trimmed.startsWith(':root')) {
      if (foundFirst) continue;
      inside = true;
      braceDepth = 0;
      continue;
    }

    if (inside) {
      braceDepth += (trimmed.match(/{/g) || []).length;
      braceDepth -= (trimmed.match(/}/g) || []).length;

      if (braceDepth <= 0 && trimmed.includes('}')) {
        inside = false;
        foundFirst = true;
        continue;
      }

      // Skip keyframes and nested blocks
      if (trimmed.startsWith('@keyframes') || trimmed.startsWith('@')) continue;
      if (trimmed === '{' || trimmed === '}') continue;

      // Category comments
      const commentMatch = trimmed.match(/\/\*\s*(.+?)\s*\*\//);
      if (commentMatch && !trimmed.includes('--')) {
        currentCategory = commentMatch[1].replace(/[=─\-]/g, '').trim();
        continue;
      }

      // Variable declarations
      const varMatch = trimmed.match(/^(--[\w-]+):\s*(.+?);?\s*$/);
      if (varMatch) {
        const name = varMatch[1];
        const value = varMatch[2].replace(/;$/, '').trim();
        if (!tokens[currentCategory]) tokens[currentCategory] = [];
        tokens[currentCategory].push({ name, value });
      }
    }
  }
  return tokens;
}

// ─── Component Scanner ───

function scanComponents(baseDir) {
  const result = {};
  const subDirs = listDirs(baseDir);

  for (const sub of subDirs) {
    const files = listFiles(`${baseDir}/${sub}`, '.tsx');
    if (files.length === 0) continue;

    result[sub] = files.map(f => {
      const fullPath = `${baseDir}/${sub}/${f}`;
      const name = getDefaultExportName(fullPath);
      const comment = getFirstComment(fullPath);
      return { file: f, name, comment };
    });
  }

  // Root-level tsx files
  const rootFiles = listFiles(baseDir, '.tsx');
  if (rootFiles.length > 0) {
    result['(root)'] = rootFiles.map(f => ({
      file: f,
      name: getDefaultExportName(`${baseDir}/${f}`),
      comment: getFirstComment(`${baseDir}/${f}`),
    }));
  }

  return result;
}

// ─── Page Scanner ───

function scanPages(appDir) {
  const pages = [];
  function walk(dir, prefix) {
    try {
      const entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true });
      for (const e of entries) {
        if (e.name === 'api' || e.name === 'node_modules') continue;
        if (e.isFile() && e.name === 'page.tsx') {
          pages.push(prefix || '/');
        }
        if (e.isDirectory()) {
          walk(`${dir}/${e.name}`, `${prefix}/${e.name}`);
        }
      }
    } catch {}
  }
  walk(appDir, '');
  return pages;
}

// ─── Nugoona Context ───

function generateNugoona() {
  const css = readFile('nugoona/app/globals.css');
  const tokens = parseCSSTokens(css, '@theme');
  const components = scanComponents('nugoona/components');
  const pages = scanPages('nugoona/app');

  const lines = [
    '# Nugoona Design System',
    '> auto-generated by `scripts/update-ctx.js` — 직접 수정하지 마라',
    '',
    '## 톤앤매너',
    '- **기조**: 미니멀 모노크롬 + 블루 악센트(#0070f3), 직각 모서리',
    '- **폰트**: Pretendard (한글) + Inter Tight (영문)',
    '- **기술**: Next.js + Tailwind v4 + Framer Motion',
    '',
  ];

  // Tokens
  lines.push('## Design Tokens (globals.css @theme)');
  lines.push('```css');
  for (const [category, vars] of Object.entries(tokens)) {
    if (category) lines.push(`/* ${category} */`);
    for (const { name, value } of vars) {
      // Skip keyframe/animation tokens
      if (name.startsWith('--animate-')) continue;
      lines.push(`${name}: ${value};`);
    }
    lines.push('');
  }
  lines.push('```');
  lines.push('');

  // Pages
  lines.push('## Pages');
  for (const p of pages) {
    lines.push(`- \`${p}\``);
  }
  lines.push('');

  // Components
  lines.push('## Components');
  let totalCount = 0;
  for (const [folder, comps] of Object.entries(components)) {
    lines.push(`### ${folder}/ (${comps.length})`);
    lines.push('| 컴포넌트 | 설명 |');
    lines.push('|----------|------|');
    for (const c of comps) {
      lines.push(`| ${c.name} | ${c.comment || '—'} |`);
      totalCount++;
    }
    lines.push('');
  }
  lines.push(`> 총 ${totalCount}개 컴포넌트`);
  lines.push('');

  // Design Rules (static template)
  lines.push('## Design Rules');
  lines.push('');
  lines.push('### Layout');
  lines.push('- 컨테이너: `OuterContainer` (max-w-1200px) → `Section` (noBorder/alt/dark/crossMarks)');
  lines.push('- 텍스트 영역: max-w-[720px] mx-auto');
  lines.push('- 섹션 패딩: Desktop px-12 py-16 / Mobile px-6 py-12');
  lines.push('- 그리드: Desktop 3-col → Mobile 1-col (max-md:grid-cols-1)');
  lines.push('- 반응형 분기: max-md: (900px), max-sm: (600px)');
  lines.push('');
  lines.push('### Typography');
  lines.push('- Hero: `text-[clamp(26px,5vw,56px)] font-bold`');
  lines.push('- Section: `text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.02em] leading-[1.15]`');
  lines.push('- Body: `text-[15px] font-light leading-[1.65]`');
  lines.push('- EN 악센트: `text-[13px] font-semibold tracking-[0.1em] uppercase` + font-en');
  lines.push('');
  lines.push('### Animation');
  lines.push('- 기본: `<FadeUp delay={0.1}>` (600-800ms, cubic-bezier)');
  lines.push('- 숫자: `<CounterUp target={N} />`');
  lines.push('- ease: `[0.16, 1, 0.3, 1]`');
  lines.push('');
  lines.push('### Dark Section');
  lines.push('- 배경: `linear-gradient(180deg, #0a0a0a, #151515)`');
  lines.push('- 텍스트: `text-white`, `text-white/80`');
  lines.push('- CTA: `bg-white text-text-primary`');
  lines.push('');
  lines.push('### 금지 사항');
  lines.push('1. border-radius 추가 금지 (전역 리셋, 예외: .rounded-pill, .rounded-dot)');
  lines.push('2. hex 하드코딩 금지 (Tailwind 토큰 클래스 사용)');
  lines.push('3. inline style={{ color/background }} 금지');
  lines.push('4. 1200px 초과 폭 금지');
  lines.push('5. clamp() 없는 헤딩 금지');
  lines.push('6. 콘텐츠 직접 작성 금지 (lib/content/*.ts에 분리)');
  lines.push('');

  return lines.join('\n');
}

// ─── Aurum Context ───

function generateAurum() {
  const css = readFile('aurum/src/app/globals.css');
  const tokens = parseCSSTokens(css, ':root');
  const components = scanComponents('aurum/src/components');
  const pages = scanPages('aurum/src/app');

  const lines = [
    '# Aurum Wellness Design System',
    '> auto-generated by `scripts/update-ctx.js` — 직접 수정하지 마라',
    '',
    '## 톤앤매너',
    '- **기조**: 럭셔리 웰니스, 골드(#c8a549) 웜톤, 세리프 중심, 넉넉한 여백',
    '- **폰트**: Arita Buri (헤딩) + Gowun Batang (본문) + Cormorant Garamond (디스플레이) + Pretendard (UI)',
    '- **기술**: Next.js + CSS Modules (Tailwind 아님) + GSAP + ScrollTrigger',
    '',
  ];

  // Tokens
  lines.push('## Design Tokens (globals.css :root)');
  lines.push('```css');
  for (const [category, vars] of Object.entries(tokens)) {
    if (category) lines.push(`/* ${category} */`);
    for (const { name, value } of vars) {
      lines.push(`${name}: ${value};`);
    }
    lines.push('');
  }
  lines.push('```');
  lines.push('');

  // Pages
  lines.push('## Pages');
  for (const p of pages) {
    lines.push(`- \`${p}\``);
  }
  lines.push('');

  // Components
  lines.push('## Components');
  let totalCount = 0;
  for (const [folder, comps] of Object.entries(components)) {
    lines.push(`### ${folder}/ (${comps.length})`);
    lines.push('| 컴포넌트 | 설명 |');
    lines.push('|----------|------|');
    for (const c of comps) {
      lines.push(`| ${c.name} | ${c.comment || '—'} |`);
      totalCount++;
    }
    lines.push('');
  }
  lines.push(`> 총 ${totalCount}개 컴포넌트`);
  lines.push('');

  // Design Rules (static template)
  lines.push('## Design Rules');
  lines.push('');
  lines.push('### Layout');
  lines.push('- CSS Modules (*.module.css) — Tailwind 사용 금지');
  lines.push('- 섹션: `.section` + `.container` (max-width: var(--max-content))');
  lines.push('- 패딩: var(--section-py) 120px → 80px@1200px → 60px@768px');
  lines.push('- 헤더 높이: var(--header-height) 80px → 64px@768px');
  lines.push('- 모바일 하단: MobileBookingBar 56px 고정');
  lines.push('');
  lines.push('### Typography');
  lines.push('- Heading: var(--font-heading) Arita Buri, weight 300-400');
  lines.push('- Body: var(--font-body) Gowun Batang, weight 400, line-height 1.6+');
  lines.push('- Display: var(--font-display) Cormorant Garamond');
  lines.push('- Label: var(--font-ui) Pretendard, 13px, letter-spacing 0.12em');
  lines.push('- Scale: clamp() 반응형 (--text-hero ~ --text-xs)');
  lines.push('');
  lines.push('### Animation');
  lines.push('- GSAP + ScrollTrigger (Framer Motion 아님)');
  lines.push('- ScrollReveal: IntersectionObserver 기반 fade-up (threshold 0.15)');
  lines.push('- 스태거: .reveal-delay-1 ~ .reveal-delay-4');
  lines.push('- Desktop pinning: ScrollTrigger.pin (시네마틱 히어로)');
  lines.push('- MagneticButton: 마우스 추적 탄성 효과');
  lines.push('');
  lines.push('### Buttons');
  lines.push('- `.btn--primary`: gold bg, white text');
  lines.push('- `.btn--secondary`: gray border, transparent');
  lines.push('- `.btn--ghost`: gold border, transparent');
  lines.push('- border-radius: 2px (최소)');
  lines.push('');
  lines.push('### 금지 사항');
  lines.push('1. Tailwind 사용 금지 (CSS Modules 전용)');
  lines.push('2. hex 하드코딩 금지 (var(--gold) 등 CSS 변수 사용)');
  lines.push('3. Framer Motion 사용 금지 (GSAP 사용)');
  lines.push('4. sans-serif를 heading에 사용 금지 (serif: Arita Buri)');
  lines.push('5. 둥근 모서리 남용 금지 (max 2px)');
  lines.push('6. header-height 무시 금지 (body padding-top 필수)');
  lines.push('');

  return lines.join('\n');
}

// ─── Structure Context ───

function generateStructure() {
  const nugoonaComps = scanComponents('nugoona/components');
  const aurumComps = scanComponents('aurum/src/components');

  const nugoonaTotal = Object.values(nugoonaComps).reduce((s, c) => s + c.length, 0);
  const aurumTotal = Object.values(aurumComps).reduce((s, c) => s + c.length, 0);

  const nugoonaPages = scanPages('nugoona/app');
  const aurumPages = scanPages('aurum/src/app');

  return `# Project Structure
> auto-generated by \`scripts/update-ctx.js\` — 직접 수정하지 마라

## 개요
두 개 브랜드 사이트를 하나의 레포에서 관리

| | Nugoona | Aurum |
|---|---------|-------|
| 경로 | nugoona/ | aurum/ |
| 포트 | :3101 | :3100 |
| 페이지 | ${nugoonaPages.length}개 (${nugoonaPages.join(', ')}) | ${aurumPages.length}개 (${aurumPages.join(', ')}) |
| 컴포넌트 | ${nugoonaTotal}개 | ${aurumTotal}개 |
| CSS | Tailwind v4 | CSS Modules |
| 애니메이션 | Framer Motion | GSAP + ScrollTrigger |
| 폰트 | 산세리프 (Pretendard) | 세리프 (Arita Buri) |
| 색상 | 모노크롬 + 블루 | 골드 + 웜뉴트럴 |
| 모서리 | 0px (global reset) | 2px |
| 빌드 | SSR (Cloud Run) | Static export |

## 디렉토리
\`\`\`
ngn_homepage/
├── aurum/              ← 아우르메 웰니스
│   ├── src/app/        ← 페이지 + globals.css
│   ├── src/components/ ← sections/ layout/ ui/
│   ├── src/data/       ← 콘텐츠 데이터
│   ├── src/fonts/      ← Pretendard VF
│   └── public/         ← 정적 자산
├── nugoona/            ← 누구나컴퍼니
│   ├── app/            ← 페이지 + globals.css
│   ├── components/     ← home/ layout/ ui/ motion/ features/
│   ├── lib/content/    ← 콘텐츠 데이터
│   └── public/         ← 정적 자산
├── scripts/            ← ctx 스크립트
├── docs/ctx/           ← 자동 생성 컨텍스트
├── next/               ← (레거시, 수정 금지)
└── static/             ← (레거시, 수정 금지)
\`\`\`

## 개발 서버
| 브랜드 | 명령 |
|--------|------|
| Aurum | \`cd aurum && npm run dev\` (port 3100) |
| Nugoona | \`cd nugoona && npm run dev\` (port 3101) |
`;
}

// ─── main ───

const useJson = process.argv.includes('--json');

let success = false;
let errorMsg = null;
let stats = null;

try {
  fs.mkdirSync(CTX, { recursive: true });

  const nugoonaContent = generateNugoona();
  const aurumContent = generateAurum();
  const structureContent = generateStructure();

  fs.writeFileSync(path.join(CTX, 'nugoona.md'), nugoonaContent);
  fs.writeFileSync(path.join(CTX, 'aurum.md'), aurumContent);
  fs.writeFileSync(path.join(CTX, 'structure.md'), structureContent);

  stats = {
    nugoona: nugoonaContent.length,
    aurum: aurumContent.length,
    structure: structureContent.length,
  };
  success = true;
} catch (err) {
  errorMsg = err && err.stack ? err.stack.split('\n')[0] : String(err);
}

if (useJson) {
  const output = success
    ? {
        continue: true,
        systemMessage:
          `[ctx] 갱신 OK · nugoona.md (${stats.nugoona}b) · aurum.md (${stats.aurum}b) · structure.md (${stats.structure}b)`,
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: `docs/ctx/ 3개 파일 자동 갱신됨 (nugoona/aurum/structure)`,
        },
      }
    : {
        continue: true,
        systemMessage: `[ctx] 갱신 실패 — ${errorMsg}`,
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: `WARNING: docs/ctx/ 자동 갱신 실패 — ${errorMsg}. 파일이 stale 상태일 수 있음.`,
        },
      };
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

if (success) {
  console.log('docs/ctx/ updated:');
  console.log(`  nugoona.md   (${stats.nugoona} bytes)`);
  console.log(`  aurum.md     (${stats.aurum} bytes)`);
  console.log(`  structure.md (${stats.structure} bytes)`);
} else {
  console.error('ERROR:', errorMsg);
  process.exit(1);
}
