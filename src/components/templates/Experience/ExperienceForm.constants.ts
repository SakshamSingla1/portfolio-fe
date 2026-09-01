import { EmploymentStatus } from "../../../services/useExperienceService";

export const employmentStatusOptions = [
    { label: "Current", value: EmploymentStatus.CURRENT },
    { label: "Previous", value: EmploymentStatus.PREVIOUS },
    { label: "Internship", value: EmploymentStatus.INTERNSHIP },
    { label: "Contract", value: EmploymentStatus.CONTRACT },
    { label: "Freelance", value: EmploymentStatus.FREELANCE },
];
