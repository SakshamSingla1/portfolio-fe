import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaRocket, FaUser, FaCode, FaBookOpen, FaProjectDiagram, FaShareAlt,
  FaPalette, FaLink, FaGlobe, FaUsers, FaShieldAlt, FaBell, FaCheckCircle,
  FaArrowRight, FaCloudUploadAlt, FaGithub, FaCog, FaBolt, FaLightbulb,
  FaGraduationCap, FaCertificate, FaTrophy, FaComments, FaFileAlt,
  FaSearch, FaChevronDown, FaImage, FaMagic, FaLock, FaPlus, FaTrash, FaEdit,
} from "react-icons/fa";
import { FiZap, FiLayout, FiSettings, FiBook, FiHelpCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { InputAdornment } from "@mui/material";
import Tabs, { type ITabsSchema } from "../../atoms/Tabs/Tabs";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import Checkbox from "../../atoms/Checkbox/Checkbox";
import { DeleteConfirmation } from "../../molecules/DeleteConfirmation/DeleteConfirmation";
import { useColors, HTTP_STATUS } from "../../../utils/types";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { useHelpFaqService, type HelpFaq } from "../../../services/useHelpFaqService";

// ── Shared primitives ──────────────────────────────────────────────────────────

const Card = ({ children, colors, className = "", style = {} }: any) => (
  <div
    className={`relative p-6 rounded-2xl overflow-hidden transition-all duration-300 border ${className}`}
    style={{
      backgroundColor: colors.neutral0,
      borderColor: `${colors.neutral200}80`,
      boxShadow: `0 2px 12px ${colors.neutral900}06`,
      ...style,
    }}
  >
    {children}
  </div>
);

const AdminBadge = ({ colors }: any) => (
  <span
    className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1"
    style={{ backgroundColor: `${colors.warning500}15`, color: colors.warning600, border: `1px solid ${colors.warning500}30` }}
  >
    <FaLock style={{ fontSize: 7 }} /> Admin
  </span>
);

const SuperAdminBadge = ({ colors }: any) => (
  <span
    className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1"
    style={{ backgroundColor: `${colors.error500}15`, color: colors.error600, border: `1px solid ${colors.error500}30` }}
  >
    <FaLock style={{ fontSize: 7 }} /> Super Admin
  </span>
);

const SectionLabel = ({ text, colors }: { text: string; colors: any }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.14em] mb-4 ml-1" style={{ color: colors.neutral400 }}>
    {text}
  </p>
);

// ── Data ───────────────────────────────────────────────────────────────────────

const quickStartSteps = [
  {
    num: 1, title: "Set Up Your Profile", icon: FaUser, url: "/profile", color: "primary",
    desc: "Add your name, headline, bio, contact details, avatar photo, and profile cover image.",
    tip: "A complete bio with a professional photo increases visitor engagement significantly.",
  },
  {
    num: 2, title: "Upload Tech Logos", icon: FaImage, url: "/logos", color: "accent",
    desc: "Upload company and technology logos used throughout your portfolio for skills and projects.",
    tip: "Upload SVG logos for crisp rendering at any size.",
  },
  {
    num: 3, title: "Build Your Skill Stack", icon: FaCode, url: "/skills", color: "success",
    desc: "Catalogue your technologies, tools, and languages with proficiency levels and categories.",
    tip: "Group skills by category (Frontend, Backend, DevOps) for a cleaner layout.",
  },
  {
    num: 4, title: "Add Work Experience", icon: FaBookOpen, url: "/experience", color: "warning",
    desc: "Document your professional roles with descriptions, tech stacks used, and employment dates.",
    tip: "Add at least 3 bullet points per role and tag the skills you used.",
  },
  {
    num: 5, title: "Add Education History", icon: FaGraduationCap, url: "/education", color: "primary",
    desc: "List your academic qualifications — degrees, institutions, grades, and field of study.",
    tip: "Mention any honours, dissertations, or relevant coursework.",
  },
  {
    num: 6, title: "Showcase Projects", icon: FaProjectDiagram, url: "/projects", color: "accent",
    desc: "Highlight key projects with screenshots, live demo links, source code repos, and full descriptions.",
    tip: "Projects with live demos get significantly more clicks than those without.",
  },
  {
    num: 7, title: "Add Certifications", icon: FaCertificate, url: "/certifications", color: "success",
    desc: "Upload your certifications with issue date, provider, credential ID and verification links.",
    tip: "Cloud and security certifications are among the most viewed by recruiters.",
  },
  {
    num: 8, title: "Achievements & Testimonials", icon: FaTrophy, url: "/achievements", color: "warning",
    desc: "Document awards, recognitions, and client or colleague testimonials to build credibility.",
    tip: "Even internal company recognitions are worth adding — they show growth.",
  },
  {
    num: 9, title: "Connect Social Links", icon: FaShareAlt, url: "/social-links", color: "primary",
    desc: "Link your GitHub, LinkedIn, Twitter and other profiles so visitors can reach you anywhere.",
    tip: "Keep your GitHub pinned repos up to date — visitors often check them first.",
  },
  {
    num: 10, title: "Customize Your Theme", icon: FaPalette, url: "/themes", color: "accent",
    desc: "Choose from preset color themes or build a custom palette that reflects your personal brand.",
    tip: "Test your theme with the preview panel before applying it globally.",
  },
  {
    num: 11, title: "Upload Your Resume", icon: FaFileAlt, url: "/resumes", color: "success",
    desc: "Provide one or more resume versions for visitors to download directly from your portfolio.",
    tip: "Upload both a detailed and a one-page version to suit different audiences.",
  },
];

