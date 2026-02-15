import React, { useEffect, useState } from "react";
import { useColors } from "../../../utils/types";

interface ProfileCompletionProps {
    profileCompletion: {
        percentage: number;
        missingSections: string[];
    };
}

/* ===== Smooth Counter ===== */
const useCountUp = (value: number) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 800;
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
    const animatedProgress = useCountUp(percentage);
    const colors = useColors();

    const size = 120;
    const stroke = 12;
    const radius = size / 2 - stroke;
    const circumference = 2 * Math.PI * radius;
    const offset =
        circumference - (animatedProgress / 100) * circumference;

    const isComplete = percentage === 100;

    return (
        <div className="relative">

            {/* ================= TOP SECTION ================= */}
            <div className="relative p-6">

                <div className="flex justify-between items-start">

                    {/* LEFT SIDE */}
                    <div className="space-y-5 flex-1 pr-10">

                        <div
                            className="text-lg font-semibold"
                            style={{ color: colors.primary900 }}
                        >
                            Profile Completion
                        </div>

                        <div className="flex items-end gap-3">
                            <div
                                className="text-4xl font-bold"
                                style={{ color: colors.primary600 }}
                            >
                                {animatedProgress}%
                            </div>
                            <div
                                className="text-base font-medium"
                                style={{ color: colors.neutral600 }}
                            >
                                Complete
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div
                            className="h-2 rounded-full overflow-hidden w-56"
                            style={{ background: colors.neutral200 }}
                        >
                            <div
                                className="h-full transition-all duration-700 ease-out rounded-full"
                                style={{
                                    width: `${animatedProgress}%`,
                                    background: `linear-gradient(to right, ${colors.primary400}, ${colors.primary600})`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ===== HORIZONTAL LINE ===== */}
                <div
                    className="absolute left-6 right-6 top-48 h-[2px] z-0"
                    style={{
                        background: `linear-gradient(to right, ${colors.primary200}, ${colors.primary400})`,
                    }}
                />

                {/* ===== CIRCLE ON LINE (LIKE TIMELINE ICON) ===== */}
                <div
                    className="absolute right-6 top-28 translate-y-1/2 z-20 rounded-full flex items-center justify-center"
                    style={{
                        width: `${size + 12}px`,
                        height: `${size + 12}px`,
                        background: colors.neutral50,
                    }}
                >
                    <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            boxShadow: `0 8px 24px ${colors.primary400}40`,
                            background: "#ffffff",
                        }}
                    >
                        <svg width={size} height={size}>
                            <circle
                                stroke={colors.primary100}
                                fill="white"
                                strokeWidth={stroke}
                                r={radius}
                                cx={size / 2}
                                cy={size / 2}
                            />

                            {/* Progress */}
                            <circle
                                stroke={colors.primary500}
                                fill="transparent"
                                strokeWidth={stroke}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                r={radius}
                                cx={size / 2}
                                cy={size / 2}
                                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                                className="transition-all duration-700 ease-out"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ================= BOTTOM SECTION ================= */}
            <div className="pt-12 px-6 pb-6 space-y-4">

                <div
                    className="text-base font-semibold"
                    style={{ color: colors.primary900 }}
                >
                    {isComplete ? "All Sections Completed 🎉" : "Needs Improvement"}
                </div>

                {isComplete ? (
                    <div
                        className="text-sm"
                        style={{ color: colors.success600 }}
                    >
                        Your profile is fully optimized and complete.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {missingSections.map((section, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-3 text-sm"
                                style={{ color: colors.neutral700 }}
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ background: colors.primary500 }}
                                />
                                {section}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProfileCompletionTemplate;
