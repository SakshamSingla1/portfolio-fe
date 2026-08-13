import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { FiEdit, FiDownload, FiFile, FiGlobe, FiMail, FiMapPin, FiSettings, FiCode, FiZap, FiBriefcase } from "react-icons/fi";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useProfileService, type ProfileRequest } from "../../../services/useProfileService";
import { useDashboardService } from "../../../services/useDashboardService";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import ProfileFormTemplate, { SectionCard } from "../../templates/Profile/ProfileForm.template";
import Button from "../../atoms/Button/Button";
import LiveSiteControl from "../../molecules/LiveSiteControl/LiveSiteControl";
import { useIsMobile } from "../../../hooks/useIsMobile";

const API_BASE = import.meta.env.VITE_API_V1_URL as string;
const API_ORIGIN = API_BASE.replace(/\/api\/v1.*$/, "");

const validationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  fullName: Yup.string().min(3).required("Full name is required"),
  email: Yup.string().email().required("Email is required"),
  title: Yup.string().required("Title is required"),
  phone: Yup.string().required("Phone is required"),
  location: Yup.string().required("Location is required"),
  aboutMe: Yup.string().required("About is required"),
  profileImageUrl: Yup.string().required("Profile image is required"),
  profileImagePublicId: Yup.string().required(),
  logoUrl: Yup.string().required("Logo is required"),
  logoPublicId: Yup.string().required(),
});

