"use client";

/**
 * /lab/sources — 애니메이션 소스 갤러리 (⛔ 가공 금지 — 원본 그대로)
 * ⛔ 삭제 금지 = 재사용 자산(사장님 지시 2026-07-16). /lab/vercel과 함께 영구 디자인 소스. DESIGN §8.13 등록.
 *
 * Magic UI(magicui.design)·Aceternity UI(ui.aceternity.com) 컴포넌트를
 * registry JSON에서 받아 import 경로("motion/react"→"framer-motion")만 바꿔 나열.
 * 사장님이 보고 고르면 그때 우리 톤으로 가공한다. 여기서는 스타일 변경 금지.
 *
 * ▣ 구조 = 사이드바 목록 + 단일 프리뷰. 성능 목적상 "한 시점에 활성 애니메이션 = 1개".
 *   - 각 데모는 즉시 평가 JSX가 아니라 render:()=>JSX 함수. 선택된 1종만 호출→마운트된다.
 *   - 선택이 바뀌면 프리뷰 div의 key가 바뀌어 이전 것 언마운트 + 새 것 fresh 마운트(처음부터 재생).
 *   - 나머지 32종은 DOM에 없음 → rAF 루프 0개. (33종 동시 로드 버벅임 근본 해결)
 *
 * ⚠️ 원본 컴포넌트 코드는 훼손 금지. 마운트/성능 처리는 이 페이지 레벨에서만.
 * ⛔ 시안 금지 게이트: 데모 텍스트에 순위·성과 보장 표현 금지 / 파스텔·AI 슬롭 신규 생성 금지
 *   (외부 소스 고유 색은 "원본 그대로" 원칙으로 유지) / Vercel·Linear 문법 이식 아님(외부 소스 열람용).
 */

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { Instagram, Youtube, MessageSquare, Store, Search, PenLine, Hash, Video } from "lucide-react";

// ── Magic UI ──────────────────────────────────────────────
import { AnimatedBeam } from "@/components/lab-sources/magicui/animated-beam";
import { OrbitingCircles } from "@/components/lab-sources/magicui/orbiting-circles";
import { Ripple } from "@/components/lab-sources/magicui/ripple";
import { Particles } from "@/components/lab-sources/magicui/particles";
import { FlickeringGrid } from "@/components/lab-sources/magicui/flickering-grid";
import { Meteors as MagicMeteors } from "@/components/lab-sources/magicui/meteors";
import { AnimatedGridPattern } from "@/components/lab-sources/magicui/animated-grid-pattern";
import { DotPattern } from "@/components/lab-sources/magicui/dot-pattern";
import { GridPattern } from "@/components/lab-sources/magicui/grid-pattern";
import { RetroGrid } from "@/components/lab-sources/magicui/retro-grid";
import { BorderBeam } from "@/components/lab-sources/magicui/border-beam";
import { ShineBorder } from "@/components/lab-sources/magicui/shine-border";
import { WarpBackground } from "@/components/lab-sources/magicui/warp-background";
import { Marquee } from "@/components/lab-sources/magicui/marquee";
import { TextAnimate } from "@/components/lab-sources/magicui/text-animate";
import { Globe } from "@/components/lab-sources/magicui/globe";
import { IconCloud } from "@/components/lab-sources/magicui/icon-cloud";

// ── Aceternity UI ─────────────────────────────────────────
import { BackgroundBeams } from "@/components/lab-sources/aceternity/background-beams";
import { AuroraBackground } from "@/components/lab-sources/aceternity/aurora-background";
import { BackgroundLines } from "@/components/lab-sources/aceternity/background-lines";
import { Meteors as AceMeteors } from "@/components/lab-sources/aceternity/meteors";
import { Spotlight } from "@/components/lab-sources/aceternity/spotlight";
import { TracingBeam } from "@/components/lab-sources/aceternity/tracing-beam";
import { GlowingEffect } from "@/components/lab-sources/aceternity/glowing-effect";
import LampDemo from "@/components/lab-sources/aceternity/lamp";
import { HoverEffect } from "@/components/lab-sources/aceternity/card-hover-effect";
import { TextGenerateEffect } from "@/components/lab-sources/aceternity/text-generate-effect";
import { TypewriterEffectSmooth } from "@/components/lab-sources/aceternity/typewriter-effect";
import WorldMap from "@/components/lab-sources/aceternity/world-map";
import { GoogleGeminiEffect } from "@/components/lab-sources/aceternity/google-gemini-effect";
import { Vortex } from "@/components/lab-sources/aceternity/vortex";
import { SparklesCore } from "@/components/lab-sources/aceternity/sparkles";
import { WavyBackground } from "@/components/lab-sources/aceternity/wavy-background";

