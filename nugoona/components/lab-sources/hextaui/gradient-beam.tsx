// 출처: HextaUI src/components/og-blocks/animation/gradient-beam.tsx
//   (현재 master에서 삭제됨 — 삭제 직전 부모 커밋 059ed52c98289bbaca79fa96ac7be7aa4113c9b5 에서 수집)
//   raw: https://raw.githubusercontent.com/preetsuthar17/HextaUI/059ed52c98289bbaca79fa96ac7be7aa4113c9b5/src/components/og-blocks/animation/gradient-beam.tsx
// 수집일: 2026-07-17
// 수정: import "motion/react" → "framer-motion" (그 외 원본 그대로)
// 의존성: framer-motion (그 외 외부 의존성 없음, cn 미사용, 별도 CSS/keyframe 불필요)
"use client";

import React from "react";
import { motion } from "framer-motion";

interface GradientBeamProps {
  width: number;
  height: number;
  baseColor?: string;
  gradientColors?: [string, string, string];
  animationDuration?: number;
  strokeWidth?: number;
}

export const GradientBeam: React.FC<GradientBeamProps> = ({
  width,
  height,
  baseColor = "black",
  gradientColors = ["#2EB9DF", "#2EB9DF", "#9E00FF"],
  animationDuration = 2,
  strokeWidth = 2,
}) => {
  const gradientId = `pulse-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={baseColor}
          strokeOpacity="0.2"
        />
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <defs>
          <motion.linearGradient
            // 첫 렌더에 x1/x2가 undefined라 SVG 콘솔 에러 → initial 지정(애니 로직 무수정)
            initial={{ x1: 0, x2: 0 }}
            animate={{
              x1: [0, width * 2],
              x2: [0, width],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              ease: "linear",
            }}
            id={gradientId}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={gradientColors[0]} stopOpacity="0" />
            <stop stopColor={gradientColors[1]} />
            <stop offset="1" stopColor={gradientColors[2]} stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
};
