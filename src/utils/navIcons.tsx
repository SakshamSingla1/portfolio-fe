import React from "react";
import { FiHome, FiBriefcase } from "react-icons/fi";
import { LuGraduationCap, LuFolderKanban, LuAward, LuShieldCheck } from "react-icons/lu";
import {
    TbCode, TbUser, TbMessageChatbot, TbBell, TbSettings, TbLink, TbShare, TbLayoutDashboard,
    TbUsers, TbHelp, TbIcons, TbBrowser, TbChartBar, TbArticle, TbLanguage, TbBriefcase,
    TbBrandGithub, TbFileText,
} from "react-icons/tb";
import { IoColorPaletteOutline } from "react-icons/io5";
import { CgFileDocument } from "react-icons/cg";
import { FaRegAddressCard } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";

const NAV_ICON_MAP: Record<string, React.ReactElement> = {
    EDUCATION: <LuGraduationCap />,
    EXPERIENCE: <FiBriefcase />,
    SKILLS: <TbCode />,
    PROJECT: <LuFolderKanban />,
    PROFILE: <TbUser />,
    MESSAGES: <TbMessageChatbot />,
    NOTIFICATIONS: <TbBell />,
    THEMES: <IoColorPaletteOutline />,
    SETTINGS: <TbSettings />,
    NAV_LINKS: <TbLink />,
    RESUMES: <CgFileDocument />,
    SOCIAL_LINKS: <TbShare />,
    CERTIFICATIONS: <LuAward />,
    TESTIMONIALS: <FaRegAddressCard />,
    ACHIEVEMENTS: <GoTrophy />,
    DASHBOARD: <TbLayoutDashboard />,
    USERS: <TbUsers />,
    ROLES_AND_PERMISSIONS: <LuShieldCheck />,
    HELP: <TbHelp />,
    LOGOS: <TbIcons />,
    MAIN_PAGE: <TbBrowser />,
    ANALYTICS: <TbChartBar />,
    BLOGS: <TbArticle />,
    LANGUAGES: <TbLanguage />,
    SERVICES: <TbBriefcase />,
    GITHUB_INTEGRATION: <TbBrandGithub />,
    PUBLICATIONS: <TbFileText />,
    TESTIMONIAL_REQUESTS: <TbLink />,
    LANDING_MANAGEMENT: <TbBrowser />,
};

export const getIconForNavItem = (itemName: string): React.ReactElement =>
    NAV_ICON_MAP[itemName] ?? <FiHome />;
