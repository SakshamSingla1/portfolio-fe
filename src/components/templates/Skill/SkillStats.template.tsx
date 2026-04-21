import React, { useState, useEffect } from "react";
import type { SkillStats } from "../../../services/useSkillService";

interface SkillStatsProps {
    stats: SkillStats | null;
}

interface StatsCardProps {
    label: string;
    value?: number;
    isMobile: boolean;
}

const useCountUp = (value = 0) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let current = 0;
        const duration = 800;
        const step = value / (duration / 16);

        const timer = setInterval(() => {
            current += step;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);
    return count;
};

const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value = 0,
    isMobile,
}) => {
    const animatedValue = useCountUp(value);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                {label}
            </span>
            <span className={`font-extrabold text-gray-900 ${isMobile ? "text-2xl" : "text-4xl"}`}>
                {animatedValue}
            </span>
        </div>
    );
};

const SkillStatsTemplate: React.FC<SkillStatsProps> = ({ stats }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const statsConfig = [
        { label: "Expert", value: stats?.expertSkillCount },
        { label: "Advanced", value: stats?.advancedSkillCount },
        { label: "Intermediate", value: stats?.intermediateSkillCount },
        { label: "Beginner", value: stats?.beginnerSkillCount },
    ];

    return (
        <div className={`grid gap-6 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
            {statsConfig.map((item) => (
                <StatsCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    isMobile={isMobile}
                />
            ))}
        </div>
    );
};

export default React.memo(SkillStatsTemplate);
