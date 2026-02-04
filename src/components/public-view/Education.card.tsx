import React, { memo, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiMapPin,
  FiChevronDown,
  FiAward,
} from "react-icons/fi";
import { useColors } from "../../utils/types";
import { sanitizeHtml } from "../../utils/helper";
import { type Education } from "../../services/useEducationService";

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  const durationText = useMemo(
    () =>
      education.endYear
        ? `${education.startYear} – ${education.endYear}`
        : `${education.startYear} – Present`,
    [education.startYear, education.endYear]
  );

  return (
    <article
      className="group relative flex flex-col gap-6 p-7 rounded-3xl border transition-all duration-500 hover:-translate-y-1"
      style={{
        backgroundColor: colors.neutral900,
        borderColor: colors.neutral700,
        boxShadow: `0 24px 60px ${colors.neutral900}cc`,
      }}
    >
      {/* Header */}
      <header className="flex gap-5">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
          style={{
            backgroundColor: colors.primary100,
            color: colors.primary600,
          }}
        >
          <FiBookOpen size={24} />
        </div>

        <div className="flex flex-col gap-1">
          <h2
            className="text-xl font-semibold tracking-tight leading-snug"
            style={{ color: colors.neutral50 }}
          >
            {education.degree}
          </h2>

          <span
            className="text-sm font-medium"
            style={{ color: colors.primary300 }}
          >
            Specialization: {education.fieldOfStudy}
          </span>

          <span
            className="text-sm"
            style={{ color: colors.neutral400 }}
          >
            {education.institution}
          </span>
        </div>
      </header>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ backgroundColor: colors.neutral700 }}
      />

      {/* Meta Information */}
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <div className="flex items-center gap-2 text-sm">
          <FiCalendar size={14} style={{ color: colors.primary400 }} />
          <span style={{ color: colors.neutral200 }}>
            {durationText}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FiMapPin size={14} style={{ color: colors.primary400 }} />
          <span style={{ color: colors.neutral200 }}>
            {education.location}
          </span>
        </div>

        {education.grade && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: colors.primary100,
              color: colors.primary700,
            }}
          >
            <FiAward size={14} />
            {education.gradeType
              ? `${education.gradeType}: ${education.grade}`
              : `Academic Performance: ${education.grade}`}
          </div>
        )}
      </div>

      {/* Academic Impact */}
      {education.description && (
        <section className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="flex items-center justify-between group"
          >
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: colors.neutral400 }}
            >
              Academic Impact & Learnings
            </span>

            <FiChevronDown
              size={18}
              className={`transition-all duration-500 ${
                open ? "rotate-180 translate-y-0.5" : ""
              }`}
              style={{ color: colors.neutral400 }}
            />
          </button>

          <div
            className="transition-all duration-500 ease-out"
            style={{
              maxHeight: open ? "360px" : "0px",
              opacity: open ? 1 : 0,
              filter: open ? "blur(0)" : "blur(2px)",
            }}
          >
            <div
              className="text-sm leading-relaxed rounded-2xl p-5 mt-2"
              style={{
                backgroundColor: colors.neutral800,
                border: `1px solid ${colors.neutral700}`,
                color: colors.neutral200,
              }}
            >
              {sanitizeHtml(education.description)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default memo(EducationCard);
