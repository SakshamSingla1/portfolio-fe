import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { FiEdit, FiDownload, FiFile, FiGlobe, FiMail } from "react-icons/fi";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useProfileService, type ProfileRequest } from "../../../services/useProfileService";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import ProfileFormTemplate from "../../templates/Profile/ProfileForm.template";
import Button from "../../atoms/Button/Button";
import { useIsMobile } from "../../../hooks/useIsMobile";

const API_BASE = import.meta.env.VITE_API_V1_URL as string;

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
  const [embedCopied, setEmbedCopied] = useState<boolean>(false);

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
    ? `<iframe src="${API_BASE.replace('/api/v1/public', '')}/embed/${profileData.userName}" width="420" height="460" frameborder="0" style="border:none;border-radius:12px;overflow:hidden;" title="${(profileData as any).fullName ?? 'Portfolio'} — Portfolio Card"></iframe>`
    : "";

  const copyEmbedSnippet = () => {
    if (!embedSnippet) return;
    navigator.clipboard.writeText(embedSnippet).then(() => {
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    });
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
          <ProfileFormTemplate
            formik={formik}
            isEditMode={isEditMode}
            onEditClick={() => navigate(ADMIN_ROUTES.PROFILE)}
          />
        )}

        {/* Growth settings card */}
        <div
          className="mx-auto mt-6 rounded-2xl p-6"
          style={{
            maxWidth: 720,
            background: colors.neutral0,
            border: `1px solid ${colors.neutral200}`,
          }}
        >
          <h2 className="font-bold text-base mb-1" style={{ color: colors.neutral800 }}>
            Portfolio Settings
          </h2>
          <p className="text-sm mb-5" style={{ color: colors.neutral500 }}>
            Control discoverability, notifications, and your QR code.
          </p>

          {/* Discoverable toggle */}
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

          {/* Digest toggle */}
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

          {/* QR download */}
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

        {/* PDF Export card */}
        <div
          className="mx-auto mt-6 rounded-2xl p-6"
          style={{
            maxWidth: 720,
            background: colors.neutral0,
            border: `1px solid ${colors.neutral200}`,
          }}
        >
          <h2 className="font-bold text-base mb-1" style={{ color: colors.neutral800 }}>
            Export Portfolio
          </h2>
          <p className="text-sm mb-5" style={{ color: colors.neutral500 }}>
            Download a complete PDF of your portfolio — ideal for email submissions and HR systems.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiFile style={{ color: colors.primary500 }} />
              <div>
                <p className="text-sm font-medium" style={{ color: colors.neutral800 }}>Full Portfolio PDF</p>
                <p className="text-xs" style={{ color: colors.neutral500 }}>All sections — experience, skills, projects, publications and more</p>
              </div>
            </div>
            <button
              onClick={downloadPortfolioPdf}
              style={{
                padding: "6px 16px", borderRadius: 10,
                background: colors.primary50, border: `1px solid ${colors.primary200}`,
                color: colors.primary600, fontSize: 13, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Embed Widget card */}
        <div
          className="mx-auto mt-6 rounded-2xl p-6"
          style={{
            maxWidth: 720,
            background: colors.neutral0,
            border: `1px solid ${colors.neutral200}`,
          }}
        >
          <h2 className="font-bold text-base mb-1" style={{ color: colors.neutral800 }}>
            Embed Widget
          </h2>
          <p className="text-sm mb-5" style={{ color: colors.neutral500 }}>
            Share a live card of your portfolio anywhere — GitHub README, personal website, or Notion page.
          </p>
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
                href={`${API_BASE.replace('/api/v1/public', '')}/embed/${profileData.userName}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "6px 16px", borderRadius: 10,
                  background: "transparent", border: `1px solid ${colors.neutral300}`,
                  color: colors.neutral600, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", textDecoration: "none",
                }}
              >
                Preview
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