const EMPTY_PROFILE: ProfileRequest = {
  userName: "",
  fullName: "",
  email: "",
  title: "",
  phone: "",
  location: "",
  aboutMe: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
  profileImageUrl: "",
  profileImagePublicId: "",
  aboutMeImageUrl: "",
  aboutMeImagePublicId: "",
  logoUrl: "",
  logoPublicId: "",
  availableForWork: false,
  availabilityNote: "",
  availableFrom: "",
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const colors = useColors();
  const isMobile = useIsMobile();
  const { showSnackbar } = useSnackbar();
  const profileService = useProfileService();
  const dashboardService = useDashboardService();
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDiscoverable, setIsDiscoverable] = useState<boolean>(true);
  const [digestEnabled, setDigestEnabled] = useState<boolean>(true);
  const [settingsSaving, setSettingsSaving] = useState<boolean>(false);
  const [embedCopied, setEmbedCopied] = useState<boolean>(false);
  const [emailCopyState, setEmailCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await profileService.get();
      if (response.status === HTTP_STATUS.OK) {
        return response.data.data as ProfileRequest;
      }
      return null;
    },
  });

  // Same queryKey the Dashboard uses — shares its cache instead of double-fetching
  // when a user moves between the two pages.
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await dashboardService.getByProfile();
      if (response?.status === HTTP_STATUS.OK) {
        return response.data.data;
      }
      return null;
    },
  });

  const formik = useFormik<ProfileRequest>({
    initialValues: profileData ?? EMPTY_PROFILE,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await profileService.update(values);
        if (response.status === HTTP_STATUS.OK) {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          showSnackbar("success", response.data.message);
          navigate(ADMIN_ROUTES.PROFILE);
        }
      } catch {
        showSnackbar("error", "Failed to update profile");
      }
    },
  });

  useEffect(() => {
    setIsEditMode(searchParams.get("mode") === MODE.EDIT);
  }, [searchParams]);

  useEffect(() => {
    if (profileData) {
      setIsDiscoverable((profileData as any).isDiscoverable ?? true);
      setDigestEnabled((profileData as any).digestEmailEnabled ?? true);
    }
  }, [profileData]);

  const handleSettingToggle = async (field: "isDiscoverable" | "digestEmailEnabled", value: boolean) => {
    setSettingsSaving(true);
    try {
      await profileService.updateSettings({ [field]: value });
      if (field === "isDiscoverable") setIsDiscoverable(value);
      else setDigestEnabled(value);
      showSnackbar("success", "Setting updated");
    } catch {
      showSnackbar("error", "Failed to update setting");
    } finally {
      setSettingsSaving(false);
    }
  };

  const downloadQrCode = () => {
    const userName = profileData?.userName;
    if (!userName) return;
    const a = document.createElement("a");
    a.href = `${API_BASE}/public/qr/${userName}`;
    a.download = `portfolio-qr-${userName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPortfolioPdf = () => {
    const userName = profileData?.userName;
    if (!userName) return;
    const a = document.createElement("a");
    a.href = `${API_BASE}/public/portfolio-export/${userName}`;
    a.download = `portfolio-${userName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const embedSnippet = profileData?.userName
    ? `<iframe src="${API_ORIGIN}/embed/${profileData.userName}" width="420" height="540" frameborder="0" style="border:none;border-radius:18px;overflow:hidden;" title="${(profileData as any).fullName ?? 'Portfolio'} — Portfolio Card"></iframe>`
    : "";

  const copyEmbedSnippet = () => {
    if (!embedSnippet) return;
    navigator.clipboard.writeText(embedSnippet).then(() => {
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    });
  };

  const copyForEmail = async () => {
    if (!profileData?.userName) return;
    setEmailCopyState("copying");
    try {
      const res = await fetch(`${API_ORIGIN}/embed/${profileData.userName}/email`);
      if (!res.ok) throw new Error("Failed to fetch email card");
      const html = await res.text();

      const plainTextFallback = `${API_ORIGIN}/embed/${profileData.userName}`;
      if (navigator.clipboard && "write" in navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plainTextFallback], { type: "text/plain" }),
          }),
        ]);
      } else {
        // Fallback for browsers without rich-clipboard support — at least get the link across
        await navigator.clipboard.writeText(plainTextFallback);
      }
      setEmailCopyState("copied");
    } catch {
      setEmailCopyState("error");
    } finally {
      setTimeout(() => setEmailCopyState("idle"), 2500);
    }
  };

  return (
    <div className="relative">
      <div className="relative" style={{ padding: isMobile ? "20px 0px" : "32px 24px" }}>
        {!isEditMode && (
          isMobile ? (
            <button
              onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)}
              className="absolute top-4 right-4 z-10"
              style={{ backgroundColor: colors.primary50, border: `1px solid ${colors.primary200}`, borderRadius: 12, padding: 8, cursor: "pointer", color: colors.primary500 }}
            >
              <FiEdit />
            </button>
          ) : (
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="primaryContained"
                label="Edit Profile"
                onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)}
              />
            </div>
          )
        )}
        <h1 className={`font-bold ${isMobile ? "text-xl" : "text-2xl"}`}>{isEditMode ? "Edit Profile" : "My Profile"}</h1>
        <p className="mt-1" style={{ color: colors.neutral700 }}>
          Manage your personal & professional information
        </p>
      </div>
      <div className="pb-10">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading profile...
          </div>
        ) : (
          <>
            {!isEditMode && profileData && (
              <div
                className="rounded-2xl mb-6 overflow-hidden"
                style={{ border: `1px solid ${colors.neutral200}`, boxShadow: `0 1px 4px rgba(0,0,0,0.04)` }}
              >
                <div
                  className="flex items-center gap-5 flex-wrap sm:flex-nowrap"
                  style={{
                    backgroundColor: colors.primary600,
                    backgroundImage: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary700})`,
                    padding: isMobile ? "20px" : "28px 28px 24px",
                  }}
                >
                  {profileData.profileImageUrl ? (
                    <img
                      src={profileData.profileImageUrl}
                      alt={profileData.fullName}
                      className="rounded-full object-cover shrink-0"
                      style={{ width: 84, height: 84, border: "3px solid rgba(255,255,255,0.85)" }}
                    />
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ width: 84, height: 84, background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 28, border: "3px solid rgba(255,255,255,0.85)" }}
                    >
                      {(profileData.fullName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold truncate" style={{ color: "#fff" }}>{profileData.fullName}</h2>
                      {profileData.availableForWork && (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                        >
                          ● Open to Work
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>{profileData.title}</p>
                    {profileData.location && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                        <FiMapPin size={13} />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between gap-4 flex-wrap px-6 py-4"
                  style={{ background: colors.neutral0 }}
                >
                  {dashboardData?.stats && (
                    <div className="flex items-center gap-5">
                      {[
                        { icon: FiCode, value: dashboardData.stats.totalProjects, label: "Projects" },
                        { icon: FiZap, value: dashboardData.stats.totalSkills, label: "Skills" },
                        { icon: FiBriefcase, value: dashboardData.stats.totalExperience, label: "Experience" },
                      ].map(({ icon: Icon, value, label }, i) => (
                        <div key={label} className="flex items-center gap-4">
                          {i > 0 && <div style={{ width: 1, height: 24, background: colors.neutral200 }} />}
                          <div className="flex items-center gap-2">
                            <Icon size={14} style={{ color: colors.primary500 }} />
                            <div>
                              <div className="text-sm font-bold leading-none" style={{ color: colors.neutral900 }}>{value}</div>
                              <div className="text-[10px] mt-0.5" style={{ color: colors.neutral400 }}>{label}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <LiveSiteControl portfolioUrl={dashboardData?.profileSummary?.portfolioUrl} isMobile={isMobile} />
                </div>
              </div>
            )}
            <ProfileFormTemplate
              formik={formik}
              isEditMode={isEditMode}
              onEditClick={() => navigate(ADMIN_ROUTES.PROFILE)}
            />
          </>
        )}

        {!isEditMode && !isLoading && (
          <div className="mt-6 space-y-6">
            <SectionCard
              title="Portfolio Settings"
              subtitle="Control discoverability, notifications, and your QR code."
              icon={FiSettings}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.neutral100}` }}>
                  <div className="flex items-center gap-3">
                    <FiGlobe style={{ color: colors.primary500 }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>Show on Explore</p>
                      <p className="text-xs" style={{ color: colors.neutral500 }}>Let others discover your portfolio on the public explore page</p>
                    </div>
                  </div>
                  <button
                    disabled={settingsSaving}
                    onClick={() => handleSettingToggle("isDiscoverable", !isDiscoverable)}
                    role="switch"
                    aria-checked={isDiscoverable}
                    aria-label="Show on Explore"
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: isDiscoverable ? colors.primary500 : colors.neutral300,
                      border: "none", cursor: "pointer", position: "relative",
                      transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <span style={{
                      position: "absolute", top: 3,
                      left: isDiscoverable ? 22 : 3,
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                    }} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.neutral100}` }}>
                  <div className="flex items-center gap-3">
                    <FiMail style={{ color: colors.primary500 }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>Weekly Email Digest</p>
                      <p className="text-xs" style={{ color: colors.neutral500 }}>Receive a summary of views, referrers, and messages every Monday</p>
                    </div>
                  </div>
                  <button
                    disabled={settingsSaving}
                    onClick={() => handleSettingToggle("digestEmailEnabled", !digestEnabled)}
                    role="switch"
                    aria-checked={digestEnabled}
                    aria-label="Weekly Email Digest"
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: digestEnabled ? colors.primary500 : colors.neutral300,
                      border: "none", cursor: "pointer", position: "relative",
                      transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <span style={{
                      position: "absolute", top: 3,
                      left: digestEnabled ? 22 : 3,
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                    }} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-3">
                    <FiDownload style={{ color: colors.primary500 }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>Portfolio QR Code</p>
                      <p className="text-xs" style={{ color: colors.neutral500 }}>Download a QR code linking to your public portfolio</p>
                    </div>
                  </div>
                  <button
                    onClick={downloadQrCode}
                    style={{
                      padding: "6px 16px", borderRadius: 10,
                      background: colors.primary50, border: `1px solid ${colors.primary200}`,
                      color: colors.primary600, fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Download PNG
                  </button>
                </div>
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 items-start">
              <SectionCard
                title="Export Portfolio"
                subtitle="Download a complete PDF — ideal for email submissions and HR systems."
                icon={FiFile}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiFile style={{ color: colors.primary500 }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>Full Portfolio PDF</p>
                    <p className="text-xs" style={{ color: colors.neutral500 }}>A single polished document, ready to attach anywhere</p>
                  </div>
                </div>

                <div className="rounded-xl p-3 mb-4" style={{ background: colors.neutral50, border: `1px solid ${colors.neutral200}` }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: colors.neutral500 }}>WHAT'S INCLUDED</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Profile & About", "Experience", "Education", "Skills", "Projects", "Certifications", "Achievements", "Publications", "Testimonials"].map(section => (
                      <span
                        key={section}
                        className="text-xs"
                        style={{
                          padding: "3px 10px", borderRadius: 999,
                          background: colors.neutral0, border: `1px solid ${colors.neutral200}`,
                          color: colors.neutral600,
                        }}
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={downloadPortfolioPdf}
                  style={{
                    width: "100%", padding: "8px 16px", borderRadius: 10,
                    background: colors.primary50, border: `1px solid ${colors.primary200}`,
                    color: colors.primary600, fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Download PDF
                </button>
              </SectionCard>

              <SectionCard
                title="Embed Widget"
                subtitle="Share a live card anywhere — GitHub README, personal website, or Notion page."
                icon={FiCode}
              >
                {profileData?.userName && (
                  <div
                    className="rounded-xl mb-4 flex items-center justify-center overflow-hidden"
                    style={{ background: colors.neutral100, border: `1px solid ${colors.neutral200}`, padding: 16 }}
                  >
                    <iframe
                      src={`${API_ORIGIN}/embed/${profileData.userName}`}
                      width={420}
                      height={540}
                      style={{ border: "none", borderRadius: 18, maxWidth: "100%", background: "#fff" }}
                      title={`${profileData.fullName ?? "Portfolio"} — Embed preview`}
                    />
                  </div>
                )}
                <div className="rounded-xl p-3 mb-4 font-mono text-xs break-all" style={{ background: colors.neutral50, border: `1px solid ${colors.neutral200}`, color: colors.neutral700 }}>
                  {embedSnippet}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyEmbedSnippet}
                    style={{
                      padding: "6px 16px", borderRadius: 10,
                      background: colors.primary50, border: `1px solid ${colors.primary200}`,
                      color: colors.primary600, fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {embedCopied ? "Copied!" : "Copy Snippet"}
                  </button>
                  {profileData?.userName && (
                    <a
                      href={`${API_ORIGIN}/embed/${profileData.userName}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "6px 16px", borderRadius: 10,
                        background: "transparent", border: `1px solid ${colors.neutral300}`,
                        color: colors.neutral600, fontSize: 13, fontWeight: 500,
                        cursor: "pointer", textDecoration: "none",
                      }}
                    >
                      Open in New Tab
                    </a>
                  )}
                  {profileData?.userName && (
                    <button
                      onClick={copyForEmail}
                      disabled={emailCopyState === "copying"}
                      title="Copies a version with clickable links you can paste directly into an email compose window"
                      style={{
                        padding: "6px 16px", borderRadius: 10,
                        background: emailCopyState === "error" ? colors.error50 : "transparent",
                        border: `1px solid ${emailCopyState === "error" ? colors.error200 : colors.neutral300}`,
                        color: emailCopyState === "error" ? colors.error600 : colors.neutral600,
                        fontSize: 13, fontWeight: 500,
                        cursor: emailCopyState === "copying" ? "not-allowed" : "pointer",
                        opacity: emailCopyState === "copying" ? 0.7 : 1,
                      }}
                    >
                      {emailCopyState === "copied" ? "Copied for Email!"
                        : emailCopyState === "copying" ? "Copying…"
                        : emailCopyState === "error" ? "Failed — try again"
                        : "Copy for Email"}
                    </button>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
