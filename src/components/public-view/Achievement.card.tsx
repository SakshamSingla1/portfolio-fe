import React, { memo, useState } from "react";
import { FiAward, FiExternalLink, FiCalendar, FiChevronDown } from "react-icons/fi";
import { useColors } from "../../utils/types";
import { type Achievement } from "../../services/useAchievementService";
import { sanitizeHtml } from "../../utils/helper";

interface AchievementProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementProps> = ({ achievement }) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  const issuedAt = achievement.achievedAt
    ? new Date(achievement.achievedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <article
      className="relative flex flex-col gap-6 p-6 rounded-2xl border transition-shadow duration-300 hover:shadow-xl"
      style={{
        backgroundColor: colors.neutral900,
        borderColor: colors.neutral700,
        boxShadow: `0 6px 18px ${colors.neutral900}55`,
      }}
    >
      {/* Header */}
      <header className="flex items-center gap-3 h-[50px]">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{
            backgroundColor: colors.primary100,
            color: colors.primary600,
          }}
        >
          <FiAward size={18} />
        </div>

        <h2
          className="text-lg font-semibold"
          style={{ color: colors.neutral50 }}
        >
          {achievement.title}
        </h2>
      </header>

      {/* Divider */}
      <div className="h-px w-full" style={{ backgroundColor: colors.neutral700 }} />

      {/* Issued By */}
      <section className="flex flex-col gap-1">
        <span
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: colors.neutral400 }}
        >
          Issued by
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: colors.neutral200 }}
        >
          {achievement.issuer}
        </span>
      </section>

      {/* Issued At */}
      <section className="flex flex-col gap-1">
        <span
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: colors.neutral400 }}
        >
          Issued at
        </span>
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: colors.neutral200 }}
        >
          <FiCalendar size={14} />
          {issuedAt}
        </div>
      </section>

      {/* Description (Dropdown) */}
      <section className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center justify-between text-left"
        >
          <span
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: colors.neutral400 }}
          >
            Description
          </span>

          <FiChevronDown
            size={16}
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            style={{ color: colors.neutral400 }}
          />
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: open ? "300px" : "0px",
            opacity: open ? 1 : 0,
          }}
        >
          <div
            className="text-sm leading-relaxed rounded-xl p-4 mt-2"
            style={{
              backgroundColor: colors.neutral800,
              border: `1px solid ${colors.neutral700}`,
              color: colors.neutral200,
            }}
          >
            {sanitizeHtml(achievement.description)}
          </div>
        </div>
      </section>

      {achievement.proofUrl && (
        <footer className="mt-auto pt-4">
          <a
            href={achievement.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: colors.primary400 }}
          >
            View credential
            <FiExternalLink />
          </a>
        </footer>
      )}
    </article>
  );
};

export default memo(AchievementCard);