// ── 확충분(2026-07-17): 카드 콘텐츠 컨테이너 + 점·선 연결 ──
import { MagicCard } from "@/components/lab-sources/magicui/magic-card";
import { CardContainer, CardBody, CardItem } from "@/components/lab-sources/aceternity/3d-card";
import { FocusCards } from "@/components/lab-sources/aceternity/focus-cards";
import { CardStack } from "@/components/lab-sources/aceternity/card-stack";
import { CometCard } from "@/components/lab-sources/aceternity/comet-card";
import { GlareCard } from "@/components/lab-sources/aceternity/glare-card";
import { WobbleCard } from "@/components/lab-sources/aceternity/wobble-card";
import { DraggableCardContainer, DraggableCardBody } from "@/components/lab-sources/aceternity/draggable-card";
import ExpandableCardDemo from "@/components/lab-sources/aceternity/expandable-card";
import { Tilt } from "@/components/lab-sources/motion-primitives/tilt";
import { BorderTrail } from "@/components/lab-sources/motion-primitives/border-trail";
import { Spotlight as MPSpotlight } from "@/components/lab-sources/motion-primitives/spotlight";
import SpotlightCard from "@/components/lab-sources/reactbits/spotlight-card";
import TiltedCard from "@/components/lab-sources/reactbits/tilted-card";
import { MinimalCard, MinimalCardImage, MinimalCardTitle, MinimalCardDescription } from "@/components/lab-sources/cultui/minimal-card";
import { Expandable, ExpandableTrigger, ExpandableCard, ExpandableCardHeader, ExpandableCardContent } from "@/components/lab-sources/cultui/expandable-card";
import { GradientBeam } from "@/components/lab-sources/hextaui/gradient-beam";
import { FlipCardRoot, FlipCardFront, FlipCardBack } from "@/components/lab-sources/animata/flip-card";
import { SvgLineDraw } from "@/components/lab-sources/svg/line-draw";
import { SvgPathDotFlow } from "@/components/lab-sources/svg/path-dot-flow";
import { cn } from "@/lib/utils";

/* ─────────────────── Animated Beam 데모 래퍼 ─────────────────── */

const BeamNode = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex size-14 items-center justify-center rounded-full border-2 border-neutral-200 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] text-sm font-semibold text-neutral-700",
      className
    )}
  >
    {children}
  </div>
));
BeamNode.displayName = "BeamNode";

function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const r1Ref = useRef<HTMLDivElement>(null);
  const r2Ref = useRef<HTMLDivElement>(null);
  const r3Ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="relative flex h-[360px] w-full items-center justify-center overflow-hidden bg-white p-10"
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <BeamNode ref={leftRef}>글</BeamNode>
        </div>
        <div className="flex flex-col justify-center">
          <BeamNode ref={hubRef} className="size-16">
            NGN
          </BeamNode>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <BeamNode ref={r1Ref}>N</BeamNode>
          <BeamNode ref={r2Ref}>IG</BeamNode>
          <BeamNode ref={r3Ref}>YT</BeamNode>
        </div>
      </div>
      <AnimatedBeam containerRef={containerRef} fromRef={leftRef} toRef={hubRef} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={r1Ref} curvature={-60} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={r2Ref} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={r3Ref} curvature={60} />
    </div>
  );
}

/* ─────────────────── Google Gemini Effect 데모(스크롤) ─────────────────── */

function GeminiDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p0 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const p1 = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const p2 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const p3 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const p4 = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  return (
    <div ref={ref} className="relative h-[200vh] w-full overflow-clip bg-black">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <GoogleGeminiEffect
          pathLengths={[p0, p1, p2, p3, p4]}
          title="Google Gemini Effect"
          description="이 프리뷰 안을 스크롤하면 아래 SVG 선이 그려집니다 (데이터 흐름·연결 구조)"
        />
      </div>
    </div>
  );
}

/* ─────────────────── GlowingEffect 카드 래퍼 ─────────────────── */

function GlowCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative h-full rounded-2xl border border-neutral-300 p-2">
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-white p-6">
        <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}

/* Icon Cloud 데모용 아이콘 */
const CLOUD_ICONS = [
  <Instagram key="ig" />,
  <Youtube key="yt" />,
  <MessageSquare key="ms" />,
  <Store key="st" />,
  <Search key="se" />,
  <PenLine key="pl" />,
  <Hash key="ha" />,
  <Video key="vi" />,
];

/* World Map 데모용 연결선 (서울 허브 ↔ 국내·해외 노드) */
const WORLD_DOTS = [
  { start: { lat: 37.5665, lng: 126.978, label: "Seoul" }, end: { lat: 35.1796, lng: 129.0756 } },
  { start: { lat: 37.5665, lng: 126.978 }, end: { lat: 33.4996, lng: 126.5312 } },
  { start: { lat: 37.5665, lng: 126.978 }, end: { lat: 35.6762, lng: 139.6503 } },
  { start: { lat: 37.5665, lng: 126.978 }, end: { lat: 1.3521, lng: 103.8198 } },
  { start: { lat: 37.5665, lng: 126.978 }, end: { lat: 40.7128, lng: -74.006 } },
];

/* ─────────────── 그룹 D 데모 데이터 (금지 게이트: 순위·보장 표현 없음, 중립 문구만) ─────────────── */

const FOCUS_CARDS = [
  { title: "매장의 하루", src: "/img/content/hero-1.jpg" },
  { title: "시그니처 메뉴", src: "/img/content/hero-2.jpg" },
  { title: "공간과 좌석", src: "/img/content/hero-3.jpg" },
];

const CARD_STACK_ITEMS = [
  { id: 0, name: "카드 1", designation: "일정 간격으로 뒤로 넘어갑니다", content: <p>맨 위 카드가 뒤로 넘어가며 다음 카드가 올라옵니다. 후기·인용 나열에 쓰는 패턴입니다.</p> },
  { id: 1, name: "카드 2", designation: "자동 순환", content: <p>카드마다 임의 콘텐츠(사진·글)를 넣을 수 있습니다.</p> },
  { id: 2, name: "카드 3", designation: "스택 유지", content: <p>쌓인 느낌을 유지한 채 순환합니다.</p> },
];

