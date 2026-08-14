import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { FiCheck, FiCopy } from "react-icons/fi";
import Button from "../../atoms/Button/Button";
import TextField from "../../atoms/TextField/TextField";
import Select from "../../atoms/Select/Select";
import { useColors } from "../../../utils/types";
import type { CreateTestimonialLinkRequest } from "../../../services/useTestimonialLinkService";

const EXPIRY_OPTIONS = [
    { value: 7, label: "7 days" },
    { value: 14, label: "14 days" },
    { value: 30, label: "30 days" },
    { value: 60, label: "60 days" },
    { value: 90, label: "90 days" },
];

interface IGenerateTestimonialLinkModalProps {
    open: boolean;
    form: CreateTestimonialLinkRequest;
    onFormChange: (form: CreateTestimonialLinkRequest) => void;
    generating: boolean;
    generatedUrl: string | null;
    copied: boolean;
    onCopy: () => void;
    onGenerate: () => void;
    onClose: () => void;
}

const GenerateTestimonialLinkModal: React.FC<IGenerateTestimonialLinkModalProps> = ({
    open,
    form,
    onFormChange,
    generating,
    generatedUrl,
    copied,
    onCopy,
    onGenerate,
    onClose,
}) => {
    const colors = useColors();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="[&_.MuiDialog-paper]:rounded-2xl [&_.MuiDialog-paper]:p-6 [&_.MuiDialog-paper]:max-w-[440px] [&_.MuiDialog-paper]:w-full"
            maxWidth="sm"
            fullWidth
            sx={{ zIndex: 2000 }}
            slotProps={{ backdrop: { sx: { backdropFilter: "blur(20px)", backgroundColor: "rgba(15,23,42,0.6)" } } }}
        >
            <DialogTitle className="text-neutral-900 font-bold p-0 mb-5">
                {generatedUrl ? "Link Generated" : "Generate Testimonial Link"}
            </DialogTitle>

            {!generatedUrl ? (
                <>
                    <DialogContent className="p-0 flex flex-col gap-4">
                        <TextField
                            label="Recipient Name"
                            placeholder="e.g. Jane Smith"
                            value={form.requesterName ?? ""}
                            onChange={(e) => onFormChange({ ...form, requesterName: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Recipient Email"
                            type="email"
                            placeholder="e.g. jane@company.com"
                            value={form.requesterEmail ?? ""}
                            onChange={(e) => onFormChange({ ...form, requesterEmail: e.target.value })}
                            fullWidth
                        />
                        <Select
                            label="Link Expiry"
                            options={EXPIRY_OPTIONS}
                            value={form.expiryDays ?? 30}
                            onChange={(value) => onFormChange({ ...form, expiryDays: Number(value) })}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions className="p-0 mt-6 flex gap-3">
                        <Button
                            variant="secondaryText"
                            onClick={onClose}
                            className="w-[48%] border border-neutral-300 hover:bg-neutral-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primaryContained"
                            onClick={onGenerate}
                            isLoading={generating}
                            className="w-[48%]"
                        >
                            Generate
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <>
                    <DialogContent className="p-0">
                        <p className="text-sm mb-3" style={{ color: colors.neutral500 }}>
                            Share this link with your contact. It can be used once.
                        </p>
                        <div
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                            style={{ border: `1px solid ${colors.neutral300}`, background: colors.neutral50 }}
                        >
                            <span
                                className="flex-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                                style={{ color: colors.primary700, fontFamily: "monospace" }}
                            >
                                {generatedUrl}
                            </span>
                            <Button
                                variant={copied ? "secondaryContained" : "primaryContained"}
                                size="extraSmall"
                                onClick={onCopy}
                                startIcon={copied ? <FiCheck /> : <FiCopy />}
                            >
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    </DialogContent>
                    <DialogActions className="p-0 mt-6">
                        <Button variant="primaryContained" onClick={onClose} fullWidth>
                            Done
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default GenerateTestimonialLinkModal;
