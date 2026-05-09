import {
    type Poll,
    type History,
    type Activities,
    type User,
    type Product,
} from "../../../utils/types";
import {
    ArrowCounterClockwiseIcon,
    CalendarBlankIcon,
    CalendarCheckIcon,
    CalendarIcon,
    CaretUpIcon,
    CheckIcon,
    DotIcon,
    DotsThreeVerticalIcon,
    LinkIcon,
    MagicWandIcon,
    PencilSimpleLineIcon,
    PlusIcon,
    ShareFatIcon,
    ShoppingCartSimpleIcon,
    TrashSimpleIcon,
    XIcon,
} from "@phosphor-icons/react";
import { daysLeft } from "../../../utils/date";
import { motion } from "framer-motion";
import Modal from "../../ui/Modal";
import { Tooltip } from "../../ui/Tooltip";
import { useEffect, useRef, useState } from "react";

interface PollCardProps {
    poll: Poll;
    uuid: string;
    user: User | null;
    activities: Activities[];
    products: Product[];
    history: History[];
    isEditing: boolean;
    editedTitle: string;
    editedManuallyClosed: boolean;
    editedBudget: number;
    open: boolean;
    openPoll: boolean;
    share: boolean;
    copied: boolean;
    setOpen: (open: boolean) => void;
    setOpenPoll: (open: boolean) => void;
    setShare: (share: boolean) => void;
    setEditedTitle: (title: string) => void;
    setEditedManuallyClosed: (closed: boolean) => void;
    setEditedBudget: (budget: number) => void;
    startEditing: () => void;
    handleDeletePoll: (e: React.MouseEvent, uuid: string) => void;
    handleAddSharedPoll: (uuid: string) => void;
    handleDeleteSharedPoll: (uuid: string) => void;
    handleCopy: () => void;
    handleToggleHistory: () => void;
    handleShowIdeas: () => void;
    showGiftIdeas: boolean;
    handleShowEdit: () => void;
}

