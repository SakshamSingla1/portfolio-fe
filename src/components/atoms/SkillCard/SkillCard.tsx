import React, { forwardRef, useMemo } from 'react';
import { Skill } from "../../../services/useSkillService";
import { SKILL_CATEGORY_OPTIONS } from "../../../utils/constant";
import { OptionToValue } from "../../../utils/helper";
import { 
  FiCode, 
  FiCpu, 
  FiDatabase, 
  FiLayers, 
  FiMonitor, 
  FiServer, 
  FiSmartphone, 
  FiWifi, 
  FiTerminal, 
  FiCheckSquare, 
  FiShield, 
  FiLayout,
  FiHelpCircle 
} from 'react-icons/fi'; 
import { FaRobot } from 'react-icons/fa';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

const categoryIcons: Record<string, React.ReactNode> = {
  'FRONTEND': <FiMonitor className="text-blue-300 h-6 w-6" />,
  'BACKEND': <FiServer className="text-green-300 h-6 w-6" />,
  'PROGRAMMING': <FiTerminal className="text-red-400 h-6 w-6" />,
  'TOOL': <FiCode className="text-purple-300 h-6 w-6" />,
  'DATABASE': <FiDatabase className="text-amber-300 h-6 w-6" />,
  'DEVOPS': <FiCpu className="text-cyan-300 h-6 w-6" />,
  'TESTING': <FiCheckSquare className="text-emerald-300 h-6 w-6" />,
  'MOBILE': <FiSmartphone className="text-pink-300 h-6 w-6" />,
  'CLOUD': <FiWifi className="text-indigo-300 h-6 w-6" />,
  'SECURITY': <FiShield className="text-rose-400 h-6 w-6" />,
  'DATA_SCIENCE': <FaRobot className="text-fuchsia-400 h-5 w-5" />,
  'UI_UX': <FiLayout className="text-sky-300 h-6 w-6" />,
  'SOFT_SKILLS': <FiLayers className="text-yellow-300 h-6 w-6" />,
  'OTHER': <FiHelpCircle className="text-gray-400 h-6 w-6" />,
  default: <FiCode className="text-gray-300 h-6 w-6" />
};

// Card Components
const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative rounded-xl border-2 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90",
        "backdrop-blur-sm border-gray-800/50 shadow-2xl shadow-blue-900/10",
        "transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-blue-500/20",
        "transform-gpu will-change-transform hover:border-blue-500/30",
        className
      )}
      {...props}
    >
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur transition-all duration-700 group-hover:duration-200" />
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-purple-500/10 blur-xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-transparent via-transparent to-blue-500/5" />
      </div>
      <div className="relative z-10 h-full">
        {props.children}
      </div>
    </div>
  )
);
Card.displayName = "Card";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative z-10 p-6 h-full flex flex-col",
        "backdrop-blur-sm bg-gradient-to-br from-gray-900/30 to-gray-900/10",
        "rounded-xl border border-gray-800/30",
        "transition-all duration-300 group-hover:border-blue-500/20",
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

interface SkillCardProps {
  title: string;
  skills: Skill[];
  className?: string;
}

const SkillCard = React.memo(({ 
  title, 
  skills, 
  className 
}: SkillCardProps) => {
  const getCategoryIcon = useMemo(() => {
    const icon = categoryIcons[title];
    return icon || categoryIcons.default;
  }, [title]);

  return (
    <Card 
      className={cn("group/skill", className)}
      role="region"
      aria-label={`${title} Skills`}
    >
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-3 bg-gray-700 rounded-2xl backdrop-blur-sm border border-gray-800/50"
          >
            <div className="w-6 h-6">
              {getCategoryIcon}
            </div>
          </div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {OptionToValue(SKILL_CATEGORY_OPTIONS, title)}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={`${skill.id || skill.logoName}-${skill.logoUrl}`}
              className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 
              hover:border-b-2 hover:border-blue-500 text-gray-100 border 
              border-gray-600 flex items-center gap-2 py-2 px-3 transition-all 
              duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20
              rounded-lg"
              tabIndex={0}
              aria-label={skill.logoName || 'Skill'}
            >
              <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                {skill.logoUrl ? (
                  <img 
                    src={skill.logoUrl} 
                    alt={skill.logoName || 'Skill icon'} 
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                    width={20}
                    height={20}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center text-sm font-medium text-blue-300">
                    {skill.logoName?.[0]?.toUpperCase()}
                  </span>
                )}
              </span>
              <span className="font-medium text-sm">{skill.logoName}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

SkillCard.displayName = 'SkillCard';

export default SkillCard;