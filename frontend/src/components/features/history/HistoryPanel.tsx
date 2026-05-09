import { motion } from "framer-motion";
import type { History } from "../../../utils/types";
import {
    BookmarksIcon,
    CheckIcon,
    CopyIcon,
    TrashSimpleIcon,
} from "@phosphor-icons/react";
import { getCategoryColor } from "../../../utils/colorsCategory";
import Modal from "../../ui/Modal";


interface HistoryPanelProps {
    history: History[];
    uuid: string;
    openHistoryDelete: number | null;
    setOpenHistoryDelete: (id: number | null) => void;
    onDelete: (e: React.MouseEvent, historyId: number) => void;
    onAddToIdeas: (historyId: number) => void;
    onCopy: (id: number, name: string) => void;
    copiedId: number | null;
}

export default function HistoryPanel({
    history,
    openHistoryDelete,
    setOpenHistoryDelete,
    onDelete,
    onAddToIdeas,
    onCopy,
    copiedId,
}: HistoryPanelProps) {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="relative  poll-card backdrop-blur-md rounded-[30px] p-4 sm:p-6 shadow-md space-y-2 mt-6"
                style={{
                    backgroundColor: 'var(--card-bg)',
                }}>
                {/* AI badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: -8 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute -top-4 -right-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#e4c3f9] rounded-full shadow-lg"

                >
                    <motion.div
                        animate={{ scale: [0.7, 1.2, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2.5 h-2.5 rounded-full bg-[#ba4cea]"
                    />
                    <span className="text-[0.5rem] sm:text-sm font-bold text-[#ba4cea]">AI GENERATED</span>
                </motion.div>

                <h2 className="text-center text-xl font-black mb-6">
                    Your AI Idea History
                </h2>

                <div className="grid justify-center items-center text-center text-sm font-serif italic mb-6"
                    style={{ color: 'var(--text-primary)' }}>
                    <p>AI-generated suggestions, saved over time</p>
                </div>

                {history.map((idea) => (
                    <div
                        key={idea.id}
                        className="flex justify-between items-center text-left text-[12px] sm:text-[14px]  py-2 px-4 rounded-xl poll-card hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            backgroundColor: 'var(--card-bg)',
                        }}
                    >
                        <div>
                            <div className="flex gap-2 mb-2 text-[10px] text-gray-700 tracking-widest" style={{ color: "var(--text-primary)" }}>
                                {idea.titles.category.map((cat) => {
                                    const { className: colorClass } = getCategoryColor(cat);
                                    return (
                                        <span
                                            key={cat}
                                            className={`inline-flex items-center tracking-[0.5px] gap-1.5 px-2.5 py-1 rounded-full border ${colorClass}`}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                                        </span>
                                    );
                                })}
                            </div>
                            <span className="flex text-left">{idea.titles.name}</span>
                        </div>

                        <div className="flex gap-1">
                            {/* Delete */}
                            <div
                                className="py-2 px-2 rounded-full hover:text-[#f20d0d] hover:bg-white cursor-pointer"
                                onClick={() => setOpenHistoryDelete(idea.id)}
                            >
                                <TrashSimpleIcon size={16} strokeWidth={1.5} />
                            </div>

                            <Modal
                                isOpen={openHistoryDelete === idea.id}
                                onClose={() => setOpenHistoryDelete(null)}
                            >
                                <h3 className="font-bold text-lg">
                                    Are you sure you want to delete "{idea.titles.name}"?
                                </h3>
                                <div className="flex mt-10 flex-1 gap-2 justify-between">
                                    <button
                                        className="flex-1 border rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                        onClick={() => setOpenHistoryDelete(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 bg-red-600 text-white rounded-full px-6 py-2 hover:bg-red-700 transition-colors"
                                        onClick={(e) => onDelete(e, idea.id)}
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </Modal>

                            {/* Copy */}
                            <div
                                onClick={() => onCopy(idea.id, idea.titles.name)}
                                className="group py-2 px-2 rounded-full hover:text-[#08b9ff] hover:bg-white cursor-pointer"
                            >
                                {copiedId === idea.id ? (
                                    <CheckIcon size={16} strokeWidth={2} weight="bold" />
                                ) : (
                                    <CopyIcon size={16} strokeWidth={2} />
                                )}
                            </div>

                            {/* Save to ideas */}
                            <div
                                className="py-2 px-2 rounded-full hover:text-[#a900dc] hover:bg-white cursor-pointer"
                                onClick={() => onAddToIdeas(idea.id)}
                            >
                                <BookmarksIcon size={16} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