export default function PollCard({
    poll,
    uuid,
    user,
    activities,
    history,
    open,
    openPoll,
    share,
    copied,
    setOpen,
    setOpenPoll,
    setShare,
    startEditing,
    handleDeletePoll,
    handleAddSharedPoll,
    handleDeleteSharedPoll,
    handleCopy,
    handleToggleHistory,
    handleShowIdeas,
    showGiftIdeas,
    handleShowEdit,
}: PollCardProps) {
    const [kebabOpen, setKebabOpen] = useState(false);
    const kebabRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
                setKebabOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <motion.div
            key={poll.uuid}
            id={poll.uuid}
            className="poll-card backdrop-blur-md rounded-[30px] p-6
                       flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)]
                       transition-all duration-250"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.6 }}
            data-testid="poll-card"
            style={{ backgroundColor: 'var(--card-bg)' }}
        >
            {/* HEADER: title + status dot + icons */}
            <div className="flex justify-between items-center gap-3 mb-2">

                {/* Title + status dot */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <h3
                        className="text-left m-0 font-bold text-2xl sm:text-3xl wrap-break-word"
                        style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                    >
                        {poll.title}
                    </h3>
                    <div className="relative shrink-0 w-2 h-2">
                        {poll.active && (
                            <div
                                className="absolute inset-0 rounded-full animate-ping"
                                style={{ backgroundColor: "#4CAF50", opacity: 0.6 }}
                            />
                        )}
                        <div
                            className="relative w-2 h-2 rounded-full"
                            style={{ backgroundColor: poll.active ? "#4CAF50" : "#F44336" }}
                        />
                    </div>
                </div>

                {/* Desktop icons - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2 shrink-0" style={{ color: 'var(--text-primary)' }}>
                    {user && user.id !== poll.user_id && activities && (
                        <>
                            <div className="flex cursor-pointer hover:text-[#F25E0D]">
                                {!activities.some((a) => a.uuid === poll.uuid) ? (
                                    <PlusIcon size={16} data-testid="add-poll-icon" onClick={() => handleAddSharedPoll(poll.uuid)} />
                                ) : (
                                    <TrashSimpleIcon size={16} onClick={() => setOpenPoll(true)} />
                                )}
                            </div>
                            <div className="flex cursor-pointer hover:text-[#F25E0D]">
                                <ShareFatIcon size={16} onClick={() => setShare(true)} />
                            </div>
                        </>
                    )}
                    {user && user.id === poll.user_id && (
                        <>
                            <p
                                className="group relative flex items-center cursor-pointer hover:text-[#F25E0D]"
                                onClick={() => { startEditing(); handleShowEdit(); }}
                            >
                                <PencilSimpleLineIcon size={16} data-testid="edit-icon" />
                                <Tooltip text="Edit" />
                            </p>
                            <p className="group relative flex items-center cursor-pointer hover:text-[#F25E0D]">
                                <TrashSimpleIcon size={16} onClick={() => setOpen(true)} />
                                <Tooltip text="Delete" />
                            </p>
                            <p className="group relative flex items-center cursor-pointer hover:text-[#F25E0D]">
                                <ShareFatIcon size={17} onClick={() => setShare(true)} />
                                <Tooltip text="Share" />
                            </p>
                        </>
                    )}
                </div>

                {/* Mobile kebab - visible only on mobile */}
                <div className="relative flex sm:hidden shrink-0" ref={kebabRef}>
                    <button
                        onClick={() => setKebabOpen((v) => !v)}
                        className="p-1 rounded-full hover:bg-black/10 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <DotsThreeVerticalIcon size={20} weight="bold" />
                    </button>

                    {kebabOpen && (
                        <div
                            className="absolute right-0 top-8 z-50 min-w-37.5 rounded-2xl shadow-lg
                                       border overflow-hidden flex flex-col"
                            style={{ backgroundColor: 'var(--modal-card-bg)', borderColor: 'var(--border-color, #e5e7eb)' }}
                        >
                            {/* Other user's poll actions */}
                            {user && user.id !== poll.user_id && activities && (
                                <>
                                    {!activities.some((a) => a.uuid === poll.uuid) ? (
                                        <button
                                            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/5 text-left transition-colors"
                                            style={{ color: 'var(--text-primary)' }}
                                            onClick={() => { handleAddSharedPoll(poll.uuid); setKebabOpen(false); }}
                                        >
                                            <PlusIcon size={15} /> Add poll
                                        </button>
                                    ) : (
                                        <button
                                            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/5 text-left transition-colors text-red-500"
                                            onClick={() => { setOpenPoll(true); setKebabOpen(false); }}
                                        >
                                            <TrashSimpleIcon size={15} /> Remove
                                        </button>
                                    )}
                                    <button
                                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/5 text-left transition-colors"
                                        style={{ color: 'var(--text-primary)' }}
                                        onClick={() => { setShare(true); setKebabOpen(false); }}
                                    >
                                        <ShareFatIcon size={15} /> Share
                                    </button>
                                </>
                            )}

                            {/* Own poll actions */}
                            {user && user.id === poll.user_id && (
                                <>
                                    <button
                                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/5 text-left transition-colors"
                                        style={{ color: 'var(--text-primary)' }}
                                        onClick={() => { startEditing(); handleShowEdit(); setKebabOpen(false); }}
                                    >
                                        <PencilSimpleLineIcon size={15} /> Edit
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/5 text-left transition-colors text-red-500"
                                        onClick={() => { setOpen(true); setKebabOpen(false); }}
                                    >
                                        <TrashSimpleIcon size={15} /> Delete
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/5 text-left transition-colors"
                                        style={{ color: 'var(--text-primary)' }}
                                        onClick={() => { setShare(true); setKebabOpen(false); }}
                                    >
                                        <ShareFatIcon size={15} /> Share
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Budget */}
            <p
                className="text-sm mt-1 text-left"
                style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
            >
                Budget: ${poll.budget}
            </p>

            {/* Description */}
            {poll.description && (
                <p
                    className="text-left mt-3 mb-3 text-sm font-serif italic"
                    style={{ color: poll.active ? 'var(--text-primary)' : 'var(--text-inactive)' }}
                >
                    {poll.description}
                </p>
            )}

            {/* Meta row: items · deadline · creator */}
            <div
                className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-4 mb-4 text-[12px]"
                style={{ color: 'var(--accent-orange)' }}
            >
                <ShoppingCartSimpleIcon size={14} weight="fill" />
                <span>{poll.total_products} {poll.total_products === 1 ? "item" : "items"}</span>

                <DotIcon size={18} weight="bold" />

                {poll.deadline ? (
                    daysLeft(poll) > 0 ? (
                        <>
                            <CalendarIcon size={14} weight="fill" />
                            <span>{daysLeft(poll)} {daysLeft(poll) === 1 ? "day left" : "days left"}</span>
                        </>
                    ) : (
                        <>
                            <CalendarCheckIcon size={14} weight="fill" />
                            <span>Finished</span>
                        </>
                    )
                ) : (
                    <>
                        <CalendarBlankIcon size={14} />
                        <span>No deadline</span>
                    </>
                )}

                {user && poll.user_id !== user.id && (
                    <>
                        <DotIcon size={18} weight="bold" />
                        <img
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${poll.user_id}`}
                            alt="avatar"
                            className="w-4 h-4"
                        />
                        <span>created by {poll.created_by}</span>
                    </>
                )}
            </div>

            {/* Bottom action buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-auto">
                {history.length !== 0 && (
                    <button
                        className="flex items-center gap-2 font-medium text-[14px] text-[#cb7dff]
                                   border border-[#ba64f3] rounded-full px-4 py-3 cursor-pointer
                                   transition duration-300 hover:scale-105"
                        onClick={handleToggleHistory}
                    >
                        <ArrowCounterClockwiseIcon size={14} weight="bold" />
                        <span>History</span>
                    </button>
                )}
                <button
                    onClick={handleShowIdeas}
                    className="flex items-center gap-2 font-medium text-[14px] text-white
                               bg-linear-to-r from-[#9900ff] to-pink-500
                               rounded-full px-4 py-3 cursor-pointer
                               transition duration-300 hover:scale-105"
                >
                    {!showGiftIdeas
                        ? <><MagicWandIcon size={14} weight="fill" /><span>Get AI gift ideas</span></>
                        : <><CaretUpIcon size={14} weight="bold" /><span>Get AI gift ideas</span></>
                    }
                </button>
            </div>

            {/* Modals */}
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <h3 className="font-bold text-lg">Are you sure you want to delete this poll?</h3>
                <div className="flex mt-10 gap-2">
                    <button
                        className="flex-1 border rounded-full px-4 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 transition-colors"
                        onClick={(e) => handleDeletePoll(e, poll.uuid)}
                    >
                        Yes, Delete
                    </button>
                </div>
            </Modal>

            <Modal isOpen={openPoll} onClose={() => setOpenPoll(false)}>
                <h3 className="font-bold text-lg">Are you sure you want to delete this shared poll?</h3>
                <div className="flex mt-10 gap-2">
                    <button
                        className="flex-1 border rounded-full px-4 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                        onClick={() => setOpenPoll(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 transition-colors"
                        onClick={() => handleDeleteSharedPoll(poll.uuid)}
                    >
                        Yes, Delete
                    </button>
                </div>
            </Modal>

            <Modal isOpen={share} onClose={() => setShare(false)}>
                <div className="flex justify-between items-start gap-2 mb-4">
                    <h3 className="font-bold text-lg mb-4.5 text-center ">
                        Your link for <span className="text-[#F25E0D]">{poll.title}</span> is ready! 🎉
                    </h3>
                    <XIcon
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShare(false); }}
                        className="cursor-pointer shrink-0 mt-1"
                        size={20}
                        weight="bold"
                    />
                </div>
                <div className="flex w-full">
                    <input
                        className="border-0 border-b border-[#F25E0D] bg-transparent text-[#737791]
                                   pl-2 text-sm flex-1 min-w-0 h-12 focus:outline-none"
                        id={uuid}
                        value={`${window.location.origin}/polls/${uuid}`}
                        readOnly
                    />
                    <button
                        onClick={handleCopy}
                        className={`shrink-0 px-4 h-12 transition-colors rounded-full
                                    ${!copied ? "bg-[#F25E0D] text-white cursor-pointer hover:bg-black" : "bg-[#B0B6CC]"}`}
                    >
                        {!copied
                            ? <LinkIcon size={16} weight="bold" />
                            : <CheckIcon size={16} weight="bold" style={{ color: "white" }} />
                        }
                    </button>
                </div>
            </Modal>
        </motion.div>
    );
}