import { ThumbsUpIcon, CheckIcon, TrashSimpleIcon, TrophyIcon } from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import type { DemoProduct } from "../../data/demoData";
import StarRating from "../ui/Stars";

type DemoProductCardProps = {
    product: DemoProduct;
    totalVotes: number;
    onVote: () => void;
    onDelete?: () => void;
    disabled?: boolean;
    isWinner?: boolean;
};

export default function DemoProductCard({ product, totalVotes, onVote, onDelete, disabled = false, isWinner = false }: DemoProductCardProps) {
    const handleVoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!product.hasVoted) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 100,
                spread: 90,
                startVelocity: 40,
                origin: { x, y },
                colors: ["#F25E0D", "#0096FF", "#737791"],
            });
        }
        onVote();
    };

    return (
        <div
            className="relative poll-card sm:max-w-200 backdrop-blur-[10px] rounded-[30px] p-4 sm:p-6
                       grid sm:flex shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)]
                       transition-all duration-250 ease-in-out gap-3
                       hover:-translate-y-1
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
            style={{ backgroundColor: 'var(--card-bg)' }}
        >
            <div
                className="w-full sm:w-50 sm:max-h-57.5 aspect-square rounded-3xl sm:rounded-xl overflow-hidden shrink-0
                           flex items-center justify-center text-6xl"
                style={{ backgroundColor: 'var(--toggle-inactive-bg)' }}
            >
                {product.emoji}
            </div>

            <div className="flex flex-col text-left flex-1" style={{ color: 'var(--text-primary)' }}>
                <div className="flex justify-between items-start gap-5">
                    <div className="flex text-sm gap-2.5 items-center">
                        <StarRating rating={product.rating} />
                        <strong>{product.rating}</strong>
                    </div>
                    <div className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                        ${product.price}
                    </div>
                </div>

                {isWinner && (
                    <div
                        className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full mb-1.5 text-[10px] font-bold tracking-[0.5px]"
                        style={{ backgroundColor: 'var(--winner-badge-bg)', color: 'var(--pill-text)' }}
                    >
                        <TrophyIcon size={12} weight="fill" />
                        WINNER
                    </div>
                )}
                <div className="font-semibold text-[0.9rem] leading-[1.4]">
                    {product.title}
                </div>

                <div className="flex justify-between items-end gap-5 py-2.5">
                    <div className="flex">
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                disabled={disabled}
                                className={`whitespace-nowrap bg-transparent text-[0.85rem]
                                           flex gap-1.5 justify-center items-center
                                           ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:text-[#F25E0D]"}`}
                            >
                                <TrashSimpleIcon size={17} strokeWidth={2} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1 justify-center">
                        <ThumbsUpIcon
                            size={17}
                            weight={product.hasVoted ? "fill" : "regular"}
                            strokeWidth={2}
                            style={{ color: product.hasVoted ? '#F25E0D' : undefined }}
                        />
                        <div style={{ color: product.hasVoted ? '#F25E0D' : undefined }}>{product.votes}</div>
                    </div>
                </div>

                <div className="w-full h-3 rounded-full overflow-hidden my-1.5 mb-2.5" style={{ backgroundColor: 'var(--progress-track)' }}>
                    <div
                        className={totalVotes === 0 ? "h-full" : "h-full transition-[width] duration-300"}
                        style={{
                            backgroundColor: totalVotes === 0 ? 'transparent' : 'var(--accent-orange-2)',
                            width: `${totalVotes === 0 ? 0 : (product.votes / totalVotes) * 100}%`,
                        }}
                    />
                </div>

                <button
                    onClick={handleVoteClick}
                    disabled={disabled}
                    style={{ backgroundColor: 'var(--progress-track-button)' }}
                    className={`group relative flex w-full rounded-full items-center justify-center
                        gap-2.5 py-4 transition-colors duration-200 text-white
                        ${disabled
                            ? "bg-[#B0B6CC] opacity-50 cursor-not-allowed"
                            : !product.hasVoted
                                ? "bg-linear-to-r from-[#ff6a00] to-[#ec4899] cursor-pointer hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)]"
                                : "bg-[#B0B6CC] cursor-pointer hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)]"
                        }`}
                >
                    {!product.hasVoted ? (
                        <ThumbsUpIcon size={26} strokeWidth={2} />
                    ) : (
                        <CheckIcon size={24} strokeWidth={2} />
                    )}
                </button>
            </div>
        </div>
    );
}
