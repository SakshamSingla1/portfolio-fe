import React, { useState } from "react";
import { FiLock, FiShield, FiSearch, FiGithub, FiImage, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";
import Tabs, { type ITabsSchema } from "../../atoms/Tabs/Tabs";
import PasswordTab from "./PasswordTab";
import ChangeEmailTab from "./ChangeEmailTab";
import TwoFactorTab from "./TwoFactorTab";
import SeoTab from "./SeoTab";
import GitHubTab from "./GitHubTab";
import BannerTab from "./BannerTab";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { Card, SectionLabel, PageHeaderBanner } from "../Dashboard/shared/DashboardUI";

const SettingsTemplate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("password");
  const isMobile = useIsMobile();

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
      label: "Two-Factor Auth",
      value: "2fa",
      icon: <FiShield />,
      component: <TwoFactorTab />,
    },
    {
      label: "SEO",
      value: "seo",
      icon: <FiSearch />,
      component: <SeoTab />,
    },
    {
      label: "GitHub",
      value: "github",
      icon: <FiGithub />,
      component: <GitHubTab />,
    },
    {
      label: "Banner",
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
      style={{ padding: isMobile ? "8px 4px 16px" : "16px 16px 24px" }}
    >
      <PageHeaderBanner
        icon={<FiSettings size={17} />}
        title="Account Settings"
        subtitle="Manage your security preferences, visibility, and account configuration"
      />

      <Card hero>
        <SectionLabel>Settings</SectionLabel>
        <Tabs
          schema={tabs}
          value={activeTab}
          setValue={(val: string) => setActiveTab(val)}
          fullWidth
        />
      </Card>
    </motion.div>
  );
};

export default SettingsTemplate;
