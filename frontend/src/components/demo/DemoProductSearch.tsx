import { useState } from "react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CaretUpIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from "@phosphor-icons/react";
import { useCarousel } from "../../hooks/useCarousel";
import { DEMO_CATALOG, type DemoProduct } from "../../data/demoData";
import { useDemo } from "../../context/DemoContext";
import StarRating from "../ui/Stars";

type DemoProductSearchProps = {
    pollUuid: string;
    addedIds: number[];
};

const truncate = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

export default function DemoProductSearch({ pollUuid, addedIds }: DemoProductSearchProps) {
    const { addProduct } = useDemo();
    const [userInput, setUserInput] = useState("");
    const [searchResults, setSearchResults] = useState<Omit<DemoProduct, "votes" | "hasVoted">[]>([]);
    const [showProducts, setShowProducts] = useState(false);

    const {
        emblaApi,
        canScrollPrev,
        canScrollNext,
        emblaRef,
        slidesToShow,
    } = useCarousel({
        layout: "poll",
        showProducts,
        hasMore: false,
        loadingMore: false,
        loadMore: () => { },
        searchResults,
    });

    const handleSearch = () => {
        if (showProducts) {
            setShowProducts(false);
            return;
        }
        // Demo search always shows the full mock catalog, regardless of query —
        // there's no real backend to search against, and this guarantees results.
        setSearchResults(DEMO_CATALOG);
        setShowProducts(true);
    };

    return (
        <div className="w-full">
            <div className="grid place-items-center w-full mt-8">
                <div className="flex gap-2 w-full max-w-200 my-2">
                    <input
                        id="demo-search"
                        name="search"
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder={'Try "chocolate" or "headphones"…'}
                        className="flex-1 h-12 px-5 text-base font-serif italic
                                   border-0 border-b bg-transparent
                                   placeholder:text-[#737791] placeholder:italic
                                   focus:border-blue-500 focus:outline-none
                                   border-[#737791]"
                        style={{ color: 'var(--text-primary)' }}
                    />
                    <button
                        onClick={handleSearch}
                        className="flex items-center justify-center cursor-pointer
                                   w-12 h-12 rounded-full bg-[#6366f1] text-white
                                   transition hover:bg-[#4F46E5]"
                    >
                        {!showProducts ? (
                            <MagnifyingGlassIcon size={20} weight="bold" />
                        ) : (
                            <CaretUpIcon size={20} weight="bold" />
                        )}
                    </button>
                </div>
            </div>

            {showProducts && (
                <div className="w-full bg-[#0095FF33] rounded-[30px] p-10 relative mt-6">
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollPrev}
                        aria-label="Previous"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                                   flex items-center justify-center
                                   w-9 h-9 rounded-full bg-[#6366f1] text-white
                                   transition hover:bg-[#4F46E5]
                                   disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowLeftIcon size={20} weight="bold" />
                    </button>

                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollNext}
                        aria-label="Next"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                                   flex items-center justify-center
                                   w-9 h-9 rounded-full bg-[#6366f1] text-white
                                   transition hover:bg-[#4F46E5]
                                   disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowRightIcon size={20} weight="bold" />
                    </button>

                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {searchResults.map((product) => {
                                const added = addedIds.includes(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        className="flex-[0_0_calc(100%/var(--slides-to-show))] px-2"
                                        style={{ "--slides-to-show": slidesToShow } as React.CSSProperties}
                                    >
                                        <div
                                            className="flex flex-col gap-4 poll-card rounded-[30px] p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                                            style={{ backgroundColor: 'var(--card-bg)' }}
                                        >
                                            <div className="h-40 flex items-center justify-center pt-3 pb-3">
                                                <div className="w-full p-3 h-40 bg-white rounded-xl flex items-center justify-center overflow-hidden text-6xl">
                                                    {product.emoji}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <StarRating rating={product.rating} color="#F25E0D" />
                                                        <span className="text-sm ml-0 font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                            {product.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                                                        ${product.price}
                                                    </span>
                                                </div>

                                                <div
                                                    className="text-sm font-semibold leading-snug line-clamp-2 text-left"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    {truncate(product.title, 100)}
                                                </div>

                                                <div className="flex justify-between gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => addProduct(pollUuid, product.id)}
                                                        disabled={added}
                                                        className={`flex-3 h-10 rounded-full flex items-center justify-center text-white transition
                                                            ${added
                                                                ? "bg-[#B0B6CC] cursor-not-allowed"
                                                                : "bg-linear-to-br from-[#6366F1] to-[#A78BFA] hover:opacity-90 cursor-pointer"
                                                            }`}
                                                    >
                                                        {added ? <CheckIcon size={20} weight="bold" /> : <PlusIcon size={20} weight="bold" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
