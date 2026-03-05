import React, { useEffect, useState } from "react";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IProfileCompletion } from "../../../services/useDashboardService";

interface ProfileCompletionProps {
  profileCompletion: IProfileCompletion;
}

const useCountUp = (value: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return count;
};

const ProfileCompletionTemplate: React.FC<ProfileCompletionProps> = ({
  profileCompletion,
}) => {
  const { percentage, missingSections } = profileCompletion;

  const colors = useColors();
  const isMobile = useIsMobile();
  const animatedProgress = useCountUp(percentage);

  const size = isMobile ? 100 : 140;
  const stroke = isMobile ? 10 : 14;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (animatedProgress / 100) * circumference;

  const isComplete = percentage === 100;

  const getMessage = () => {
    if (percentage === 100) return "You're Fully Optimized 🚀";
    if (percentage >= 80) return "Just One More Push 💪";
    if (percentage >= 50) return "You're Making Great Progress 🔥";
    return "Let’s Strengthen Your Profile ✨";
  };

  return (
    <div className="relative rounded-3xl">
      <div className="absolute inset-0" />
      <div className={`relative ${isMobile ? "p-4" : "p-6"}`}>
        <div className="flex justify-between items-start">
          <div className="space-y-3 mt-8">
            <div className="w-48 h-2 rounded-full overflow-hidden" style={{ background: colors.primary100 }}>
              <div className="h-full transition-all duration-700" style={{ width: `${animatedProgress}%`, background: `linear-gradient(90deg, ${colors.primary400}, ${colors.primary600})` }} />
            </div>
            <div className="text-sm font-medium mt-2" style={{ color: colors.neutral600 }}>
              {getMessage()}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: `radial-gradient(circle, ${colors.primary400}, transparent 70%)` }} />
            <div className="relative rounded-full flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px`, background: "#fff", boxShadow: `0 20px 40px ${colors.primary400}30, inset 0 4px 8px rgba(255,255,255,0.6)`, }}>
              <svg width={size} height={size}>
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={colors.primary400} />
                    <stop offset="100%" stopColor={colors.primary600} />
                  </linearGradient>
                </defs>
                <circle
                  stroke={colors.primary100}
                  fill="transparent"
                  strokeWidth={stroke}
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                />
                <circle
                  stroke="url(#gradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                  transform={`rotate(-90 ${size / 2} ${
                    size / 2
                  })`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute text-2xl font-bold" style={{ color: colors.primary600 }}>
                {animatedProgress}%
              </div>
              {isComplete && (
                <div className="absolute -bottom-2 -right-2 text-white text-sm font-bold" style={{
                    background: colors.success500,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 6px 14px ${colors.success400}60`,
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComplete && (
        <div className="px-6 pb-6">
          <div className="text-sm font-semibold mb-3" style={{ color: colors.primary900 }}>
            Improve by completing:
          </div>
          <div className="flex flex-wrap gap-3">
            {missingSections.map((section, index) => (
              <div key={index} className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md" style={{ background: "#fff", color: colors.primary700, border: `1px solid ${colors.primary200}` }}>
                {section}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionTemplate;
