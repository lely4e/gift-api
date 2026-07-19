import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    CalendarBlankIcon,
    CalendarCheckIcon,
    CalendarIcon,
    DotIcon,
    MagicWandIcon,
    ShareFatIcon,
    ShoppingCartSimpleIcon,
} from "@phosphor-icons/react";
import DemoLayout from "../components/demo/DemoLayout";
import DemoProductCard from "../components/demo/DemoProductCard";
import DemoProductSearch from "../components/demo/DemoProductSearch";
import { useDemo } from "../context/DemoContext";
import { daysLeft } from "../utils/date";
import { getPollStatus } from "../utils/pollStatus";

export default function DemoPoll() {
    const { uuid } = useParams<{ uuid: string }>();
    const { getPoll, voteProduct, deleteProduct, openSignupPrompt } = useDemo();

    const poll = uuid ? getPoll(uuid) : undefined;

    if (!poll) {
        return (
            <DemoLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                    <p style={{ color: 'var(--text-primary)' }}>That demo poll doesn't exist.</p>
                    <Link to="/demo" className="text-[14px]" style={{ color: 'var(--accent-orange)' }}>
                        Back to demo dashboard
                    </Link>
                </div>
            </DemoLayout>
        );
    }

    const totalVotes = poll.products.reduce((sum, product) => sum + product.votes, 0);
    const maxVotes = poll.products.reduce((max, product) => Math.max(max, product.votes), 0);

    return (
        <DemoLayout>
            <div className="mx-auto flex justify-center px-4">
                <motion.div className="grid gap-6 w-full max-w-200 mt-10"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0, duration: 0.6 }}>
                    <Link
                        to="/demo"
                        className="flex items-center gap-3 text-[#8f91fc] hover:text-[#6b63ff] text-left text-[14px]"
                    >
                        <ArrowLeftIcon size={16} weight="bold" /> Back to polls
                    </Link>

                    <div
                        className="poll-card backdrop-blur-md rounded-[30px] p-6
                                   flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)]
                                   transition-all duration-250"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <div className="flex justify-between items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <h3 className="text-left m-0 font-bold text-2xl sm:text-3xl wrap-break-word"
                                    style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                                >
                                    {poll.title}
                                </h3>
                                <div className="relative shrink-0 w-2 h-2">
                                    {getPollStatus(poll) === "active" && (
                                        <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "#4CAF50", opacity: 0.6 }} />
                                    )}
                                    <div className="relative w-2 h-2 rounded-full"
                                        style={{ backgroundColor: getPollStatus(poll) === "active" ? "#4CAF50" : "#F44336" }} />
                                </div>
                            </div>
                            <ShareFatIcon
                                size={18}
                                strokeWidth={1.5}
                                className="hover:text-[#F25E0D] cursor-pointer shrink-0"
                                style={{ color: 'var(--text-primary)' }}
                                onClick={openSignupPrompt}
                            />
                        </div>

                        <p className="text-lg sm:text-xl font-bold mt-1 text-left"
                            style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                        >
                            Budget: ${poll.budget}
                        </p>

                        {poll.description && (
                            <p className="text-left mt-3 mb-3 text-sm font-serif italic"
                                style={{ color: poll.active ? 'var(--text-primary)' : 'var(--text-inactive)' }}
                            >
                                {poll.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-4 mb-4 text-[12px]"
                            style={{ color: 'var(--text-muted)' }}
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

                            {poll.created_by !== "you" && (
                                <>
                                    <DotIcon size={18} weight="bold" />
                                    <span>created by {poll.created_by}</span>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            <button
                                onClick={openSignupPrompt}
                                className="flex items-center gap-2 font-medium text-[14px] text-white
                                           bg-linear-to-r from-[#9900ff] to-pink-500
                                           rounded-full px-4 py-3 cursor-pointer
                                           transition duration-300 hover:scale-105"
                            >
                                <MagicWandIcon size={14} weight="fill" />
                                <span>Get AI gift ideas</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div className="flex flex-col items-center mt-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
                <h1 className="text-[1.5em] leading-tight pt-10 font-black" style={{ color: 'var(--text-heading)' }}>
                    Products
                </h1>
                {poll.active ? (
                    <DemoProductSearch
                        pollUuid={poll.uuid}
                        addedIds={poll.products.map((product) => product.id)}
                    />
                ) : (
                    <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
                        This poll is closed — voting and new products are disabled.
                    </p>
                )}
            </motion.div>

            <div className="mx-auto flex justify-center">
                <div className="grid gap-6 w-full max-w-200 my-10 mx-auto grid-cols-1">
                    {poll.products.length === 0 && (
                        <p className="text-center text-sm py-6" style={{ color: 'var(--text-muted)' }}>
                            No products yet — search above to get voting started.
                        </p>
                    )}
                    {poll.products.map((product) => (
                        <DemoProductCard
                            key={product.id}
                            product={product}
                            totalVotes={totalVotes}
                            onVote={() => voteProduct(poll.uuid, product.id)}
                            onDelete={poll.created_by === "you" ? () => deleteProduct(poll.uuid, product.id) : undefined}
                            disabled={!poll.active}
                            isWinner={!poll.active && maxVotes > 0 && product.votes === maxVotes}
                        />
                    ))}
                </div>
            </div>
        </DemoLayout>
    );
}
