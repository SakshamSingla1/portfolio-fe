import React, { useState } from "react";
import { FiLock, FiShield, FiSettings, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";
import Tabs, { type ITabsSchema } from "../../atoms/Tabs/Tabs";
import PasswordTab from "./PasswordTab";
import ChangeEmailTab from "./ChangeEmailTab";
import BannerTab from "./BannerTab";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";

const SettingsTemplate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("password");
  const colors = useColors();
  const { isDark } = useTheme();

  const cardShadow = isDark
    ? "0 2px 8px rgba(0,0,0,0.4)"
    : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";

  const tabs: ITabsSchema[] = [
    {
      label: "Change Password",
      value: "password",
      icon: <FiLock />,
      component: <PasswordTab />,
    },
    {
      label: "Change Email",
      value: "email",
      icon: <FiShield />,
      component: <ChangeEmailTab />,
    },
    {
      label: "Landing Banner",
      value: "banner",
      icon: <FiImage />,
      component: <BannerTab />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ padding: "16px 16px 24px" }}
    >
      {/* Page header card */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: colors.neutral0,
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
        }}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.primary600} 0%, ${colors.primary400}28 100%)` }} />
        <div className="px-5 py-4 flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: `${colors.primary500}12`, color: colors.primary600 }}
          >
            <FiSettings size={17} />
          </div>
          <div>
            <h1
              className="font-black tracking-tight"
              style={{ fontSize: 20, color: colors.neutral900, letterSpacing: "-0.025em", margin: 0 }}
            >
              Account Settings
            </h1>
            <p className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>
              Manage your security preferences and account configuration
            </p>
          </div>
        </div>
      </div>

      {/* Content card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: colors.neutral0,
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
        }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: `1px solid ${colors.neutral100}` }}
        >
          <div
            className="rounded-full"
            style={{ width: 7, height: 7, background: colors.primary500 }}
          />
          <span
            className="font-black uppercase tracking-widest"
            style={{ fontSize: "9px", color: colors.neutral500, letterSpacing: "0.1em" }}
          >
            Security Settings
          </span>
        </div>
        <div className="p-5">
          <Tabs
            schema={tabs}
            value={activeTab}
            setValue={(val: string) => setActiveTab(val)}
            fullWidth
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTemplate;