const allModules = [
  {
    group: "Portfolio Content",
    icon: FiBook,
    items: [
      { title: "Profile", desc: "Your identity, headline, bio, contact info, and avatar.", icon: FaUser, url: "/profile", admin: false, superAdmin: false },
      { title: "Skills", desc: "Tech stack catalogue with proficiency levels and categories.", icon: FaCode, url: "/skills", admin: false, superAdmin: false },
      { title: "Experience", desc: "Professional timeline with roles, companies, and tech used.", icon: FaBookOpen, url: "/experience", admin: false, superAdmin: false },
      { title: "Education", desc: "Academic history — degrees, institutions, grades.", icon: FaGraduationCap, url: "/education", admin: false, superAdmin: false },
      { title: "Projects", desc: "Showcase with screenshots, live demos, and source links.", icon: FaProjectDiagram, url: "/projects", admin: false, superAdmin: false },
      { title: "Certifications", desc: "Professional certifications with issuer and verification links.", icon: FaCertificate, url: "/certifications", admin: false, superAdmin: false },
      { title: "Achievements", desc: "Awards, recognitions, and notable milestones.", icon: FaTrophy, url: "/achievements", admin: false, superAdmin: false },
      { title: "Testimonials", desc: "Client and colleague testimonials with ratings.", icon: FaComments, url: "/testimonials", admin: false, superAdmin: false },
    ],
  },
  {
    group: "Media & Branding",
    icon: FaMagic,
    items: [
      { title: "Logos", desc: "Reusable tech and company logo assets used across modules.", icon: FaImage, url: "/logos", admin: false, superAdmin: true },
      { title: "Resumes", desc: "Manage downloadable resume files for visitors.", icon: FaFileAlt, url: "/resumes", admin: false, superAdmin: false },
      { title: "Color Themes", desc: "Preset and custom palettes to style your portfolio.", icon: FaPalette, url: "/themes", admin: false, superAdmin: false },
      { title: "Social Links", desc: "External profile links shown on your public portfolio.", icon: FaShareAlt, url: "/social-links", admin: false, superAdmin: false },
      { title: "Landing Page", desc: "Configure the features, FAQs, steps, and audience cards on your public landing page.", icon: FaGlobe, url: "/landing-management", admin: false, superAdmin: true },
    ],
  },
  {
    group: "Administration",
    icon: FiSettings,
    items: [
      { title: "Messages", desc: "Inbox for contact form submissions from portfolio visitors.", icon: FaComments, url: "/messages", admin: false, superAdmin: false },
      { title: "Nav Links", desc: "Control sidebar navigation order, icons, and visibility.", icon: FaLink, url: "/navlinks", admin: true, superAdmin: true },
      { title: "Email Templates", desc: "Build notification templates with dynamic variable substitution.", icon: FaBell, url: "/notifications", admin: true, superAdmin: true },
      { title: "Users", desc: "Manage platform user accounts and account status.", icon: FaUsers, url: "/users", admin: true, superAdmin: false },
      { title: "Roles & Permissions", desc: "Define roles with granular per-module access control.", icon: FaShieldAlt, url: "/roles-permissions", admin: true, superAdmin: true },
      { title: "Settings", desc: "Security settings — password, email, 2FA, SEO, GitHub.", icon: FaCog, url: "/settings", admin: false, superAdmin: false },
    ],
  },
];

