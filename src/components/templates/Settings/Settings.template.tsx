import React, { useState } from "react";
import { FiLock } from "react-icons/fi";

import { Tabs, type ITabsSchema } from "../../atoms/Tabs/Tabs";
import PasswordTab from "./PasswordTab";

interface SettingsTemplateProps {
  handleChangePasswordSubmit: (values: any) => void;
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  handleChangePasswordSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<string>("password");

  const tabs: ITabsSchema[] = [
    {
      label: "Change Password",
      value: "password",
      icon: <FiLock />,
      component: (
        <PasswordTab
          handleChangePasswordSubmit={handleChangePasswordSubmit}
        />
      ),
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Account Settings
        </h2>
        <p className="text-gray-600">
          Manage your security preferences and account configuration
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            Security Settings
          </h3>
          <Tabs
            schema={tabs}
            value={activeTab}
            setValue={(val: string) => {
              setActiveTab(val);
            }}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsTemplate;
