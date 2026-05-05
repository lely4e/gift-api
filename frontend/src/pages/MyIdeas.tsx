import React, { useEffect, useState } from "react";
import type { MyIdeas } from "../utils/types";
import { authFetch } from "../utils/api/auth";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import CreateCard from "../components/ui/CreateCard";
import { deleteIdea } from "../utils/api/deleteIdea";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import { CheckIcon, CopyIcon, PencilSimpleLineIcon, TrashSimpleIcon, XIcon } from "@phosphor-icons/react";
import { Tooltip } from "../components/ui/Tooltip";
import { motion } from "framer-motion";
import { getCategoryColor } from "../utils/colorsCategory";
import { updateIdea } from "../utils/api/updateIdea";

const MyIdeasPage: React.FC = () => {
    const [ideas, setIdeas] = useState<MyIdeas[]>([]);
    const [search, setSearch] = useState<string>("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getIdeas = async () => {
            try {
                const params = new URLSearchParams();
                if (search) params.append("q", search);

                const response = await authFetch(`${API_URL}/ideas?${params.toString()}`);
                const data = await response.json().catch(() => null);
                if (!response.ok) {
                    toast.error(data?.detail || "Failed to fetch ideas");
                    return;
                }
                setIdeas(data);
                console.log("Ideas:", data);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
                console.error("Failed to fetch ideas:", error);
            }
        };
        getIdeas();
    }, [search]);

    const handleDeleteIdea = async (e: React.MouseEvent, ideaId: number) => {
        e.stopPropagation();
        try {
            await deleteIdea(ideaId);
            toast.success("Idea deleted successfully!", { duration: 2000 });
            setDeleteId(null);
            setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
            setTimeout(() => navigate("/my-ideas"), 2000);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to delete idea:", error);
        }
    };

    const handleApplyUpdate = async (e: React.MouseEvent, ideaId: number) => {
        e.stopPropagation();
        try {
            await updateIdea(ideaId, editedTitle);
            setIdeas((prev) =>
                prev.map((i) =>
                    i.id === ideaId ? { ...i, title: { ...i.title, name: editedTitle } } : i
                )
            );
            setEditingId(null);
            toast.success("Idea updated successfully!", { duration: 2000 });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to update idea:", error);
        }
    };

    const handleChooseCategory = (category: string) => {
        setSearch(category);
    };

    const handleCopyIdea = async (ideaId: number, name: string) => {
        try {
            await navigator.clipboard.writeText(name);
            setCopiedId(ideaId);
            setTimeout(() => setCopiedId(null), 2000);
            toast.success("Text copied to clipboard!", { duration: 2000 });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to copy:", error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mr-5 text-center">
                <motion.div
                    className="flex flex-col items-center mx-auto"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1
                        className="px-5 text-[1.5em] leading-[1.1] font-black mb-2 mt-16"
                        style={{ color: "var(--text-heading)" }}
                    >
                        Ideas
                    </h1>
                    <span
                        className="m-2 font-serif italic"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Manage your saved Ideas.
                    </span>


                    {search && (
                        <div>
                            <span
                                className="flex items-center text-[10px] font-medium cursor-pointer"
                                style={{ color: "var(--text-primary)" }}
                            >
                                <span
                                    key={search}
                                    className={`inline-flex px-2.5 py-1 tracking-[0.5px] rounded-full border mt-2 items-center
                                    ring-2 ring-orange-400 border-none 
                                    ${getCategoryColor(search).className}`}
                                >
                                    {search}
                                    <span className="flex ml-2">
                                        <XIcon size={14} onClick={() => setSearch("")} />
                                    </span>
                                </span>
                            </span>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                className="flex px-4 justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <div className="grid gap-6 w-full my-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">

                    {ideas.map((idea) => {
                        const isEditing = editingId === idea.id;

                        return (
                            <div
                                key={idea.id}
                                className="box-content poll-card backdrop-blur-md rounded-[30px] p-6
                                    flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full
                                    hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                                style={{ backgroundColor: "var(--card-bg)" }}
                            >
                                {/* Category tags */}
                                <div
                                    className={`pb-2.5 flex flex-wrap justify-start ${isEditing ? "opacity-40 pointer-events-none" : ""
                                        }`}
                                >
                                    <span
                                        className="flex flex-wrap text-[10px] font-medium cursor-pointer"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {idea.title.category.map((cat) => {

                                            const { className: colorClass } = getCategoryColor(cat);
                                            return (
                                                <span
                                                    key={cat}
                                                    className={`inline-flex px-2.5 py-1 tracking-[0.5px] rounded-full border mt-2 mr-1 ${colorClass}`}

                                                    onClick={() => handleChooseCategory(cat)}
                                                >
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                                                </span>
                                            );
                                        })}
                                    </span>
                                </div>

                                {/* Delete modal */}
                                <Modal isOpen={deleteId === idea.id} onClose={() => setDeleteId(null)}>
                                    <h3
                                        className="font-bold text-lg"
                                        style={{ color: "var(--text-heading)" }}
                                    >
                                        Are you sure you want to delete this idea?
                                    </h3>
                                    <div className="flex mt-10 flex-1 gap-2 justify-between">
                                        <button
                                            className="flex-1 border rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                            style={{
                                                borderColor: "var(--card-border)",
                                                color: "var(--text-primary)",
                                            }}
                                            onClick={() => setDeleteId(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="flex-1 bg-red-600 text-white rounded-full px-6 py-2 hover:bg-red-700 transition-colors"
                                            onClick={(e) => handleDeleteIdea(e, idea.id)}
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </Modal>

                                {/* Edit mode / title */}
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="flex text-left mt-2.5 text-xl font-serif italic border-b bg-transparent outline-none"
                                            style={{
                                                color: "var(--text-primary)",
                                                borderColor: "var(--text-primary)",
                                            }}
                                        />
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 flex-1 text-sm border hover:bg-[#B0B6CC] hover:border-[#B0B6CC] hover:text-white transition-colors rounded-full"
                                                style={{
                                                    borderColor: "var(--text-primary)",
                                                    color: "var(--text-primary)",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => handleApplyUpdate(e, idea.id)}
                                                className="px-4 py-2 flex-1 text-sm text-white bg-[#6366f1] hover:bg-[#4F46E5] transition-colors rounded-full"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    idea.title && (
                                        <p
                                            className="flex text-left mt-2.5 text-md font-bold"
                                            style={{ color: "var(--text-active)" }}
                                        >
                                            {idea.title.name}
                                        </p>
                                    )
                                )}

                                {/* Action icons */}
                                <div
                                    className="flex gap-4 pb-3 cursor-pointer mt-auto"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    <div className="group relative">
                                        <PencilSimpleLineIcon
                                            size={16}
                                            strokeWidth={1.5}
                                            className="hover:text-[#F25E0D]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingId(idea.id);
                                                setEditedTitle(idea.title.name);
                                            }}
                                        />
                                        <Tooltip text="Edit" />
                                    </div>

                                    {copiedId === idea.id ? (
                                        <CheckIcon size={16} strokeWidth={1.5} />
                                    ) : (
                                        <div className="group relative">
                                            <CopyIcon
                                                size={16}
                                                strokeWidth={1.5}
                                                className="hover:text-[#F25E0D]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopyIdea(idea.id, idea.title.name);
                                                }}
                                            />
                                            <Tooltip text="Copy Text" />
                                        </div>
                                    )}

                                    <div className="group relative">
                                        <TrashSimpleIcon
                                            size={16}
                                            strokeWidth={1.5}
                                            className="hover:text-[#F25E0D]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(idea.id);
                                            }}
                                        />
                                        <Tooltip text="Delete" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <CreateCard address={"/add-idea"} text={"Create Idea"} />
                </div>
            </motion.div>
        </>
    );
};

export default MyIdeasPage;