const tips = [
  {
    category: "Content",
    icon: FiBook,
    color: "primary",
    items: [
      { title: "Lead with your best projects", desc: "Sort your most impressive projects to the top — visitors scan the first 3 before deciding to scroll further." },
      { title: "Keep your bio under 150 words", desc: "Concise bios are read to completion. Front-load your most differentiating detail in the first sentence." },
      { title: "Tag skills to experience & projects", desc: "Cross-linking skills to where you used them lets visitors verify your proficiency with real evidence." },
      { title: "Use rich text for descriptions", desc: "The rich text editor supports formatting. Use bullet points to make role descriptions scannable." },
    ],
  },
  {
    category: "Branding",
    icon: FaMagic,
    color: "accent",
    items: [
      { title: "Pick a theme that matches your field", desc: "Design/creative roles benefit from bold, colourful themes. Engineering roles often perform better with minimal, neutral ones." },
      { title: "Use SVG logos wherever possible", desc: "SVG logos render sharply at any resolution and keep your portfolio looking polished on retina displays." },
      { title: "Test your theme in both modes", desc: "Toggle dark mode before publishing — some colour combinations that look great in light mode can have low contrast in dark." },
      { title: "Consistent profile photo style", desc: "A professional headshot against a neutral background consistently outperforms casual photos." },
    ],
  },
  {
    category: "Publishing",
    icon: FiLayout,
    color: "success",
    items: [
      { title: "Preview before every change", desc: "Use the Preview button in Templates to see exactly what visitors see before saving." },
      { title: "Keep resume under 2 MB", desc: "Large PDFs slow the download experience. Compress images in your resume before uploading." },
      { title: "Add a certification even if expired", desc: "Expired certifications still signal you invested time in structured learning for that technology." },
      { title: "Set a meaningful page title via SEO settings", desc: "In Settings → SEO, set a clear title like 'John Doe | Full Stack Engineer' for better search visibility." },
    ],
  },
];

const deploymentSteps = [
  { icon: FaGithub, title: "Commit & Push", desc: "Stage your latest frontend and backend changes, write a clear commit message, and push to your main branch on GitHub." },
  { icon: FaBolt, title: "Trigger Pipeline", desc: "Your CI/CD pipeline auto-triggers on push. If manual, go to your hosting dashboard (Vercel/Netlify/Railway) and click Deploy." },
  { icon: FaCode, title: "Frontend Build", desc: "Vite compiles the React application into optimised static assets. Build time is typically under 90 seconds." },
  { icon: FaCloudUploadAlt, title: "Backend Deploy", desc: "Spring Boot builds a JAR and deploys to your cloud provider. Database migrations run automatically on startup." },
  { icon: FaGlobe, title: "Verify & Smoke Test", desc: "Open your live URL, check the portfolio renders, test the contact form, and confirm SSL is active." },
];

// FAQ content is now admin-editable (Help FAQ backend) rather than hardcoded here —
// see the FAQ tab component below, which fetches it via useHelpFaqService.

// ── Tab: Quick Start ───────────────────────────────────────────────────────────

