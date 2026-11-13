import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { FiEdit, FiDownload, FiFile, FiGlobe, FiMail, FiMapPin, FiSettings, FiCode, FiLock } from "react-icons/fi";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { getOptimizedImageUrl } from "../../../utils/helper";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useProfileService, type ProfileRequest } from "../../../services/useProfileService";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import ProfileFormTemplate, { SectionCard } from "../../templates/Profile/ProfileForm.template";
import Button from "../../atoms/Button/Button";
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
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDiscoverable, setIsDiscoverable] = useState<boolean>(true);
  const [digestEnabled, setDigestEnabled] = useState<boolean>(true);
  const [settingsSaving, setSettingsSaving] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [hasAccessCode, setHasAccessCode] = useState<boolean>(false);
  const [showAccessCodeForm, setShowAccessCodeForm] = useState<boolean>(false);
  const [accessCodeInput, setAccessCodeInput] = useState<string>("");
  const [accessCodeSaving, setAccessCodeSaving] = useState<boolean>(false);
  const [embedCopied, setEmbedCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
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
      setIsPrivate((profileData as any).visibility === "PRIVATE");
      setHasAccessCode((profileData as any).hasAccessCode ?? false);
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

  // Turning PRIVATE on requires an access code to already exist (the backend rejects it
  // otherwise, since there'd be no way for anyone -- including the owner -- to get past the
  // gate). If none is set yet, this opens the access-code form instead of saving immediately;
  // the form's own submit handler flips visibility to PRIVATE once the code is saved.
  const handlePrivacyToggle = async (nextPrivate: boolean) => {
    if (nextPrivate && !hasAccessCode) {
      setShowAccessCodeForm(true);
      return;
    }
    setSettingsSaving(true);
    try {
      await profileService.updateSettings({ visibility: nextPrivate ? "PRIVATE" : "PUBLIC" });
      setIsPrivate(nextPrivate);
      showSnackbar("success", nextPrivate ? "Portfolio is now private" : "Portfolio is now public");
    } catch {
      showSnackbar("error", "Failed to update visibility");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSaveAccessCode = async () => {
    if (accessCodeInput.trim().length < 4) {
      showSnackbar("error", "Access code must be at least 4 characters");
      return;
    }
    setAccessCodeSaving(true);
    try {
      await profileService.setAccessCode({ accessCode: accessCodeInput.trim() });
      setHasAccessCode(true);
      setAccessCodeInput("");
      setShowAccessCodeForm(false);
      // First-time setup (opened from the privacy toggle, visibility still PUBLIC) also
      // turns privacy on right away so the owner doesn't have to flip the toggle a second time.
      if (!isPrivate) {
        await profileService.updateSettings({ visibility: "PRIVATE" });
        setIsPrivate(true);
      }
      showSnackbar("success", "Access code saved");
    } catch {
      showSnackbar("error", "Failed to save access code");
    } finally {
      setAccessCodeSaving(false);
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

  // The export endpoint renders a fresh PDF server-side on every hit (no XHR here to await, since
  // this triggers a plain browser download via an anchor tag) -- that render is the single most
  // memory-expensive thing the backend does, so a quick double-click used to be enough to stack two
  // of those renders concurrently and OOM the instance. This cooldown keeps repeat clicks from
  // firing overlapping requests; the backend also now rejects/serves-from-cache its own overlaps
  // independently, this is just the first line of defense.
  const downloadPortfolioPdf = () => {
    const userName = profileData?.userName;
    if (!userName || isExportingPdf) return;
    setIsExportingPdf(true);
    const a = document.createElement("a");
    a.href = `${API_BASE}/public/portfolio-export/${userName}`;
    a.download = `portfolio-${userName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setIsExportingPdf(false), 10000);
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
                className="rounded-2xl p-6 mb-6 flex items-center gap-5 flex-wrap sm:flex-nowrap"
                style={{ background: colors.neutral0, border: `1px solid ${colors.neutral200}`, boxShadow: `0 1px 4px rgba(0,0,0,0.04)` }}
              >
                {profileData.profileImageUrl ? (
                  <img
                    src={getOptimizedImageUrl(profileData.profileImageUrl, { width: 170, height: 170 })}
                    alt={profileData.fullName}
                    width={84}
                    height={84}
                    className="rounded-full object-cover shrink-0"
                    style={{ width: 84, height: 84, border: `1px solid ${colors.neutral200}` }}
                  />
                ) : (
                  <div
                    className="rounded-full flex items-center justify-center font-bold shrink-0"
                    style={{ width: 84, height: 84, background: colors.primary500, color: colors.neutral0, fontSize: 28 }}
                  >
                    {(profileData.fullName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold truncate" style={{ color: colors.neutral900 }}>{profileData.fullName}</h2>
                    {profileData.availableForWork && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                        style={{ background: `${colors.success500}15`, color: colors.success700 }}
                      >
                        ● Open to Work
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: colors.neutral600 }}>{profileData.title}</p>
                  {profileData.location && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: colors.neutral500 }}>
                      <FiMapPin size={13} />
                      <span>{profileData.location}</span>
                    </div>
                  )}
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

                <div className="py-3" style={{ borderBottom: `1px solid ${colors.neutral100}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiLock style={{ color: colors.primary500 }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>Private Portfolio</p>
                        <p className="text-xs" style={{ color: colors.neutral500 }}>Require an access code before anyone can view your public portfolio</p>
                      </div>
                    </div>
                    <button
                      disabled={settingsSaving}
                      onClick={() => handlePrivacyToggle(!isPrivate)}
                      role="switch"
                      aria-checked={isPrivate}
                      aria-label="Private Portfolio"
                      style={{
                        width: 44, height: 24, borderRadius: 12,
                        background: isPrivate ? colors.primary500 : colors.neutral300,
                        border: "none", cursor: "pointer", position: "relative",
                        transition: "background 0.2s", flexShrink: 0,
                      }}
                    >
                      <span style={{
                        position: "absolute", top: 3,
                        left: isPrivate ? 22 : 3,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s",
                      }} />
                    </button>
                  </div>

                  {hasAccessCode && !showAccessCodeForm && (
                    <button
                      onClick={() => setShowAccessCodeForm(true)}
                      className="mt-2 text-xs font-medium"
                      style={{ color: colors.primary600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      Change access code
                    </button>
                  )}

                  {showAccessCodeForm && (
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={accessCodeInput}
                        onChange={(e) => setAccessCodeInput(e.target.value)}
                        placeholder="New access code (min. 4 characters)"
                        className="flex-1 text-sm rounded-lg px-3 py-2"
                        style={{ border: `1px solid ${colors.neutral200}`, color: colors.neutral800 }}
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={accessCodeSaving}
                          onClick={handleSaveAccessCode}
                          className="text-xs font-semibold rounded-lg px-4 py-2"
                          style={{ background: colors.primary500, color: "#fff", border: "none", cursor: "pointer", opacity: accessCodeSaving ? 0.6 : 1 }}
                        >
                          {accessCodeSaving ? "Saving…" : "Save code"}
                        </button>
                        <button
                          disabled={accessCodeSaving}
                          onClick={() => { setShowAccessCodeForm(false); setAccessCodeInput(""); }}
                          className="text-xs font-semibold rounded-lg px-4 py-2"
                          style={{ background: colors.neutral100, color: colors.neutral600, border: "none", cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
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
                  disabled={isExportingPdf}
                  style={{
                    width: "100%", padding: "8px 16px", borderRadius: 10,
                    background: colors.primary50, border: `1px solid ${colors.primary200}`,
                    color: colors.primary600, fontSize: 13, fontWeight: 600,
                    cursor: isExportingPdf ? "not-allowed" : "pointer",
                    opacity: isExportingPdf ? 0.6 : 1,
                  }}
                >
                  {isExportingPdf ? "Preparing PDF…" : "Download PDF"}
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
