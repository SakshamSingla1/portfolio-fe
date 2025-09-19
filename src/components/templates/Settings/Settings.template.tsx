import React, { useState } from "react";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import { Lock, Email, ErrorOutline, ArrowRight, CheckCircle, Cancel } from "@mui/icons-material";
import { HTTP_STATUS, type IUser } from "../../../utils/types";
import { motion, AnimatePresence } from "framer-motion";

import PasswordTab from "./PasswordTab";
import EmailTab from "./EmailTab";
import DangerZoneTab from "./DangerZoneTab";

interface SettingsTemplateProps {
  user: IUser | null;
  handleChangePasswordSubmit: (values: any) => void;
  handleEmailOtpSubmit: (values: any) => void;
  handleDeleteAccountSubmit: (values: any) => void;
}

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  content: React.ReactNode;
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  user,
  handleChangePasswordSubmit,
  handleEmailOtpSubmit,
  handleDeleteAccountSubmit,
}) => {
  const { showSnackbar } = useSnackbar();
  const { setAuthenticatedUser } = useAuthenticatedUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLogout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setFormStatus(null);
  };

  // Tabs config
  const tabs: TabType[] = [
    {
      id: "password",
      label: "Change Password",
      icon: <Lock />,
      description: "Update your account password",
      content: (
        <PasswordTab
          handleChangePasswordSubmit={handleChangePasswordSubmit}
          setFormStatus={setFormStatus}
        />
      ),
    },
    {
      id: "email",
      label: "Email Settings",
      icon: <Email />,
      description: "Update your email address",
      content: (
        <EmailTab
          user={user}
          handleEmailOtpSubmit={handleEmailOtpSubmit}
          setFormStatus={setFormStatus}
          showSnackbar={showSnackbar}
        />
      ),
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: <ErrorOutline color="error" />,
      description: "Manage your account security",
      content: (
        <DangerZoneTab
          user={user}
          handleDeleteAccountSubmit={handleDeleteAccountSubmit}
          setFormStatus={setFormStatus}
          showSnackbar={showSnackbar}
          handleLogout={handleLogout}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-gradient-to-b from-gray-50 to-white border-b md:border-r border-gray-200 p-6">
          <div className="sticky top-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3"></span>
              Account Settings
            </h2>
            <div className="space-y-3">
              {tabs.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(index)}
                  className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 ${
                    activeTab === index
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 shadow-sm"
                      : "bg-white border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl transition-all ${
                        activeTab === index 
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md" 
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                    >
                      {React.cloneElement(tab.icon as React.ReactElement, {
                        className: "w-5 h-5"
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold transition-colors text-sm sm:text-base ${
                        activeTab === index ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {tab.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{tab.description}</p>
                    </div>
                    <ArrowRight 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeTab === index ? "text-blue-500 rotate-0" : "text-gray-400 group-hover:text-blue-500 -rotate-45"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 bg-gray-50/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {formStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl border ${
                    formStatus.type === "success" 
                      ? "bg-green-50/80 border-green-200 text-green-800" 
                      : "bg-red-50/80 border-red-200 text-red-800"
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-3">
                    {formStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Cancel className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{formStatus.message}</p>
                    </div>
                    <button 
                      onClick={() => setFormStatus(null)} 
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1"
                      aria-label="Close notification"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
              
              <motion.div 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {tabs[activeTab].content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsTemplate;