const QuickStart = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-3">
    <Card colors={colors}>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: colors.neutral500 }}>
        Follow these steps in order to build a complete, publish-ready portfolio from scratch. Each step links directly to the relevant module.
      </p>
      <div className="relative">
        <div
          className="absolute left-[27px] top-4 bottom-4 w-px hidden sm:block"
          style={{ background: `linear-gradient(to bottom, ${colors.primary400}60, transparent)` }}
        />
        <div className="space-y-3">
          {quickStartSteps.map((s, i) => {
            const colorKey = `${s.color}500` as any;
            const textKey = `${s.color}700` as any;
            const bgKey = `${s.color}50` as any;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.035 }}
              >
                <Link
                  to={s.url}
                  className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 group/item no-underline"
                  style={{ borderColor: `${colors.neutral200}50`, color: "inherit" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${colors[colorKey]}40`;
                    e.currentTarget.style.backgroundColor = `${colors[colorKey]}06`;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colors.neutral200}50`;
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    className="h-12 w-12 rounded-[12px] border flex flex-col items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.neutral0, borderColor: `${colors.neutral200}60` }}
                  >
                    <span className="text-[7px] uppercase tracking-widest font-black" style={{ color: colors.neutral600 }}>step</span>
                    <span className="font-black text-base leading-none" style={{ color: colors.primary600 }}>{s.num}</span>
                  </div>
                  <div
                    className="h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 mt-1"
                    style={{ backgroundColor: `${colors[colorKey]}12` }}
                  >
                    <s.icon style={{ fontSize: 16, color: colors[colorKey] }} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>{s.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: colors.neutral500 }}>{s.desc}</p>
                    <div
                      className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                      style={{ backgroundColor: `${colors[bgKey]}80`, color: colors[textKey] }}
                    >
                      <FaLightbulb style={{ fontSize: 8 }} />
                      {s.tip}
                    </div>
                  </div>
                  <FaArrowRight
                    className="mt-4 shrink-0 opacity-20 group-hover/item:opacity-80 group-hover/item:translate-x-1 transition-all duration-200"
                    style={{ fontSize: 12, color: colors[colorKey] }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  </div>
);

// ── Tab: All Modules ───────────────────────────────────────────────────────────

const AllModules = ({ colors, isAdmin, isSuperAdmin }: { colors: any; isAdmin: boolean; isSuperAdmin: boolean }) => (
  <div className="mt-6 space-y-8">
    {allModules.map((group, gi) => {
      const visibleItems = group.items.filter((item) =>
        item.superAdmin ? isSuperAdmin : (!item.admin || isAdmin)
      );
      if (visibleItems.length === 0) return null;
      return (
        <motion.div key={group.group} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06 }}>
          <SectionLabel text={group.group} colors={colors} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleItems.map((item, ii) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06 + ii * 0.04 }}>
                <Link
                  to={item.url}
                  className="flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 no-underline h-full"
                  style={{ borderColor: `${colors.neutral200}60`, color: "inherit", backgroundColor: colors.neutral0 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${colors.primary500}40`;
                    e.currentTarget.style.boxShadow = `0 6px 20px ${colors.neutral900}08`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colors.neutral200}60`;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="h-9 w-9 rounded-[10px] flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary500}10`, border: `1px solid ${colors.primary500}20` }}
                    >
                      <item.icon style={{ fontSize: 15, color: colors.primary600 }} />
                    </div>
                    {item.superAdmin
                      ? <SuperAdminBadge colors={colors} />
                      : item.admin
                        ? <AdminBadge colors={colors} />
                        : null}
                  </div>
                  <div>
                    <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>{item.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: colors.neutral500 }}>{item.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    })}

    {!isSuperAdmin && (
      <Card
        colors={colors}
        style={{ borderColor: `${colors.error500}30`, backgroundColor: `${colors.error500}05` }}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.error500}15` }}>
            <FaLock style={{ fontSize: 14, color: colors.error500 }} />
          </div>
          <div>
            <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>Super Admin modules are hidden</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: colors.neutral500 }}>
              Logos, Landing Page, Nav Links, Email Templates, and Roles & Permissions require a Super Admin account.
              Contact your Super Admin to request elevated access.
            </p>
          </div>
        </div>
      </Card>
    )}

    {!isAdmin && (
      <Card
        colors={colors}
        style={{ borderColor: `${colors.warning500}30`, backgroundColor: `${colors.warning500}05` }}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.warning500}15` }}>
            <FaLock style={{ fontSize: 14, color: colors.warning500 }} />
          </div>
          <div>
            <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>Admin-only modules are hidden</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: colors.neutral500 }}>
              Users and other admin modules are only visible to Admin or Super Admin accounts.
              Contact your administrator to request elevated access.
            </p>
          </div>
        </div>
      </Card>
    )}
  </div>
);

