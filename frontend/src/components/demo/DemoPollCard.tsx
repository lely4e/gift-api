import { useNavigate } from "react-router-dom";
import {
    CalendarBlankIcon,
    CalendarCheckIcon,
    CalendarIcon,
    DotIcon,
    ShareFatIcon,
    ShoppingCartSimpleIcon,
} from "@phosphor-icons/react";
import type { DemoPoll } from "../../data/demoData";
import { daysLeft, getTimeLeftPercentage } from "../../utils/date";
import { getPollStatus } from "../../utils/pollStatus";
import { useDemo } from "../../context/DemoContext";

type DemoPollCardProps = {
    poll: DemoPoll;
    showCreator?: boolean;
};

export default function DemoPollCard({ poll, showCreator = false }: DemoPollCardProps) {
    const navigate = useNavigate();
    const { openSignupPrompt } = useDemo();

    return (
        <div
            key={poll.uuid}
            id={poll.uuid}
            className="box-content poll-card backdrop-blur-md rounded-[30px] p-6 cursor-pointer
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
            style={{ backgroundColor: 'var(--card-bg)' }}
            onClick={() => navigate(`/demo/polls/${poll.uuid}`)}
        >
            <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                <div className="flex items-center justify-between mr-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full -rotate-6"
                        style={{ backgroundColor: getPollStatus(poll) === "active" ? 'var(--pill-active-bg)' : 'var(--pill-inactive-bg)' }}
                    >
                        <div className="relative w-1.5 h-1.5">
                            {getPollStatus(poll) === "active" && (
                                <div className="absolute inset-0 rounded-full animate-ping"
                                    style={{ backgroundColor: '#4CAF50', opacity: 0.6 }} />
                            )}
                            <div className="relative w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: getPollStatus(poll) === "active" ? '#4CAF50' : '#F44336' }} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.5px]" style={{ color: 'var(--pill-text)' }}>
                            {getPollStatus(poll) === "active" ? "Active" : "Closed"}
                        </span>
                    </div>
                </div>

                <ShareFatIcon
                    size={18}
                    strokeWidth={1.5}
                    className="hover:text-[#F25E0D]"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openSignupPrompt();
                    }}
                />
            </div>

            <h3 className="text-left m-0 font-bold text-3xl"
                style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
            >
                {poll.title}
            </h3>

            <p className="flex justify-between items-start gap-5 mt-2.5 text-lg sm:text-xl font-bold"
                style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
            >
                Budget: ${poll.budget}
            </p>

            {poll.description && (
                <p className="flex text-left mt-2.5 text-sm font-serif italic"
                    style={{ color: poll.active ? 'var(--text-primary)' : 'var(--text-inactive)' }}
                >
                    {poll.description}
                </p>
            )}

            <div className="mt-auto w-full h-1 rounded-full overflow-hidden my-1.5 mb-1" style={{ backgroundColor: 'var(--progress-track)' }}>
                <div
                    className="h-full transition-[width] duration-300"
                    style={{
                        backgroundColor: poll.active ? 'var(--accent-orange-2)' : 'transparent',
                        width: `${getTimeLeftPercentage(poll)}%`,
                    }}
                />
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-1 mb-3 text-[12px]" style={{ color: poll.active ? 'var(--text-muted)' : 'var(--text-inactive)' }}>
                <ShoppingCartSimpleIcon size={14} strokeWidth={1.5} weight="fill" />
                <span>{poll.total_products} {poll.total_products === 1 ? "item" : "items"}</span>

                <DotIcon size={18} weight="bold" />

                {poll.deadline ? (
                    daysLeft(poll) > 0 ? (
                        <>
                            <CalendarIcon size={14} strokeWidth={1.5} weight="fill" />
                            <span>
                                {daysLeft(poll)} {daysLeft(poll) === 1 ? "day left" : "days left"}
                            </span>
                        </>
                    ) : (
                        <>
                            <CalendarCheckIcon size={14} strokeWidth={1.5} weight="fill" />
                            <span>Finished</span>
                        </>
                    )
                ) : (
                    <>
                        <CalendarBlankIcon size={14} strokeWidth={1.5} />
                        <span>No deadline</span>
                    </>
                )}
            </div>

            {showCreator && (
                <div
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:text-[12px] select-none"
                    style={{ borderColor: 'var(--chip-border-muted)', color: 'var(--text-muted)' }}
                >
                    <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${poll.user_id}`}
                        alt="avatar"
                        className="w-4 h-4 rounded-full shrink-0"
                    />
                    <span>created by {poll.created_by}</span>
                </div>
            )}
        </div>
    );
}
