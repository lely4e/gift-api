import Toggle from "../../ui/Toggle";
import toast from "react-hot-toast";
import type { PollFormErrors } from "../../../schemas/pollSchema";
import { ClockIcon } from "@phosphor-icons/react";

interface PollEditFormProps {
    editedTitle: string;
    setEditedTitle: (title: string) => void;
    editedBudget: number;
    setEditedBudget: (bud: number) => void;
    editedDescription: string;
    editedDeadline: string;
    editedManuallyClosed: boolean;
    setEditedManuallyClosed: (clos: boolean) => void;
    setEditedDescription: (desc: string) => void;
    setEditedDeadline: (deadline: string) => void;
    cancelEditing: () => void;
    handleApply: () => Promise<void>;
    errors?: PollFormErrors;
}

export default function PollEditForm({
    editedTitle,
    setEditedTitle,
    editedBudget,
    setEditedBudget,
    editedManuallyClosed,
    setEditedManuallyClosed,
    editedDescription,
    editedDeadline,
    setEditedDescription,
    setEditedDeadline,
    cancelEditing,
    handleApply,
    errors = {},
}: PollEditFormProps) {
    return (
        <div
            className="poll-card backdrop-blur-md rounded-[30px] p-6
                       flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)]
                       transition-all duration-250"
            style={{ backgroundColor: 'var(--card-bg)' }}
        >
            {/* Title + toggle */}
            <div className="flex justify-between items-center gap-3 mb-2">
                <div className="flex flex-col min-w-0 flex-1">
                    <input
                        type="text"
                        name="title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        required
                        style={{ color: 'var(--text-primary)' }}
                        className={`w-full text-left font-bold text-2xl sm:text-3xl wrap-break-word
                                    bg-transparent border-b focus:outline-none pb-1
                                    ${errors.title ? "border-red-400" : "border-[#737791]"}`}
                    />
                    {errors.title && (
                        <span className="text-red-500 text-xs mt-1">{errors.title}</span>
                    )}
                </div>
                <div className="shrink-0">
                    <Toggle
                        initial={!editedManuallyClosed}
                        onChange={(checked) => {
                            setEditedManuallyClosed(!checked);
                            !editedManuallyClosed
                                ? toast.success("Poll closed")
                                : toast.success("Poll opened");
                        }}
                    />
                </div>
            </div>

            {/* Budget */}
            <div className="mt-4">
                <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="text-sm">Budget: $</span>
                    <input
                        type="number"
                        name="budget"
                        value={editedBudget}
                        onChange={(e) => setEditedBudget(Number(e.target.value))}
                        style={{ color: 'var(--text-primary)' }}
                        className={`flex-1 text-sm bg-transparent border-b focus:outline-none pb-1
                                    ${errors.budget ? "border-red-400" : "border-[#737791]"}`}
                    />
                </div>
                {errors.budget && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.budget}</span>
                )}
            </div>

            {/* Description */}
            <div className="mt-4">
                <input
                    type="text"
                    name="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    style={{ color: 'var(--text-heading)' }}
                    className={`w-full text-sm font-serif italic bg-transparent border-b focus:outline-none pb-1
                                ${errors.description ? "border-red-400" : "border-[#737791]"}`}
                />
                {errors.description && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>
                )}
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 mt-8 text-[12px] text-[#EA7317]">
                <ClockIcon size={14} strokeWidth={2} className="shrink-0" />
                <input
                    type="date"
                    value={editedDeadline || ""}
                    onChange={(e) => setEditedDeadline(e.target.value)}
                    className="bg-[#F25E0D] text-white px-4 py-1.5 rounded-full text-sm"
                />
            </div>

            {/* Cancel + Apply */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={cancelEditing}
                    className="flex-1 px-4 py-2 text-sm border border-[#737791] rounded-full
                               hover:bg-[#B0B6CC] hover:border-[#B0B6CC] hover:text-white
                               transition-colors cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 text-sm text-white bg-[#6366f1]
                               hover:bg-[#4F46E5] transition-colors rounded-full cursor-pointer"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