// ── Tab: Tips ──────────────────────────────────────────────────────────────────

const Tips = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-8">
    {tips.map((section, si) => {
      const colorKey = `${section.color}500` as any;
      return (
        <motion.div key={section.category} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors[colorKey]}12` }}
            >
              <section.icon style={{ fontSize: 13, color: colors[colorKey] }} />
            </div>
            <SectionLabel text={section.category} colors={{ ...colors, neutral400: colors[colorKey] }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.items.map((tip, ti) => (
              <motion.div key={tip.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.08 + ti * 0.05 }}>
                <Card colors={colors} className="flex gap-4 !p-5">
                  <div className="mt-0.5 shrink-0">
                    <FaCheckCircle style={{ fontSize: 14, color: colors[colorKey] }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>{tip.title}</p>
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: colors.neutral500 }}>{tip.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    })}

    <Card colors={colors} style={{ borderStyle: "dashed", borderColor: `${colors.primary500}40` }}>
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary500}12` }}>
          <FiZap style={{ fontSize: 16, color: colors.primary500 }} />
        </div>
        <div>
          <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>Dynamic content vs. UI changes</p>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: colors.neutral500 }}>
            All content you add through the admin dashboard (skills, projects, experience, etc.) is persisted
            immediately to the database and visible on your public portfolio without any deployment step.
            Only changes to the UI source code (React components, styles) require a build and deploy to take effect.
          </p>
        </div>
      </div>
    </Card>
  </div>
);

// ── Tab: Deployment ────────────────────────────────────────────────────────────