function ThreeDCardDemo() {
  return (
    <CardContainer containerClassName="min-h-[480px] bg-neutral-100">
      <CardBody className="relative h-auto w-96 rounded-xl border border-neutral-200 bg-white p-6">
        <CardItem translateZ={50} className="text-xl font-bold text-neutral-800">
          호버하면 층이 떠오릅니다
        </CardItem>
        <CardItem as="p" translateZ={60} className="mt-2 max-w-sm text-sm text-neutral-500">
          제목·본문·사진·버튼이 각각 다른 깊이(translateZ)로 떠오르는 콘텐츠 카드
        </CardItem>
        <CardItem translateZ={100} className="mt-4 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/hero-1.jpg" alt="데모" className="h-52 w-full rounded-lg object-cover" />
        </CardItem>
        <CardItem translateZ={40} className="mt-5 rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white">
          버튼도 뜹니다
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

function CultExpandableDemo() {
  return (
    <div className="flex min-h-[480px] w-full items-center justify-center bg-neutral-100 p-8">
      <Expandable expandDirection="both" expandBehavior="replace">
        <ExpandableTrigger>
          <ExpandableCard
            collapsedSize={{ width: 320, height: 220 }}
            expandedSize={{ width: 460, height: 380 }}
            className="w-full"
          >
            <ExpandableCardHeader>
              <div className="text-sm font-semibold text-neutral-800">클릭하면 커집니다</div>
              <div className="mt-1 text-xs text-neutral-500">요약 ↔ 상세 전환 카드</div>
            </ExpandableCardHeader>
            <ExpandableCardContent>
              <p className="text-sm text-neutral-600">
                접힌 상태에는 요약만, 펼치면 상세 내용이 나타납니다. 임의 콘텐츠를 담을 수 있습니다.
              </p>
            </ExpandableCardContent>
          </ExpandableCard>
        </ExpandableTrigger>
      </Expandable>
    </div>
  );
}

function FlipCardDemo() {
  return (
    <div className="flex min-h-[480px] w-full items-center justify-center bg-white p-8">
      <FlipCardRoot rotate="y" className="h-80 w-64">
        <FlipCardFront>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/hero-2.jpg" alt="데모" className="h-full w-full rounded-lg object-cover" />
        </FlipCardFront>
        <FlipCardBack>
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-neutral-900 p-6 text-center">
            <p className="text-sm font-semibold text-white">뒷면</p>
            <p className="mt-2 text-xs text-neutral-400">호버하면 카드가 뒤집혀 상세가 보입니다</p>
          </div>
        </FlipCardBack>
      </FlipCardRoot>
    </div>
  );
}

/* ───────────────────────── 데이터: 53종 ───────────────────────── */

type Group = "A" | "B" | "C" | "D";
interface Item {
  id: string;
  group: Group;
  name: string;
  source: "Magic UI" | "Aceternity" | "Motion Primitives" | "React Bits" | "Cult UI" | "HextaUI" | "Animata" | "순수 SVG";
  usage: string;
  render: () => React.ReactNode;
}

const GROUPS: Record<Group, { title: string; note: string }> = {
  A: {
    title: "A · 다이어그램 · 네트워크 · 구조 설명형",
    note: "점·선·면으로 구조를 그림 (목업 우선순위)",
  },
  B: {
    title: "B · 배경 · 입자 · 질감",
    note: "섹션 뒤에 까는 분위기 배경",
  },
  C: {
    title: "C · 카드 강조 · 텍스트 연출",
    note: "테두리 발광·헤드라인·타이핑",
  },
  D: {
    title: "D · 콘텐츠 카드 (컨테이너)",
    note: "사진·내용을 담는 카드 + 절제된 인터랙션",
  },
};

const ITEMS: Item[] = [
  /* ───────── 그룹 A ───────── */
  {
    id: "A1",
    group: "A",
    name: "World Map",
    source: "Aceternity",
    usage: "지구본식 점선 세계지도 + 연결 빔 (허브→채널/지역 연결)",
    render: () => (
      <div className="w-full bg-white px-6 py-10">
        <WorldMap dots={WORLD_DOTS} lineColor="#0070f3" />
      </div>
    ),
  },
  {
    id: "A2",
    group: "A",
    name: "Globe",
    source: "Magic UI",
    usage: "회전 지구본(cobe) — 글로벌 노출·도달 표현",
    render: () => (
      <div className="relative flex h-[560px] w-full items-center justify-center overflow-hidden bg-neutral-950">
        <Globe />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,transparent,#0a0a0a)]" />
      </div>
    ),
  },
  {
    id: "A3",
    group: "A",
    name: "Icon Cloud",
    source: "Magic UI",
    usage: "3D 아이콘 구체 — 채널·업종을 구 형태로 (드래그 회전)",
    render: () => (
      <div className="flex h-[480px] w-full items-center justify-center bg-white">
        <IconCloud icons={CLOUD_ICONS} />
      </div>
    ),
  },
  {
    id: "A4",
    group: "A",
    name: "Animated Beam",
    source: "Magic UI",
    usage: "노드+연결선 (S4 채널 발행 = 글이 여러 채널로 흐름)",
    render: () => <AnimatedBeamDemo />,
  },
  {
    id: "A5",
    group: "A",
    name: "Orbiting Circles",
    source: "Magic UI",
    usage: "궤도 다이어그램 (중심=가게, 궤도=채널이 돎)",
    render: () => (
      <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-white">
        <span className="pointer-events-none text-2xl font-semibold text-neutral-900">누구나</span>
        <OrbitingCircles iconSize={40} radius={160}>
          <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-bold text-neutral-700">N</div>
          <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-bold text-neutral-700">IG</div>
          <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-bold text-neutral-700">YT</div>
          <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-bold text-neutral-700">BL</div>
        </OrbitingCircles>
        <OrbitingCircles iconSize={30} radius={90} reverse speed={2}>
          <div className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-[10px] font-bold text-neutral-700">글</div>
          <div className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-[10px] font-bold text-neutral-700">숏</div>
        </OrbitingCircles>
      </div>
    ),
  },
  {
    id: "A6",
    group: "A",
    name: "Google Gemini Effect",
    source: "Aceternity",
    usage: "SVG path 흐름 (스크롤에 따라 선이 그려짐 = 파이프라인/흐름)",
    render: () => <GeminiDemo />,
  },
  {
    id: "A7",
    group: "A",
    name: "Tracing Beam",
    source: "Aceternity",
    usage: "스크롤 따라 그려지는 선 (철학·스토리 롱폼 옆 진행선)",
    render: () => (
      <div className="bg-white py-10">
        <TracingBeam className="px-6">
          <div className="relative mx-auto max-w-2xl pt-4 antialiased">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-10">
                <h3 className="mb-2 w-fit rounded-full bg-neutral-900 px-4 py-1 text-sm text-white">단락 {i}</h3>
                <p className="text-sm leading-7 text-neutral-600">
                  프리뷰 안을 스크롤하면 왼쪽 선이 진행도에 맞춰 그려집니다. 긴 글(브랜드 철학, 우리가
                  일하는 방식) 옆에 붙이는 용도의 컴포넌트입니다. 이 문단은 데모용 채움 글입니다. 스크롤
                  진행에 따라 그라디언트 점이 따라 내려오는 것을 확인할 수 있습니다.
                </p>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    ),
  },

  {
    id: "A8",
    group: "A",
    name: "SVG Line Draw",
    source: "순수 SVG",
    usage: "카드 사이 선이 그려짐 (의존성 0 — 좌표를 §8.16 그리드에 직접 앉힘)",
    render: () => <SvgLineDraw />,
  },
  {
    id: "A9",
    group: "A",
    name: "SVG Path Dot Flow",
    source: "순수 SVG",
    usage: "고정 선 위로 점이 흐름 = 데이터가 A→B로 (SMIL, JS 0)",
    render: () => <SvgPathDotFlow />,
  },
  {
    id: "A10",
    group: "A",
    name: "Gradient Beam",
    source: "HextaUI",
    usage: "수평선 위로 빛줄기가 지나감 (구분선·연결선에 흐름감)",
    render: () => (
      <div className="flex h-[360px] w-full flex-col items-center justify-center gap-10 bg-white px-8">
        <GradientBeam width={640} height={40} />
        <GradientBeam width={640} height={40} gradientColors={["#0070f3", "#0070f3", "#00c2ff"]} animationDuration={3} />
      </div>
    ),
  },

  /* ───────── 그룹 B ───────── */
  {
    id: "B1",
    group: "B",
    name: "Background Beams",
    source: "Aceternity",
    usage: "다크 CTA 배경(흐르는 곡선 빔)",
    render: () => (
      <div className="relative flex h-[460px] w-full flex-col items-center justify-center bg-neutral-950 antialiased">
        <div className="z-10 text-center">
          <p className="text-2xl font-semibold text-white">Background Beams</p>
          <p className="mt-2 text-sm text-neutral-400">곡선 경로를 따라 빔이 흐릅니다</p>
        </div>
        <BackgroundBeams />
      </div>
    ),
  },
  {
    id: "B2",
    group: "B",
    name: "Aurora Background",
    source: "Aceternity",
    usage: "라이트 히어로 배경(오로라)",
    render: () => (
      <AuroraBackground className="h-[500px]">
        <div className="relative z-10 text-center">
          <p className="text-3xl font-semibold text-neutral-900">Aurora Background</p>
          <p className="mt-2 text-sm text-neutral-600">뒤에서 오로라가 천천히 흐릅니다</p>
        </div>
      </AuroraBackground>
    ),
  },
  {
    id: "B3",
    group: "B",
    name: "Background Lines",
    source: "Aceternity",
    usage: "히어로 배경(그려지는 선 다발)",
    render: () => (
      <BackgroundLines className="flex h-[500px] w-full flex-col items-center justify-center px-4">
        <p className="relative z-20 text-3xl font-semibold text-neutral-900">Background Lines</p>
        <p className="relative z-20 mt-2 text-sm text-neutral-600">색색의 선이 계속 그려집니다</p>
      </BackgroundLines>
    ),
  },
  {
    id: "B4",
    group: "B",
    name: "Vortex",
    source: "Aceternity",
    usage: "소용돌이 입자 흐름(simplex-noise) — 다크 임팩트 배경",
    render: () => (
      <Vortex containerClassName="h-[460px] w-full" className="flex h-full w-full flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-white">Vortex</span>
        <span className="mt-2 text-sm text-neutral-300">입자가 소용돌이치는 배경</span>
      </Vortex>
    ),
  },
  {
    id: "B5",
    group: "B",
    name: "Sparkles",
    source: "Aceternity",
    usage: "반짝이 입자(tsparticles) — 다크 히어로 하단 발광",
    render: () => (
      <div className="relative flex h-[440px] w-full flex-col items-center justify-center overflow-hidden bg-black">
        <span className="z-10 text-2xl font-semibold text-white">Sparkles</span>
        <div className="absolute inset-0">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={100}
            className="h-full w-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>
    ),
  },
  {
    id: "B6",
    group: "B",
    name: "Wavy Background",
    source: "Aceternity",
    usage: "파도 웨이브 배경(simplex-noise) — 히어로 배경",
    render: () => (
      <WavyBackground containerClassName="h-[460px] w-full" className="mx-auto max-w-4xl">
        <p className="text-center text-3xl font-semibold text-white">Wavy Background</p>
        <p className="mt-2 text-center text-sm text-neutral-200">파도가 물결치는 배경</p>
      </WavyBackground>
    ),
  },
  {
    id: "B7",
    group: "B",
    name: "Ripple",
    source: "Magic UI",
    usage: "CTA·중심 강조 배경(맥박)",
    render: () => (
      <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-white">
        <span className="z-10 text-2xl font-semibold text-neutral-900">Ripple</span>
        <Ripple />
      </div>
    ),
  },
  {
    id: "B8",
    group: "B",
    name: "Particles",
    source: "Magic UI",
    usage: "다크 히어로·CTA 배경 입자",
    render: () => (
      <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-neutral-950">
        <span className="z-10 text-2xl font-semibold text-white">Particles</span>
        <Particles className="absolute inset-0 z-0" quantity={120} ease={80} color="#ffffff" refresh />
      </div>
    ),
  },
  {
    id: "B9",
    group: "B",
    name: "Flickering Grid",
    source: "Magic UI",
    usage: "섹션 배경 질감(데이터 느낌)",
    render: () => (
      <div className="relative h-[420px] w-full overflow-hidden bg-white">
        <FlickeringGrid
          className="absolute inset-0 z-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>
    ),
  },
  {
    id: "B10",
    group: "B",
    name: "Meteors",
    source: "Magic UI",
    usage: "다크 카드 포인트(유성)",
    render: () => (
      <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-neutral-950">
        <MagicMeteors number={30} />
        <span className="z-10 text-2xl font-semibold text-white">Meteors</span>
      </div>
    ),
  },
  {
    id: "B11",
    group: "B",
    name: "Meteors (card)",
    source: "Aceternity",
    usage: "카드 안에서 떨어지는 유성",
    render: () => (
      <div className="flex h-[420px] w-full items-center justify-center bg-neutral-950">
        <div className="relative w-full max-w-sm">
          <div className="relative flex h-64 flex-col items-start justify-end overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-8 shadow-xl">
            <h3 className="relative z-50 mb-2 text-xl font-bold text-white">Meteors Card</h3>
            <p className="relative z-50 text-sm text-neutral-400">카드 안에서 유성이 떨어집니다.</p>
            <AceMeteors number={20} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "B12",
    group: "B",
    name: "Animated Grid Pattern",
    source: "Magic UI",
    usage: "히어로 배경 패턴(반짝이는 격자)",
    render: () => (
      <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-white">
        <span className="z-10 text-2xl font-semibold text-neutral-900">Animated Grid</span>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
      </div>
    ),
  },
  {
    id: "B13",
    group: "B",
    name: "Dot Pattern",
    source: "Magic UI",
    usage: "라이트 섹션 배경(도트)",
    render: () => (
      <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden bg-white">
        <span className="z-10 text-2xl font-semibold text-neutral-900">Dot Pattern</span>
        <DotPattern className="[mask-image:radial-gradient(320px_circle_at_center,white,transparent)]" />
      </div>
    ),
  },
  {
    id: "B14",
    group: "B",
    name: "Grid Pattern",
    source: "Magic UI",
    usage: "라이트 섹션 배경(격자+칸 채움)",
    render: () => (
      <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden bg-white">
        <span className="z-10 text-2xl font-semibold text-neutral-900">Grid Pattern</span>
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
          ]}
          className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        />
      </div>
    ),
  },
  {
    id: "B15",
    group: "B",
    name: "Retro Grid",
    source: "Magic UI",
    usage: "히어로 하단 원근 그리드(WebGL)",
    render: () => (
      <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-white">
        <span className="z-10 text-2xl font-semibold text-neutral-900">Retro Grid</span>
        <RetroGrid />
      </div>
    ),
  },

  /* ───────── 그룹 C ───────── */
  {
    id: "C1",
    group: "C",
    name: "Border Beam",
    source: "Magic UI",
    usage: "강조 카드 테두리(빛이 도는 선)",
    render: () => (
      <div className="flex h-[400px] w-full items-center justify-center bg-white">
        <div className="relative flex h-48 w-96 flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <span className="text-xl font-semibold text-neutral-900">Border Beam</span>
          <BorderBeam duration={6} size={100} />
        </div>
      </div>
    ),
  },
  {
    id: "C2",
    group: "C",
    name: "Shine Border",
    source: "Magic UI",
    usage: "강조 카드 테두리(그라디언트 광택)",
    render: () => (
      <div className="flex h-[400px] w-full items-center justify-center bg-white">
        <div className="relative flex h-48 w-96 flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          <span className="text-xl font-semibold text-neutral-900">Shine Border</span>
        </div>
      </div>
    ),
  },
  {
    id: "C3",
    group: "C",
    name: "Glowing Effect",
    source: "Aceternity",
    usage: "기능 카드(마우스 따라 테두리 발광)",
    render: () => (
      <div className="grid grid-cols-1 gap-4 bg-white p-10 md:grid-cols-2">
        <GlowCard title="Glowing Effect A" desc="마우스를 카드 근처로 가져가면 테두리가 마우스를 따라 빛납니다." />
        <GlowCard title="Glowing Effect B" desc="카드 여러 장에 동시에 적용해도 각자 반응합니다." />
      </div>
    ),
  },
  {
    id: "C4",
    group: "C",
    name: "Warp Background",
    source: "Magic UI",
    usage: "임팩트 섹션 배경(빔 격자 터널)",
    render: () => (
      <div className="bg-white p-8">
        <WarpBackground gridColor="rgba(0,0,0,0.08)">
          <div className="mx-auto flex w-80 flex-col items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white p-6">
            <span className="text-lg font-semibold text-neutral-900">Warp Background</span>
            <span className="text-sm text-neutral-500">카드 뒤로 빔이 지나갑니다</span>
          </div>
        </WarpBackground>
      </div>
    ),
  },
  {
    id: "C5",
    group: "C",
    name: "Lamp",
    source: "Aceternity",
    usage: "다크 섹션 헤드라인 연출(램프 점등)",
    render: () => <LampDemo />,
  },
  {
    id: "C6",
    group: "C",
    name: "Card Hover Effect",
    source: "Aceternity",
    usage: "기능 카드 목록(호버 시 배경 따라오기)",
    render: () => (
      <div className="bg-neutral-950 px-8 py-8">
        <HoverEffect
          items={[
            { title: "카드 1", description: "마우스를 올리면 배경이 부드럽게 따라옵니다.", link: "#card-1" },
            { title: "카드 2", description: "기능 카드 목록에 쓰는 인터랙션입니다.", link: "#card-2" },
            { title: "카드 3", description: "호버 배경이 카드 사이를 이동합니다.", link: "#card-3" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "C7",
    group: "C",
    name: "Spotlight",
    source: "Aceternity",
    usage: "다크 히어로(스포트라이트 등장)",
    render: () => (
      <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden bg-black/[0.96] antialiased">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        <div className="relative z-10 text-center">
          <p className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent">
            Spotlight
          </p>
          <p className="mt-2 text-sm text-neutral-400">왼쪽 위에서 조명이 켜집니다 (선택 시 재생)</p>
        </div>
      </div>
    ),
  },
  {
    id: "C8",
    group: "C",
    name: "Marquee",
    source: "Magic UI",
    usage: "채널·업종 로고 롤링(무한 흐름)",
    render: () => (
      <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden bg-white py-8">
        <Marquee pauseOnHover className="[--duration:20s]">
          {["네이버 블로그", "인스타그램", "유튜브 쇼츠", "스레드", "틱톡", "페이스북"].map((t) => (
            <div key={t} className="mx-2 flex h-16 w-44 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700">
              {t}
            </div>
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {["카페", "미용실", "필라테스", "정형외과", "학원", "네일샵"].map((t) => (
            <div key={t} className="mx-2 flex h-16 w-44 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700">
              {t}
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
      </div>
    ),
  },
  {
    id: "C9",
    group: "C",
    name: "Text Animate",
    source: "Magic UI",
    usage: "섹션 헤드라인 등장(단어·글자 단위)",
    render: () => (
      <div className="flex h-[300px] w-full items-center justify-center bg-white">
        <TextAnimate animation="blurInUp" by="character" once className="text-3xl font-semibold text-neutral-900">
          글이 계속 쌓이는 가게
        </TextAnimate>
      </div>
    ),
  },
  {
    id: "C10",
    group: "C",
    name: "Text Generate Effect",
    source: "Aceternity",
    usage: "헤드라인 서서히 등장(단어 블러 인)",
    render: () => (
      <div className="flex h-[300px] w-full items-center justify-center bg-white px-6">
        <TextGenerateEffect words="사장님은 장사만 하세요. 글은 계속 쌓입니다." className="text-center" />
      </div>
    ),
  },
  {
    id: "C11",
    group: "C",
    name: "Typewriter Effect",
    source: "Aceternity",
    usage: "히어로 타이핑 헤드라인",
    render: () => (
      <div className="flex h-[300px] w-full flex-col items-center justify-center bg-white">
        <TypewriterEffectSmooth
          words={[
            { text: "누구나" },
            { text: "만드는" },
            { text: "콘텐츠", className: "text-blue-600" },
          ]}
        />
      </div>
    ),
  },

  /* ───────── 그룹 D · 콘텐츠 카드 (2026-07-17 확충) ───────── */
  {
    id: "D1",
    group: "D",
    name: "Magic Card",
    source: "Magic UI",
    usage: "커서 따라 스포트라이트 + 테두리 하이라이트 (기본 모노크롬 카드)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center gap-6 bg-neutral-100 p-8 max-md:flex-col">
        {[1, 2].map((i) => (
          <MagicCard key={i} className="rounded-xl">
            <div className="w-72 p-8">
              <p className="text-lg font-semibold text-neutral-900">카드 {i}</p>
              <p className="mt-2 text-sm text-neutral-500">
                마우스를 올리고 움직여 보세요. 커서 주변만 은은하게 밝아지고 테두리가 따라옵니다.
              </p>
            </div>
          </MagicCard>
        ))}
      </div>
    ),
  },
  {
    id: "D2",
    group: "D",
    name: "3D Card Effect",
    source: "Aceternity",
    usage: "호버 시 원근 기울기 + 내부 요소가 깊이별로 떠오름 (대표 콘텐츠 카드)",
    render: () => <ThreeDCardDemo />,
  },
  {
    id: "D3",
    group: "D",
    name: "Focus Cards",
    source: "Aceternity",
    usage: "그리드에서 호버한 카드만 선명, 나머지 블러 (사진 그리드)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center bg-white px-6 py-10">
        <FocusCards cards={FOCUS_CARDS} />
      </div>
    ),
  },
  {
    id: "D4",
    group: "D",
    name: "Tilt",
    source: "Motion Primitives",
    usage: "어떤 카드에든 씌우는 미세 3D 기울기 래퍼 (스프링)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-white p-8">
        <Tilt rotationFactor={8} className="w-72">
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/hero-3.jpg" alt="데모" className="h-44 w-full object-cover" />
            <div className="p-5">
              <p className="text-base font-semibold text-neutral-900">기존 카드에 래핑</p>
              <p className="mt-1 text-sm text-neutral-500">마우스 방향으로 살짝 기웁니다</p>
            </div>
          </div>
        </Tilt>
      </div>
    ),
  },
  {
    id: "D5",
    group: "D",
    name: "Spotlight Card",
    source: "React Bits",
    usage: "커서 위치에 빛이 카드 안에 번짐 (다크 카드, 의존성 0)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-neutral-950 p-8">
        <SpotlightCard className="w-80" spotlightColor="rgba(0, 112, 243, 0.25)">
          <p className="text-lg font-semibold text-white">다크 카드</p>
          <p className="mt-2 text-sm text-neutral-400">
            마우스를 움직이면 커서 위치를 따라 빛이 카드 안에서 번집니다.
          </p>
        </SpotlightCard>
      </div>
    ),
  },
  {
    id: "D6",
    group: "D",
    name: "MinimalCard",
    source: "Cult UI",
    usage: "절제된 이미지+제목 카드 (다층 그림자 마감)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-neutral-100 p-8">
        <div className="w-80">
          <MinimalCard>
            <MinimalCardImage src="/img/content/hero-2.jpg" alt="데모" />
            <MinimalCardTitle>카드 제목</MinimalCardTitle>
            <MinimalCardDescription>얇은 다층 그림자로 마감한 미니멀 이미지 카드입니다.</MinimalCardDescription>
          </MinimalCard>
        </div>
      </div>
    ),
  },
  {
    id: "D7",
    group: "D",
    name: "Card Stack",
    source: "Aceternity",
    usage: "쌓인 카드가 일정 간격으로 뒤로 넘어가며 순환 (후기·인용)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-white p-8">
        <CardStack items={CARD_STACK_ITEMS} />
      </div>
    ),
  },
  {
    id: "D8",
    group: "D",
    name: "Comet Card",
    source: "Aceternity",
    usage: "원근 3D 틸트 + 은은한 광택 (콘텐츠 컨테이너)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-neutral-950 p-8">
        <CometCard>
          <div className="w-72 rounded-2xl bg-neutral-900 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/content/hero-1.jpg" alt="데모" className="h-48 w-full rounded-xl object-cover" />
            <p className="mt-4 text-base font-semibold text-white">호버해 보세요</p>
            <p className="mt-1 text-sm text-neutral-400">기울기와 광택이 함께 움직입니다</p>
          </div>
        </CometCard>
      </div>
    ),
  },
  {
    id: "D9",
    group: "D",
    name: "Glare Card",
    source: "Aceternity",
    usage: "호버 시 표면에 광택이 스침 (Linear식 글레어)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-neutral-950 p-8">
        <GlareCard className="flex flex-col items-start justify-end p-6">
          <p className="text-lg font-semibold text-white">글레어 카드</p>
          <p className="mt-1 text-sm text-neutral-400">호버하면 포일 광택이 표면을 스칩니다</p>
        </GlareCard>
      </div>
    ),
  },
  {
    id: "D10",
    group: "D",
    name: "Wobble Card",
    source: "Aceternity",
    usage: "마우스 이동에 카드가 살짝 흔들리며 확대",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-white p-8">
        <WobbleCard containerClassName="max-w-md bg-blue-900">
          <p className="text-lg font-semibold text-white">워블 카드</p>
          <p className="mt-2 text-sm text-blue-100">
            마우스를 올리고 움직이면 카드 전체가 부드럽게 따라 흔들립니다.
          </p>
        </WobbleCard>
      </div>
    ),
  },
  {
    id: "D11",
    group: "D",
    name: "Draggable Card",
    source: "Aceternity",
    usage: "드래그해서 던질 수 있는 카드 (관성·경계 반동)",
    render: () => (
      <DraggableCardContainer className="relative flex min-h-[480px] w-full items-center justify-center overflow-clip bg-neutral-100">
        <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-base font-semibold text-neutral-400">
          카드를 잡아서 던져 보세요
        </p>
        <DraggableCardBody>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/content/hero-3.jpg" alt="데모" className="pointer-events-none relative z-10 h-64 w-64 rounded-md object-cover" />
          <p className="mt-4 text-center text-lg font-semibold text-neutral-700">드래그 카드</p>
        </DraggableCardBody>
      </DraggableCardContainer>
    ),
  },
  {
    id: "D12",
    group: "D",
    name: "Expandable Card (모달)",
    source: "Aceternity",
    usage: "클릭하면 카드가 그 자리에서 모달로 확대 (layoutId 전환)",
    render: () => (
      <div className="min-h-[480px] w-full bg-white px-4 py-10">
        <ExpandableCardDemo />
      </div>
    ),
  },
  {
    id: "D13",
    group: "D",
    name: "Expandable Card (인라인)",
    source: "Cult UI",
    usage: "클릭하면 카드 크기가 커지며 상세가 나타남 (요약↔상세)",
    render: () => <CultExpandableDemo />,
  },
  {
    id: "D14",
    group: "D",
    name: "Tilted Card",
    source: "React Bits",
    usage: "이미지 카드 3D 틸트 + 살짝 확대 (사진 중심)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-white p-8">
        <TiltedCard
          imageSrc="/img/content/hero-2.jpg"
          altText="데모"
          captionText="틸트 카드"
          containerHeight="320px"
          containerWidth="320px"
          imageHeight="320px"
          imageWidth="320px"
          rotateAmplitude={12}
          scaleOnHover={1.08}
          showMobileWarning={false}
          showTooltip
        />
      </div>
    ),
  },
  {
    id: "D15",
    group: "D",
    name: "Flip Card",
    source: "Animata",
    usage: "호버 시 앞→뒤 플립 (양면 콘텐츠)",
    render: () => <FlipCardDemo />,
  },
  {
    id: "D16",
    group: "D",
    name: "Border Trail",
    source: "Motion Primitives",
    usage: "테두리를 따라 빛 한 줄기가 순환 (카드 강조)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-white p-8">
        <div className="relative h-[220px] w-80 overflow-hidden rounded-md border border-neutral-200 bg-white px-6 py-5">
          <BorderTrail className="bg-blue-500" size={80} />
          <p className="text-base font-semibold text-neutral-900">보더 트레일</p>
          <p className="mt-2 text-sm text-neutral-500">
            테두리를 따라 빛 조각이 계속 돕니다. 내용은 카드 안에 그대로 둡니다.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "D17",
    group: "D",
    name: "Spotlight (커서 추적)",
    source: "Motion Primitives",
    usage: "카드 위를 스포트라이트가 커서 따라 이동 (그룹에도 적용 가능)",
    render: () => (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-neutral-950 p-8">
        <div className="relative aspect-video w-96 overflow-hidden rounded-xl bg-neutral-900 p-8">
          <MPSpotlight className="bg-blue-400/30 blur-2xl" size={220} />
          <div className="relative">
            <p className="text-lg font-semibold text-white">스포트라이트</p>
            <p className="mt-2 text-sm text-neutral-400">마우스를 움직이면 빛 웅덩이가 따라옵니다.</p>
          </div>
        </div>
      </div>
    ),
  },
];

const GROUP_ORDER: Group[] = ["A", "B", "C", "D"];

const SRC_ABBR: Record<Item["source"], string> = {
  "Magic UI": "MUI",
  Aceternity: "ACE",
  "Motion Primitives": "MP",
  "React Bits": "RB",
  "Cult UI": "CULT",
  HextaUI: "HEX",
  Animata: "ANI",
  "순수 SVG": "SVG",
};

/* ───────────────────────── 페이지 ───────────────────────── */

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState("A1"); // 기본 = A1 World Map
  const [mobileGroup, setMobileGroup] = useState<Group>("A"); // 모바일 탭 전용 그룹 상태
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="bg-white p-6 font-mono text-sm text-neutral-500">
        /lab/sources 로딩 중…
      </main>
    );
  }

  const selected = ITEMS.find((it) => it.id === selectedId) ?? ITEMS[0];

  return (
    <main className="lab-sources-scope flex min-h-screen flex-col bg-white md:flex-row">
      {/* ─── 데스크탑 사이드바 ─── */}
      <aside className="hidden shrink-0 border-r border-neutral-200 md:sticky md:top-0 md:flex md:h-screen md:w-72 md:flex-col md:overflow-y-auto">
        <div className="border-b border-neutral-200 px-4 py-4">
          <h1 className="font-mono text-[13px] font-bold text-neutral-800">/lab/sources</h1>
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-neutral-500">
            애니메이션 소스 53종 (원본 그대로). 한 번에 1개만 재생됩니다.
          </p>
        </div>
        {GROUP_ORDER.map((g) => (
          <div key={g}>
            <div className="bg-neutral-900 px-4 py-2">
              <div className="font-mono text-[11px] font-bold text-white">{GROUPS[g].title}</div>
              <div className="mt-0.5 font-mono text-[10px] text-neutral-400">{GROUPS[g].note}</div>
            </div>
            <ul>
              {ITEMS.filter((it) => it.group === g).map((it) => {
                const active = it.id === selectedId;
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => setSelectedId(it.id)}
                      className={cn(
                        "flex w-full items-baseline gap-2 border-b border-neutral-100 px-4 py-2 text-left transition-colors",
                        active ? "bg-blue-600 text-white" : "text-neutral-700 hover:bg-neutral-100"
                      )}
                    >
                      <span className={cn("font-mono text-[11px]", active ? "text-blue-100" : "text-neutral-400")}>
                        {it.id}
                      </span>
                      <span className="flex-1 text-[13px] font-medium">{it.name}</span>
                      <span className={cn("font-mono text-[10px]", active ? "text-blue-100" : "text-neutral-400")}>
                        {SRC_ABBR[it.source]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* ─── 프리뷰 영역 ─── */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* 모바일: A/B/C/D 그룹 탭 + 선택된 그룹 항목 드롭다운 */}
        <div className="border-b border-neutral-200 md:hidden">
          {/* 그룹 탭 4개 */}
          <div className="flex">
            {GROUP_ORDER.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setMobileGroup(g);
                  const first = ITEMS.find((it) => it.group === g);
                  if (first) setSelectedId(first.id);
                }}
                className={cn(
                  "flex-1 border-b-2 py-3 font-mono text-[13px] font-semibold transition-colors",
                  mobileGroup === g
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-neutral-400"
                )}
              >
                {g}
              </button>
            ))}
          </div>
          {/* 해당 그룹 항목만 드롭다운 */}
          <div className="p-3">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border border-neutral-300 bg-white px-3 py-2 font-mono text-[13px] text-neutral-800"
            >
              {ITEMS.filter((it) => it.group === mobileGroup).map((it) => (
                <option key={it.id} value={it.id}>
                  {it.id} · {it.name} ({it.source})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 라벨 바 */}
        <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
          <div className="font-mono text-[13px] text-neutral-500">
            {selected.id} · <span className="font-semibold text-neutral-800">{selected.name}</span> · {selected.source}
          </div>
          <div className="mt-0.5 font-mono text-[12px] text-neutral-400">{selected.usage}</div>
        </div>

        {/* 단일 프리뷰: key로 선택 전환 시 fresh 마운트(이전 것 언마운트) */}
        <div key={selected.id} className="min-w-0 flex-1">
          {selected.render()}
        </div>
      </section>
    </main>
  );
}
