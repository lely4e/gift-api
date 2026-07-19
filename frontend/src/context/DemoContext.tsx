import { createContext, useContext, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import {
    seedMyPolls,
    seedSharedPolls,
    DEMO_CATALOG,
    DEMO_ME_USER_ID,
    type DemoPoll,
} from "../data/demoData";

type NewPollInput = {
    title: string;
    budget: number;
    description?: string;
    deadline?: string;
};

type DemoContextValue = {
    myPolls: DemoPoll[];
    sharedPolls: DemoPoll[];
    getPoll: (uuid: string) => DemoPoll | undefined;
    addPoll: (input: NewPollInput) => DemoPoll;
    deletePoll: (uuid: string) => void;
    addProduct: (pollUuid: string, catalogId: number) => void;
    deleteProduct: (pollUuid: string, productId: number) => void;
    voteProduct: (pollUuid: string, productId: number) => void;
    signupPromptOpen: boolean;
    openSignupPrompt: () => void;
    closeSignupPrompt: () => void;
};

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

let nextDemoId = 9100;

export function DemoProvider({ children }: { children: ReactNode }) {
    const [myPolls, setMyPolls] = useState<DemoPoll[]>(() => seedMyPolls());
    const [sharedPolls, setSharedPolls] = useState<DemoPoll[]>(() => seedSharedPolls());
    const [signupPromptOpen, setSignupPromptOpen] = useState(false);

    const getPoll = (uuid: string) =>
        myPolls.find((poll) => poll.uuid === uuid) ??
        sharedPolls.find((poll) => poll.uuid === uuid);

    const addPoll = (input: NewPollInput): DemoPoll => {
        const id = nextDemoId++;
        const newPoll: DemoPoll = {
            id,
            uuid: `demo-my-${id}`,
            title: input.title,
            budget: input.budget,
            description: input.description,
            deadline: input.deadline,
            created_at: new Date().toISOString(),
            user_id: DEMO_ME_USER_ID,
            created_by: "you",
            total_products: 0,
            active: true,
            manually_closed: false,
            products: [],
        };
        setMyPolls((prev) => [newPoll, ...prev]);
        toast.success("Poll created!", { duration: 2000 });
        return newPoll;
    };

    const deletePoll = (uuid: string) => {
        setMyPolls((prev) => prev.filter((poll) => poll.uuid !== uuid));
        toast.success("Poll deleted", { duration: 2000 });
    };

    const updatePollProducts = (
        pollUuid: string,
        updater: (products: DemoPoll["products"]) => DemoPoll["products"],
    ) => {
        const apply = (polls: DemoPoll[]) =>
            polls.map((poll) => {
                if (poll.uuid !== pollUuid) return poll;
                const products = updater(poll.products);
                return { ...poll, products, total_products: products.length };
            });
        setMyPolls(apply);
        setSharedPolls(apply);
    };

    const addProduct = (pollUuid: string, catalogId: number) => {
        const poll = getPoll(pollUuid);
        if (poll?.products.some((product) => product.id === catalogId)) {
            toast("Already added to this poll", { icon: "ℹ️" });
            return;
        }
        const item = DEMO_CATALOG.find((entry) => entry.id === catalogId);
        if (!item) return;
        updatePollProducts(pollUuid, (products) => [{ ...item, votes: 0, hasVoted: false }, ...products]);
        toast.success("Product added!", { duration: 2000 });
    };

    const deleteProduct = (pollUuid: string, productId: number) => {
        updatePollProducts(pollUuid, (products) => products.filter((product) => product.id !== productId));
        toast.success("Product removed", { duration: 2000 });
    };

    const voteProduct = (pollUuid: string, productId: number) => {
        updatePollProducts(pollUuid, (products) =>
            products.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        hasVoted: !product.hasVoted,
                        votes: product.hasVoted ? product.votes - 1 : product.votes + 1,
                    }
                    : product,
            ),
        );
    };

    const openSignupPrompt = () => setSignupPromptOpen(true);
    const closeSignupPrompt = () => setSignupPromptOpen(false);

    return (
        <DemoContext.Provider
            value={{
                myPolls,
                sharedPolls,
                getPoll,
                addPoll,
                deletePoll,
                addProduct,
                deleteProduct,
                voteProduct,
                signupPromptOpen,
                openSignupPrompt,
                closeSignupPrompt,
            }}
        >
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (!context) throw new Error("useDemo must be used within DemoProvider");
    return context;
}