const Deployment = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-6">
    <Card colors={colors} style={{ background: `linear-gradient(135deg, ${colors.primary500}12 0%, transparent 70%)` }}>
      <div className="flex items-center gap-5">
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.primary500, boxShadow: `0 8px 24px ${colors.primary500}40` }}
        >
          <FaRocket style={{ color: "#fff", fontSize: 24 }} />
        </div>
        <div>
          <h3 className="text-xl font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>Deployment Guide</h3>
          <p className="text-sm mt-1" style={{ color: colors.neutral500 }}>
            The portfolio is a two-part system — a React frontend (Vite) and a Spring Boot backend. Both need to be deployed for the full platform to work.
          </p>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SectionLabel text="Deployment Steps" colors={colors} />
        <div className="space-y-3">
          {deploymentSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card colors={colors} className="!p-4 flex items-center gap-4 group/step">
                <div
                  className="h-11 w-11 rounded-[12px] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/step:scale-105"
                  style={{ backgroundColor: `${colors.primary500}10`, border: `1px solid ${colors.primary500}20` }}
                >
                  <s.icon style={{ fontSize: 18, color: colors.primary600 }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wide opacity-30" style={{ color: colors.neutral900 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>{s.title}</p>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: colors.neutral500 }}>{s.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel text="What Deploys How" colors={colors} />
        <Card colors={colors} className="space-y-5">
          {[
            {
              icon: FaBolt,
              color: "warning",
              title: "Instant — No Deploy Needed",
              desc: "Skills, projects, experience, education, certifications, themes, resumes, and all other content managed through the dashboard.",
            },
            {
              icon: FaCloudUploadAlt,
              color: "primary",
              title: "Requires Build & Deploy",
              desc: "Changes to React components, Tailwind styles, routing, or environment variables require a frontend rebuild and redeploy.",
            },
            {
              icon: FaGithub,
              color: "success",
              title: "Backend Changes",
              desc: "New API endpoints, database schema migrations, or Spring Boot configuration changes require a backend redeploy.",
            },
          ].map((item, idx) => {
            const c5 = `${item.color}500` as any;
            return (
              <div key={idx} className="flex gap-3 items-start">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${colors[c5]}12` }}
                >
                  <item.icon style={{ fontSize: 13, color: colors[c5] }} />
                </div>
                <div>
                  <p className="font-bold text-xs m-0" style={{ color: colors.neutral800 }}>{item.title}</p>
                  <p className="text-[11px] mt-1 leading-relaxed" style={{ color: colors.neutral500 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </Card>

        <Card colors={colors} className="!p-4" style={{ borderColor: `${colors.success500}30`, backgroundColor: `${colors.success500}05` }}>
          <div className="flex gap-2 items-start">
            <FaCheckCircle style={{ fontSize: 13, color: colors.success500, marginTop: 1 }} />
            <p className="text-xs leading-relaxed m-0" style={{ color: colors.neutral600 }}>
              <span className="font-bold block mb-0.5" style={{ color: colors.neutral800 }}>Verify your deployment</span>
              After deploying, open your live URL in an incognito window, submit the contact form, and check that your theme, fonts, and images load correctly.
            </p>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// ── Tab: FAQ ───────────────────────────────────────────────────────────────────

const emptyFaqDraft = (): HelpFaq => ({ question: "", answer: "", sortOrder: 0, isActive: true });

const FaqEditorForm = ({
  draft, colors, saving, onChange, onSave, onCancel,
}: {
  draft: HelpFaq; colors: any; saving: boolean;
  onChange: (next: HelpFaq) => void; onSave: () => void; onCancel: () => void;
}) => (
  <Card colors={colors} className="!p-4" style={{ borderColor: `${colors.primary500}40`, backgroundColor: `${colors.primary500}04` }}>
    <div className="flex flex-col gap-3">
      <TextField
        label="Question" value={draft.question}
        onChange={(e) => onChange({ ...draft, question: e.target.value })}
        placeholder="e.g. How do I change the color theme?"
      />
      <TextField
        label="Answer" value={draft.answer} multiline rows={3}
        onChange={(e) => onChange({ ...draft, answer: e.target.value })}
        placeholder="Write the answer shown when this question is expanded"
      />
      <div className="flex items-center gap-4 flex-wrap">
        <TextField
          label="Sort Order" type="number" value={draft.sortOrder}
          onChange={(e) => onChange({ ...draft, sortOrder: Number(e.target.value) || 0 })}
          style={{ width: 140 }}
        />
        <Checkbox
          checked={draft.isActive}
          onChange={(checked) => onChange({ ...draft, isActive: checked })}
          label="Active (visible to all users)"
        />
      </div>
      <div className="flex items-center justify-end gap-2 mt-1">
        <Button label="Cancel" variant="tertiaryContained" size="small" onClick={onCancel} disabled={saving} />
        <Button
          label={saving ? "Saving…" : "Save"}
          variant="primaryContained"
          size="small"
          disabled={saving || !draft.question.trim() || !draft.answer.trim()}
          onClick={onSave}
        />
      </div>
    </div>
  </Card>
);

const FAQItem = ({
  item, colors, index, isSuperAdmin, managing, onEdit, onDelete,
}: {
  item: HelpFaq; colors: any; index: number; isSuperAdmin: boolean; managing: boolean;
  onEdit: () => void; onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
      <Card
        colors={colors}
        className="!p-4"
        style={{
          borderColor: open ? `${colors.primary500}40` : `${colors.neutral200}60`,
          backgroundColor: open ? `${colors.primary500}04` : colors.neutral0,
          opacity: isSuperAdmin && !item.isActive ? 0.55 : 1,
        }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-start gap-3 flex-1 min-w-0 text-left"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 font-black text-xs mt-0.5"
              style={{ backgroundColor: `${colors.primary500}12`, color: colors.primary600, border: `1px solid ${colors.primary500}20` }}
            >
              Q
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>
                {item.question}
                {isSuperAdmin && !item.isActive && (
                  <span className="ml-2 text-[9px] font-black uppercase tracking-wider" style={{ color: colors.warning600 }}>Inactive</span>
                )}
              </p>
              <AnimatePresence>
                {open && (
                  <motion.p
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs mt-2.5 leading-relaxed overflow-hidden"
                    style={{ color: colors.neutral500 }}
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </button>
          {managing ? (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onEdit} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: colors.neutral400 }}>
                <FaEdit size={13} />
              </button>
              <button onClick={onDelete} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: colors.error500 }}>
                <FaTrash size={13} />
              </button>
            </div>
          ) : (
            <FaChevronDown
              className="shrink-0 mt-1 transition-transform duration-200"
              style={{ fontSize: 11, color: colors.neutral400, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const FAQ = ({ colors, isSuperAdmin }: { colors: any; isSuperAdmin: boolean }) => {
  const [search, setSearch] = useState("");
  const [managing, setManaging] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<HelpFaq>(emptyFaqDraft());
  const [deleteTarget, setDeleteTarget] = useState<HelpFaq | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const helpFaqService = useHelpFaqService();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["help-faqs", managing && isSuperAdmin],
    queryFn: async () => {
      const res = await (managing && isSuperAdmin ? helpFaqService.getFaqsForManage() : helpFaqService.getFaqs());
      if (res?.status === HTTP_STATUS.OK) return (res.data.data ?? []) as HelpFaq[];
      return [];
    },
  });

  const filtered = useMemo(
    () => (faqs ?? []).filter((f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())),
    [faqs, search]
  );

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["help-faqs"] });

  const startAdd = () => { setDraft(emptyFaqDraft()); setEditingId("new"); };
  const startEdit = (item: HelpFaq) => { setDraft(item); setEditingId(item.id ?? "new"); };
  const cancelEdit = () => setEditingId(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = editingId === "new" || !draft.id
        ? await helpFaqService.createFaq(draft)
        : await helpFaqService.updateFaq(draft.id, draft);
      if (res?.status === HTTP_STATUS.OK) {
        showSnackbar("success", editingId === "new" ? "FAQ created" : "FAQ updated");
        setEditingId(null);
        refresh();
      } else {
        showSnackbar("error", "Failed to save FAQ");
      }
    } catch {
      showSnackbar("error", "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      const res = await helpFaqService.deleteFaq(deleteTarget.id);
      if (res?.status === HTTP_STATUS.OK) {
        showSnackbar("success", "FAQ deleted");
        refresh();
      } else {
        showSnackbar("error", "Failed to delete FAQ");
      }
    } catch {
      showSnackbar("error", "Failed to delete FAQ");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch style={{ fontSize: 12, color: colors.neutral400 }} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
        {isSuperAdmin && (
          <Button
            label={managing ? "Done" : "Manage FAQs"}
            variant={managing ? "primaryContained" : "tertiaryContained"}
            size="small"
            onClick={() => { setManaging((v) => !v); setEditingId(null); }}
          />
        )}
      </div>

      {managing && editingId === "new" && (
        <FaqEditorForm draft={draft} colors={colors} saving={saving} onChange={setDraft} onSave={handleSave} onCancel={cancelEdit} />
      )}

      {isLoading ? (
        <Card colors={colors} className="text-center !py-10">
          <p className="text-sm" style={{ color: colors.neutral400 }}>Loading FAQs…</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card colors={colors} className="text-center !py-10">
          <FiHelpCircle style={{ fontSize: 28, color: colors.neutral300, margin: "0 auto 8px" }} />
          <p className="text-sm font-medium" style={{ color: colors.neutral400 }}>
            {search ? `No questions match "${search}"` : "No FAQs yet"}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((f, i) => (
            editingId === f.id ? (
              <FaqEditorForm key={f.id} draft={draft} colors={colors} saving={saving} onChange={setDraft} onSave={handleSave} onCancel={cancelEdit} />
            ) : (
              <FAQItem
                key={f.id ?? f.question}
                item={f}
                colors={colors}
                index={i}
                isSuperAdmin={isSuperAdmin}
                managing={managing}
                onEdit={() => startEdit(f)}
                onDelete={() => setDeleteTarget(f)}
              />
            )
          ))}
        </div>
      )}

      {managing && editingId !== "new" && (
        <button
          onClick={startAdd}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
          style={{ border: `1.5px dashed ${colors.primary300}`, color: colors.primary600, background: "transparent", cursor: "pointer" }}
        >
          <FaPlus size={11} /> Add FAQ
        </button>
      )}

      <Card colors={colors} style={{ borderColor: `${colors.primary500}30`, backgroundColor: `${colors.primary500}04` }}>
        <div className="flex items-center gap-3">
          <FaComments style={{ fontSize: 18, color: colors.primary500 }} />
          <div>
            <p className="font-bold text-sm m-0" style={{ color: colors.neutral800 }}>Still have a question?</p>
            <p className="text-xs mt-0.5" style={{ color: colors.neutral500 }}>
              Check the{" "}
              <Link to="/messages" className="underline" style={{ color: colors.primary600 }}>Messages</Link>{" "}
              inbox or raise an issue on{" "}
              <a href="https://github.com/SakshamSingla1/portfolio-be" target="_blank" rel="noreferrer" className="underline" style={{ color: colors.primary600 }}>GitHub</a>.
            </p>
          </div>
        </div>
      </Card>

      <DeleteConfirmation
        open={!!deleteTarget}
        title="Delete this FAQ?"
        description={deleteTarget ? `"${deleteTarget.question}" will be permanently removed.` : ""}
        onDelete={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        deleteButtonText={deleting ? "Deleting…" : "Delete"}
      />
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function HelpPage() {
  const colors = useColors();
  const { user } = useAuthenticatedUser();
  const [activeTab, setActiveTab] = useState("start");
  const isSuperAdmin = user?.roleName === "SUPER_ADMIN";
  const isAdmin = user?.roleName === "ADMIN" || isSuperAdmin;

  const helpFaqService = useHelpFaqService();
  // Lightweight FAQ count for the stats chip below. Shares its queryKey/fetcher
  // shape with the FAQ tab's own (non-managing) query so React Query can dedupe
  // the request instead of this component maintaining a second, divergent fetch.
  const { data: faqs } = useQuery({
    queryKey: ["help-faqs", false],
    queryFn: async () => {
      const res = await helpFaqService.getFaqs();
      if (res?.status === HTTP_STATUS.OK) return (res.data.data ?? []) as HelpFaq[];
      return [];
    },
  });

  const schema = useMemo<ITabsSchema[]>(
    () => [
      { label: "Quick Start",    value: "start",  icon: <FaRocket />,     component: <QuickStart colors={colors} /> },
      { label: "All Modules",    value: "modules", icon: <FiLayout />,    component: <AllModules colors={colors} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} /> },
      { label: "Tips",           value: "tips",   icon: <FaLightbulb />,  component: <Tips colors={colors} /> },
      { label: "Deployment",     value: "deploy", icon: <FaCloudUploadAlt />, component: <Deployment colors={colors} /> },
      { label: "FAQ",            value: "faq",    icon: <FiHelpCircle />, component: <FAQ colors={colors} isSuperAdmin={isSuperAdmin} /> },
    ],
    [colors, isAdmin, isSuperAdmin]
  );

  return (
    <div className="relative w-full mx-auto py-8 px-5 sm:px-8 min-h-screen overflow-hidden">
      <div
        className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] blur-[120px] opacity-[0.06] pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.primary500}, transparent)` }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] blur-[100px] opacity-[0.04] pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.accent500 || colors.secondary500}, transparent)` }}
      />

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: colors.neutral0,
              border: `1.5px solid ${colors.neutral200}60`,
              boxShadow: `0 8px 28px ${colors.neutral900}08`,
            }}
          >
            <FiHelpCircle style={{ color: colors.primary500, fontSize: 26 }} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>
              Help <span style={{ color: colors.primary700 }}>Center</span>
            </h1>
            <p className="text-base mt-1 font-medium" style={{ color: colors.neutral500 }}>
              Everything you need to build, customise, and publish your portfolio.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "Setup Steps",   value: "11",  color: "primary" },
            { label: "Modules",       value: "18+", color: "accent" },
            { label: "Tips & Tricks", value: "12",  color: "success" },
            { label: "FAQs",          value: `${faqs?.length ?? 0}`, color: "warning" },
          ].map((chip) => {
            const c5 = `${chip.color}500` as any;
            const c7 = `${chip.color}700` as any;
            return (
              <div
                key={chip.label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border"
                style={{
                  backgroundColor: `${(colors as any)[c5]}10`,
                  borderColor: `${(colors as any)[c5]}25`,
                  color: (colors as any)[c7],
                }}
              >
                <span className="text-base font-black">{chip.value}</span>
                <span style={{ color: colors.neutral600 }}>{chip.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="relative z-10">
        <Tabs schema={schema} value={activeTab} setValue={setActiveTab} fullWidth />
      </div>
    </div>
  );
}
