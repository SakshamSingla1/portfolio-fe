import React, { useState, useEffect } from 'react';
import { Code2, MapPin, Calendar, Clock, ExternalLink, ArrowUpRight } from 'lucide-react';
import { ExperienceResponse } from '../../../services/useExperienceService';
import { SkillDropdown } from '../../../services/useSkillService';
import { htmlToElement } from '../../../utils/helper';

interface ExperienceCardProps {
    experience: ExperienceResponse;
    className?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
    experience: { 
        companyName,
        jobTitle,
        location,
        startDate,
        endDate,
        currentlyWorking,
        description,
        technologiesUsed,
    },
    className = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const formatDateRange = (start: string, end?: string | null) => {
        if (currentlyWorking) {
            return `${start} - Present`;
        }
        return end ? `${start} - ${end}` : `${start} - Present`;
    };

    const getDuration = (start: string, end?: string) => {
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth() + (years * 12);
        
        if (months >= 12) {
            const years = Math.floor(months / 12);
            return `${years}+ ${years === 1 ? 'year' : 'years'}`;
        }
        return `${months}+ months`;
    };

    return (
        <article 
            className={`relative group overflow-hidden transition-all duration-500 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated gradient border */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isHovered ? 'animate-gradient-xy' : ''}`} />
            
            {/* Glass card */}
            <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 sm:p-8 border border-gray-800/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl transition-all duration-700 scale-100`} />
                    <div className={`absolute -bottom-32 -left-32 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl transition-all duration-700 scale-100`} />
                </div>

                <div className="relative flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="relative">
                                <div className={`absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-all duration-700 ${isHovered ? 'animate-pulse' : ''}`} />
                                <div className="relative z-10 p-2.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-800/50 shadow-lg">
                                    <Code2 className="w-6 h-6 text-cyan-400 transition-transform duration-500 group-hover:rotate-12" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        {companyName}
                                    </h2>
                                </div>
                                <div className="flex items-center text-sm text-gray-400 mt-1">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{location}</span>
                                </div>
                            </div>
                        </div>
                        <span className="inline-flex items-center justify-center sm:justify-start px-3 py-1.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm whitespace-nowrap">
                            <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                            {getDuration(startDate, endDate || undefined)}
                        </span>
                    </div>

                    {/* Job Title & Duration */}
                    <div className="mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                            {jobTitle}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mt-2">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                            <span>{formatDateRange(startDate, endDate || undefined)}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 mb-6 group/desc">
                        <div className="text-gray-300 border-l-2 border-blue-500/50 pl-4 py-1 leading-relaxed transition-all duration-300 group-hover/desc:border-l-4 group-hover/desc:border-cyan-500/70 group-hover/desc:pl-5">
                            {htmlToElement(description)}
                        </div>
                    </div>

                    {/* Technologies */}
                    {technologiesUsed && technologiesUsed.length > 0 && (
                        <div className="mt-auto pt-4 border-t border-gray-800/50 group/tech">
                            <h4 className="text-xs font-medium text-gray-400 mb-3 tracking-wider uppercase">Technologies Used</h4>
                            <div className="flex flex-wrap gap-2">
                                {technologiesUsed.map((tech: SkillDropdown) => (
                                    <div 
                                        key={tech.id}
                                        className="flex items-center px-3 py-1.5 bg-gray-800/50 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 rounded-lg border border-gray-700/50 transition-all duration-300 group/techitem hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
                                    >
                                        {tech.logoUrl && (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-cyan-500/10 rounded-full scale-0 group-hover/techitem:scale-100 transition-transform duration-300" />
                                                <img 
                                                    src={tech.logoUrl} 
                                                    alt={tech.logoName} 
                                                    className="w-6 h-6 mr-2.5 object-contain relative z-10 transition-transform duration-300 group-hover/techitem:scale-110"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-300 group-hover/techitem:text-white transition-colors">
                                            {tech.logoName}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-3 h-[1px] bg-cyan-500/70 animate-pulse" />
                    <div className="absolute top-0 right-0 w-[1px] h-3 bg-cyan-500/70 animate-pulse" />
                </div>
                <div className="absolute bottom-4 left-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-purple-500/70 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-purple-500/70 animate-pulse" />
                </div>
            </div>
            
            {/* Hover overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 rounded-2xl group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        </article>
    );
};

export default ExperienceCard;