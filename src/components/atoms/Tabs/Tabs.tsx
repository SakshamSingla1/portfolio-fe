import React, { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "../../../utils/types";

export interface ITabsSchema {
  label: string;
  component: ReactNode;
  disabled?: boolean;
  value: string;
  icon?: ReactNode;
}

interface TabsProps {
  schema: ITabsSchema[];
  value: string;
  setValue: (value: string) => void;
  fullWidth?: boolean;
  selectedTabStyle?: string;
}

const Tabs: React.FC<TabsProps> = ({
  schema,
  value,
  setValue,
  fullWidth = false,
  selectedTabStyle,
}) => {
  const colors = useColors();

  return (
    <div className="w-full">
      {/* Tabs List - God UI Style */}
      <div 
        className={`inline-flex p-1 rounded-2xl border ${fullWidth ? 'w-full' : 'w-max'}`}
        style={{ 
          backgroundColor: `${colors.neutral100}80`, // Glass effect base
          borderColor: colors.neutral200,
          backdropFilter: 'blur(8px)'
        }}
      >
        {schema.map((tab) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => !tab.disabled && setValue(tab.value)}
              disabled={tab.disabled}
              className={`
                relative flex items-center justify-center gap-2 px-4 py-2.5 
                text-sm font-semibold transition-all duration-300 rounded-xl
                ${fullWidth ? 'flex-1' : ''}
                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${selectedTabStyle && isActive ? selectedTabStyle : ''}
              `}
              style={{
                color: isActive ? colors.primary900 : colors.neutral600,
              }}
            >
              {/* Sliding Background Indicator - The God UI Secret */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 z-0 rounded-xl shadow-sm"
                  style={{ 
                    backgroundColor: colors.neutral0,
                    border: `1px solid ${colors.primary200}`,
                    boxShadow: `0 2px 10px ${colors.primary100}`
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon && (
                  <span 
                    className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 opacity-70'}`}
                    style={{ color: isActive ? colors.primary500 : 'inherit' }}
                  >
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels - Silky Smooth Transitions */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {schema.map((tab) => (
            value === tab.value && (
              <motion.div
                key={tab.value}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {tab.component}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(Tabs);
