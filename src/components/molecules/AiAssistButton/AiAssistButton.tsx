import React, { useState } from "react";
import { FiZap } from "react-icons/fi";
import Modal from "../../atoms/Modal/Modal";
import Button from "../../atoms/Button/Button";
import TextField from "../../atoms/TextField/TextField";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import useAiContentService, { type ContentDraftType } from "../../../services/useAiContentService";

interface AiAssistButtonProps {
    contentType: ContentDraftType;
    /** Shown as placeholder guidance in the notes field, tailored to what this button is drafting. */
    promptPlaceholder: string;
    /** Called with the generated draft text when the user clicks Insert. The caller decides how
     * to apply it (e.g. formik.setFieldValue) -- this component never touches the target field
     * directly, so it works the same whether it's next to a RichTextEditor or a plain TextField. */
    onInsert: (draft: string) => void;
}

// A self-contained "AI Assist" trigger + popover, meant to sit next to any content field (About
// Me, a project/experience description) without that field's own component needing to know
// anything about AI drafting -- onInsert is the only integration point.
const AiAssistButton: React.FC<AiAssistButtonProps> = ({ contentType, promptPlaceholder, onInsert }) => {
    const colors = useColors();
    const { showSnackbar } = useSnackbar();
    const aiContentService = useAiContentService();

    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [draft, setDraft] = useState("");
    const [generating, setGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleClose = () => {
        setOpen(false);
        setNotes("");
        setDraft("");
        setErrorMessage(null);
    };

    const handleGenerate = async () => {
        if (!notes.trim() || generating) return;
        setGenerating(true);
        setErrorMessage(null);
        try {
            const res = await aiContentService.draftContent({ contentType, prompt: notes.trim() });
            if (res?.status === HTTP_STATUS.OK) {
                setDraft(res.data?.data?.draft ?? "");
            } else if (res?.data?.errorCode === "AI_SERVICE_NOT_CONFIGURED") {
                setErrorMessage("The AI writing assistant isn't set up yet. Ask your admin to add an Anthropic API key.");
            } else {
                setErrorMessage("Couldn't generate a draft. Please try again.");
            }
        } catch {
            setErrorMessage("Couldn't generate a draft. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleInsert = () => {
        onInsert(draft);
        showSnackbar("success", "Draft inserted — feel free to edit it further");
        handleClose();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: `${colors.primary500}15`, color: colors.primary600, border: `1px solid ${colors.primary200}`, cursor: "pointer" }}
            >
                <FiZap size={13} />
                AI Assist
            </button>

            <Modal
                open={open}
                onClose={handleClose}
                title="AI Writing Assistant"
                size="md"
                footer={
                    <>
                        <Button onClick={handleClose} label="Cancel" variant="tertiaryContained" />
                        {draft ? (
                            <>
                                <Button
                                    label={generating ? "Regenerating…" : "Regenerate"}
                                    variant="secondaryContained"
                                    disabled={generating || !notes.trim()}
                                    onClick={handleGenerate}
                                />
                                <Button label="Insert" variant="primaryContained" onClick={handleInsert} />
                            </>
                        ) : (
                            <Button
                                label={generating ? "Generating…" : "Generate"}
                                variant="primaryContained"
                                startIcon={<FiZap size={14} />}
                                disabled={generating || !notes.trim()}
                                onClick={handleGenerate}
                            />
                        )}
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <TextField
                        label="Your rough notes"
                        placeholder={promptPlaceholder}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        disabled={generating}
                    />
                    {errorMessage && (
                        <p className="text-xs" style={{ color: "#ef4444" }}>{errorMessage}</p>
                    )}
                    {draft && (
                        <div>
                            <p className="text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: colors.neutral600 }}>
                                Draft
                            </p>
                            <div
                                className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap"
                                style={{ background: colors.neutral50, border: `1.5px solid ${colors.neutral300}`, color: colors.neutral800 }}
                            >
                                {draft}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default AiAssistButton;
