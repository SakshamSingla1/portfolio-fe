import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaUser,
  FaCode,
  FaBookOpen,
  FaProjectDiagram,
  FaShareAlt,
  FaPalette,
  FaLink,
  FaGlobe,
  FaUsers,
  FaShieldAlt,
  FaBell,
  FaCheckCircle,
  FaArrowRight,
  FaCloudUploadAlt,
  FaGithub,
  FaCog,
  FaBolt,
  FaLightbulb
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Tabs, { type ITabsSchema } from "../../atoms/Tabs/Tabs";
import { useColors } from "../../../utils/types";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

const Card = ({ children, colors, className = "", style = {} }: any) => (
  <div
    className={`relative p-6 rounded-[20px] overflow-hidden transition-all duration-300 border group/card ${className}`}
    style={{
      backgroundColor: `${colors.neutral0}aa`,
      backdropFilter: "blur(12px)",
      borderColor: `${colors.neutral200}80`,
      boxShadow: `0 8px 32px ${colors.neutral900}05`,
      ...style
    }}
  >
    {children}
  </div>
);

const Badge = ({ children, colors }: any) => (
  <div
    className="px-2.5 py-1 rounded-[8px] text-[10px] font-bold uppercase inline-flex items-center border shadow-sm"
    style={{
      backgroundColor: `${colors.primary500}10`,
      color: colors.primary700,
      borderColor: `${colors.primary500}30`
    }}
  >
    {children}
  </div>
);

const flowSteps = [
  { num: 1, title: "Identity & Profile", desc: "Configure your name, professional title, bio, contact info and profile photo.", icon: FaUser, url: "/profile", color: "primary500" },
  { num: 2, title: "Technical Stack", desc: "Catalogue your tech stack with categories and proficiency levels.", icon: FaCode, url: "/skills", color: "success500" },
  { num: 3, title: "Experience & Education", desc: "Build your professional timeline with companies, roles, schools and degrees.", icon: FaBookOpen, url: "/experience", color: "warning500" },
  { num: 4, title: "Project Showcase", desc: "Upload screenshots, write descriptions, link to live demos and GitHub repos.", icon: FaProjectDiagram, url: "/projects", color: "primary500" },
  { num: 5, title: "Credentials & Awards", desc: "Add your certifications, achievements, and testimonials to build trust.", icon: FaLightbulb, url: "/achievements", color: "success500" },
  { num: 6, title: "Social Connectivity", desc: "Connect GitHub, LinkedIn, Twitter and other social profiles to your portfolio.", icon: FaShareAlt, url: "/social-links", color: "warning500" },
  { num: 7, title: "Theme Customization", desc: "Pick from preset color themes or build your own visual style.", icon: FaPalette, url: "/themes", color: "primary500" },
  { num: 8, title: "Resume Management", desc: "Upload and manage your CVs/Resumes for direct visitor download.", icon: FaBolt, url: "/resumes", color: "success500" },
  { num: 9, title: "Configure Sidebar Nav", desc: "Admin-only: order and toggle the dashboard sidebar navigation links.", icon: FaLink, url: "/nav-links", color: "warning500" },
  { num: 10, title: "Preview & Audit", desc: "View your portfolio exactly as visitors will see it before publishing.", icon: FaGlobe, url: "/portfolio", color: "primary500" },
  { num: 11, title: "Production Deployment", desc: "Push your final changes to production and verify your live portfolio.", icon: FaRocket, url: "/help", color: "success500" },
];

const adminModules = [
  { title: "User Governance", desc: "Orchestrate team access, monitor account status, and manage administrative privileges across the platform.", icon: FaUsers, url: "/users" },
  { title: "Granular RBAC", desc: "Implement Role-Based Access Control by defining custom roles with precise module-level permissions.", icon: FaShieldAlt, url: "/roles" },
  { title: "Communication Hub", desc: "Architect automated email and push notification templates using dynamic token variables.", icon: FaBell, url: "/notification-templates" },
  { title: "Structural Configuration", desc: "Dynamically manage the dashboard's sidebar hierarchy, link visibility, and navigation priorities.", icon: FaLink, url: "/nav-links" },
];

