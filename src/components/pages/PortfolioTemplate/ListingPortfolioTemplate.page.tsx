import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLayout } from "react-icons/fi";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { HTTP_STATUS } from "../../../utils/types";
import { useProfileTemplateService, type TemplateKey } from "../../../services/useProfileTemplateService";
import { PORTFOLIO_TEMPLATES } from "../../../utils/portfolioTemplates";
import { PageHeaderBanner } from "../../templates/Dashboard/shared/DashboardUI";
import TemplateCard from "../../templates/PortfolioTemplate/TemplateCard.template";

const ListingPortfolioTemplatePage: React.FC = () => {
  const isMobile = useIsMobile();
  const profileTemplateService = useProfileTemplateService();
  const [optimisticActive, setOptimisticActive] = useState<TemplateKey | null>(null);

  const { data: activeTemplateKey } = useQuery({
    queryKey: ["profile-template"],
    queryFn: async () => {
      const res = await profileTemplateService.getProfileTemplate();
      if (res?.status === HTTP_STATUS.OK) return (res.data.data?.templateKey ?? "CLASSIC") as TemplateKey;
      return "CLASSIC" as TemplateKey;
    },
  });

  const activeKey = optimisticActive ?? activeTemplateKey ?? "CLASSIC";

  return (
    <div style={{ padding: isMobile ? "12px 10px 24px" : "20px 20px 32px" }}>
      <PageHeaderBanner
        icon={<FiLayout size={17} />}
        title="Portfolio Templates"
        subtitle="Choose the visual design your public portfolio renders with"
      />

      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {PORTFOLIO_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.key}
            template={template}
            isActive={template.key === activeKey}
            onApplied={setOptimisticActive}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingPortfolioTemplatePage;
