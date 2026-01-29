import React, { type ReactNode } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { styled } from "@mui/material/styles";
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

/* ---------------- Styled Components ---------------- */

const StyledTabList = styled(TabList)({
  "& .MuiTabs-flexContainer": {
    display: "flex",
    gap: 8,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

const StyledTab = styled(Tab)<{ colors: any }>(({ colors }) => ({
  textTransform: "none",
  fontSize: 14,
  fontWeight: 500,
  padding: "8px 14px",
  borderRadius: "10px 10px 0 0",
  minHeight: "auto",

  display: "flex",
  alignItems: "center",
  gap: 8,

  color: colors.neutral700,
  backgroundColor: colors.neutral100,
  border: `1px solid ${colors.neutral200}`,
  borderBottom: "none",

  transition: "all 0.2s ease",
  userSelect: "none",

  "& svg": {
    fontSize: 18,
  },

  "&:hover": {
    backgroundColor: colors.neutral200,
    color: colors.neutral900,
  },

  "&.Mui-selected": {
    backgroundColor: colors.primary50,
    color: `${colors.primary900} !important`,
    borderColor: colors.primary300,
    fontWeight: 500,
    zIndex: 2,
  },

  "&.Mui-disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}));

const LabelWrapper = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  lineHeight: 1,
});

const StyledTabPanel = styled(TabPanel)({
  padding: "12px 0",
});

/* ---------------- Component ---------------- */

export const Tabs: React.FC<TabsProps> = ({
  schema,
  value,
  setValue,
  fullWidth = false,
  selectedTabStyle,
}) => {
  const colors = useColors();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box width="100%">
      <TabContext value={value}>
        <Box className={fullWidth ? "w-full" : "w-max"}>
          <StyledTabList onChange={handleChange}>
            {schema.map((tab) => (
              <StyledTab
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                colors={colors}
                className={selectedTabStyle}
                label={
                  <LabelWrapper>
                    {tab.icon && tab.icon}
                    {tab.label}
                  </LabelWrapper>
                }
              />
            ))}
          </StyledTabList>
        </Box>

        {schema.map((tab) => (
          <StyledTabPanel key={tab.value} value={tab.value}>
            {tab.component}
          </StyledTabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default React.memo(Tabs);