const deploymentSteps = [
  { title: "Version Control Push", desc: "Commit and push your latest code changes to your primary GitHub repository.", icon: FaGithub },
  { title: "Pipeline Execution", desc: "Trigger your CI/CD pipeline to initiate the automated testing and build sequence.", icon: FaBolt },
  { title: "Asset Optimization", desc: "Compile the React application into high-performance static production assets.", icon: FaCode },
  { title: "Edge Deployment", desc: "Synchronize the production build with your hosting provider's global edge network.", icon: FaCloudUploadAlt },
  { title: "Domain Validation", desc: "Verify your custom domain connectivity and ensure SSL certificates are active.", icon: FaGlobe },
];

const BuildFlow = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-6">
    <Card colors={colors}>
      <p className="text-sm font-medium mb-6" style={{ color: colors.neutral500 }}>
        Follow these steps in order to build a complete portfolio from scratch.
      </p>
      <div className="relative">
        <div
          className="absolute left-[27px] top-4 bottom-4 w-px hidden sm:block opacity-20"
          style={{
            background: `linear-gradient(to bottom, ${colors.primary500}, ${colors.primary200}, transparent)`
          }}
        />
        <div className="space-y-4">
          {flowSteps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={s.url}
                className="flex items-start gap-5 p-4 rounded-[16px] border transition-all duration-300 group/item no-underline"
                style={{
                  borderColor: `${colors.neutral200}40`,
                  color: "inherit"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary500}40`;
                  e.currentTarget.style.backgroundColor = `${colors.primary500}05`;
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.neutral200}40`;
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div className="relative shrink-0">
                  <div
                    className="h-14 w-14 rounded-[14px] border flex flex-col items-center justify-center transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: colors.neutral0,
                      borderColor: `${colors.neutral200}80`
                    }}
                  >
                    <span className="text-[8px] uppercase tracking-widest font-black opacity-40" style={{ color: colors.neutral500 }}>
                      Step
                    </span>
                    <span className="font-black text-lg" style={{ color: colors.primary600 }}>
                      {s.num}
                    </span>
                  </div>
                </div>
                <div
                  className="h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 mt-2 shadow-sm"
                  style={{ backgroundColor: `${colors[s.color]}10` }}
                >
                  <s.icon style={{ fontSize: 18, color: colors[s.color] }} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-base m-0" style={{ color: colors.neutral800 }}>{s.title}</h4>
                    {s.num === 9 && <Badge colors={colors}>Admin Only</Badge>}
                  </div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: colors.neutral500 }}>
                    {s.desc}
                  </p>
                </div>
                <FaArrowRight
                  className="mt-4 shrink-0 transition-all duration-300 opacity-20 group-hover/item:opacity-100 group-hover/item:translate-x-1"
                  style={{ fontSize: 14, color: colors.primary500 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

const AdminModules = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-6">
    <Card colors={colors}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${colors.primary500}10` }}>
          <FaShieldAlt style={{ fontSize: 20, color: colors.primary500 }} />
        </div>
        <div>
          <h4 className="text-lg font-black m-0" style={{ color: colors.neutral800 }}>Administrative Control Hub</h4>
          <p className="text-sm mt-0.5" style={{ color: colors.neutral500 }}>Exclusive modules for platform governance and management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminModules.map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link
              to={m.url}
              className="flex items-start gap-4 p-5 rounded-[18px] border transition-all duration-300 group/item no-underline h-full"
              style={{
                borderColor: `${colors.neutral200}60`,
                color: "inherit",
                backgroundColor: `${colors.neutral50}50`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.primary500}40`;
                e.currentTarget.style.backgroundColor = `${colors.primary500}05`;
                e.currentTarget.style.boxShadow = `0 10px 25px ${colors.neutral900}08`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${colors.neutral200}60`;
                e.currentTarget.style.backgroundColor = `${colors.neutral50}50`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="h-12 w-12 rounded-[14px] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover/item:scale-110"
                style={{ backgroundColor: colors.neutral0, border: `1px solid ${colors.neutral200}40` }}
              >
                <m.icon style={{ fontSize: 22, color: colors.primary500 }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base m-0 transition-colors duration-300 group-hover/item:text-primary-600" style={{ color: colors.neutral800 }}>
                  {m.title}
                </h4>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: colors.neutral500 }}>
                  {m.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>

    <Card colors={colors} className="bg-gradient-to-br from-transparent to-primary-500/05">
      <div className="flex items-center gap-3 mb-4">
        <FaCog style={{ fontSize: 18, color: colors.neutral400 }} />
        <h4 className="text-sm font-bold m-0" style={{ color: colors.neutral700 }}>Governance Protocol</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { text: "Manage individual profiles and cross-module content.", bold: "Standard Access" },
          { text: "Full visibility of Administration groups & system logs.", bold: "Admin Privileges" },
          { text: "Immutable system roles to prevent accidental lockout.", bold: "Security Policy" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl border" style={{ borderColor: `${colors.neutral200}40` }}>
            <FaCheckCircle style={{ fontSize: 16, color: colors.success500 }} />
            <p className="m-0 text-xs leading-relaxed" style={{ color: colors.neutral600 }}>
              <span className="font-black block mb-1" style={{ color: colors.neutral900 }}>{item.bold}</span> {item.text}
            </p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const Deployment = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-6">
    <Card
      colors={colors}
      style={{ background: `linear-gradient(135deg, ${colors.primary500}15 0%, transparent 100%)` }}
      className="p-8"
    >
      <div className="flex items-center gap-6">
        <div
          className="h-16 w-16 rounded-[20px] flex items-center justify-center shrink-0 shadow-lg animate-pulse"
          style={{ backgroundColor: colors.primary500, boxShadow: `0 0 30px ${colors.primary500}40` }}
        >
          <FaRocket style={{ color: '#FFF', fontSize: 28 }} />
        </div>
        <div>
          <h3 className="text-2xl font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>Enterprise-Grade Deployment</h3>
          <p className="text-base mt-1 font-medium opacity-60" style={{ color: colors.neutral600 }}>
            Automated CI/CD pipelines ensuring high availability and global performance.
          </p>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-sm font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: colors.neutral900 }}>Standard Operating Procedure</h4>
        {deploymentSteps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="flex items-center gap-5 p-5 rounded-[20px] border group/step transition-all duration-300"
              style={{ borderColor: `${colors.neutral200}60`, backgroundColor: `${colors.neutral0}80` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.primary500}30`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${colors.neutral200}60`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="h-12 w-12 rounded-[14px] flex items-center justify-center shrink-0 font-black text-xl transition-all duration-300 group-hover/step:scale-110"
                style={{ backgroundColor: `${colors.primary500}10`, color: colors.primary600, border: `1px solid ${colors.primary500}20` }}
              >
                <s.icon style={{ fontSize: 22 }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black opacity-30 uppercase tracking-tighter" style={{ color: colors.neutral900 }}>
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-bold text-base m-0" style={{ color: colors.neutral800 }}>{s.title}</h4>
                </div>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: colors.neutral500 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <h4 className="text-sm font-black uppercase tracking-widest opacity-40 ml-1" style={{ color: colors.neutral900 }}>Architecture Sync</h4>
        <Card colors={colors} className="flex flex-col gap-5 border-dashed" style={{ borderColor: `${colors.primary500}40` }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.warning500}15` }}>
              <FaBolt style={{ color: colors.warning500, fontSize: 18 }} />
            </div>
            <h4 className="font-bold m-0 text-sm">Real-time Synchronization</h4>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: colors.neutral600 }}>
            UI and client-side logic require manual build triggers to propagate changes to the global edge network.
          </p>
          <div className="h-px w-full" style={{ backgroundColor: `${colors.neutral200}40` }} />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary500}15` }}>
              <FaCloudUploadAlt style={{ color: colors.primary500, fontSize: 18 }} />
            </div>
            <h4 className="font-bold m-0 text-sm">Database Persistence</h4>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: colors.neutral600 }}>
            Dynamic content changes (skills, projects, experiences) are persisted instantly across all production clusters.
          </p>
        </Card>
      </div>
    </div>
  </div>
);

const FAQ = ({ colors }: { colors: any }) => (
  <div className="mt-6 space-y-4">
    {[
      { q: "How do I change the color theme?", a: "Go to Themes → pick a preset or create a custom palette → click Preview to see it live, then Apply to commit it across the entire app." },
      { q: "Can I reorder skills, projects and links?", a: "Yes — pages with sortable lists (Skills, Projects, Nav Links, Social Links) have a drag handle on the left of each row. Drag rows to reorder, the order saves automatically." },
      { q: "Why don't I see Users / Roles / Nav Links in the sidebar?", a: "Those are admin-only modules. Your account must have the admin role to see them. The mock auth user is set to admin by default." },
      { q: "What is the difference between Nav Links and Social Links?", a: "Nav Links control the dashboard sidebar navigation entries (admin-only). Social Links manage your public profile URLs (GitHub, LinkedIn etc.) shown on the portfolio (managed by every user)." },
      { q: "How do visitors see my portfolio?", a: "They visit the public URL (created when you publish). The /portfolio route renders the visitor-facing view, styled with your selected theme." },
      { q: "Where can I switch between light and dark mode?", a: "Use the theme toggle in the dashboard header, or go to Settings → Appearance for full control including system mode." },
    ].map((f, i) => (
      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
        <Card colors={colors} className="p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex gap-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center font-black text-sm shadow-sm" style={{ backgroundColor: `${colors.primary500}15`, color: colors.primary600, border: `1px solid ${colors.primary500}20` }}>Q</div>
            <div>
              <h4 className="font-bold text-base m-0 leading-tight" style={{ color: colors.neutral900 }}>{f.q}</h4>
              <p className="text-sm mt-3 leading-relaxed opacity-70 font-medium" style={{ color: colors.neutral600 }}>{f.a}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
);

export default function HelpPage() {
  const colors = useColors();
  const { user } = useAuthenticatedUser();
  const [activeTab, setActiveTab] = useState("flow");

  const schema = useMemo(() => {
    const baseSchema: ITabsSchema[] = [
      { label: "Build Flow", value: "flow", component: <BuildFlow colors={colors} />, icon: <FaProjectDiagram /> },
      { label: "Deployment", value: "deploy", component: <Deployment colors={colors} />, icon: <FaRocket /> },
      { label: "FAQ", value: "faq", component: <FAQ colors={colors} />, icon: <FaLightbulb /> },
    ];

    if (user?.roleName !== "USER") {
      baseSchema.splice(1, 0, {
        label: "Admin Modules",
        value: "admin",
        component: <AdminModules colors={colors} />,
        icon: <FaShieldAlt />
      });
    }

    return baseSchema;
  }, [user?.roleName, colors]);

  return (
    <div className="relative w-full mx-auto py-10 px-6 sm:px-10 min-h-screen overflow-hidden">
      <div
        className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] blur-[120px] opacity-[0.07] pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.primary500}, transparent)` }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] blur-[100px] opacity-[0.05] pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.accent500 || colors.primary400}, transparent)` }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
          <div
            className="h-20 w-20 rounded-[24px] flex items-center justify-center shadow-2xl relative"
            style={{
              backgroundColor: colors.neutral0,
              border: `1px solid ${colors.neutral200}40`,
              boxShadow: `0 20px 40px ${colors.neutral900}10`
            }}
          >
            <FaLightbulb style={{ color: colors.primary500, fontSize: 32 }} />
            <div
              className="absolute inset-0 rounded-[24px] blur-xl opacity-20"
              style={{ backgroundColor: colors.primary500 }}
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>
              System <span style={{ color: colors.primary500 }}>Guide</span>
            </h1>
            <p className="text-lg mt-2 font-medium opacity-50" style={{ color: colors.neutral600 }}>
              Advanced operational manual for your professional portfolio architecture.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10">
        <Tabs
          schema={schema}
          value={activeTab}
          setValue={setActiveTab}
          fullWidth
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-[100]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}
