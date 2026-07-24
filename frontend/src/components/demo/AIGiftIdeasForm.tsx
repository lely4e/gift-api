import { useState } from "react";
import AgeSlider from "../ui/AgeSlider";
import { useDemo } from "../../context/DemoContext";

type AIGiftIdeasFormProps = {
    title: string;
};

const buttonsStyle =
    "w-full text-center px-3 py-2 text-sm rounded-3xl border border-[#737791] hover:bg-[#F25E0D] hover:text-white hover:border-0";

export default function AIGiftIdeasForm({ title }: AIGiftIdeasFormProps) {
    const { openSignupPrompt } = useDemo();

    const [recipientRelation, setRecipientRelation] = useState("");
    const [recipientAge, setRecipientAge] = useState<number>(25);
    const [recipientHobbies, setRecipientHobbies] = useState("");
    const [giftType, setGiftType] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        openSignupPrompt();
    };

    return (
        <div className="w-full max-w-200 mx-auto">
            <form
                onSubmit={handleSubmit}
                className="poll-card backdrop-blur-md rounded-[30px] p-4 sm:p-14
                           flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)]
                           transition-all duration-250"
                style={{ backgroundColor: "var(--card-bg)" }}
            >
                <p
                    className="text-xl sm:text-2xl text-center font-bold mb-6"
                    style={{ color: "var(--text-primary)" }}
                >
                    Find the perfect gifts for {title}
                </p>

                <p className="font-semibold text-center mt-4" style={{ color: "var(--text-primary)" }}>
                    Who are they to you?
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                    {["Family", "Friend", "Partner", "Colleague", "Parent", "Other"].map((relation) => (
                        <button
                            key={relation}
                            type="button"
                            onClick={() => setRecipientRelation(relation)}
                            className={`${buttonsStyle} ${recipientRelation === relation ? "bg-[#F25E0D] text-white border-0" : ""}`}
                        >
                            {relation}
                        </button>
                    ))}
                </div>

                <AgeSlider value={recipientAge} onChange={setRecipientAge} />

                <p className="font-semibold text-center mt-8" style={{ color: "var(--text-primary)" }}>
                    Select hobbies & interests
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                    {[
                        "Sports", "Music", "Gaming", "Books", "Travel", "Fitness",
                        "Fashion", "Photography", "Movies", "Home decor", "Technology", "Art", "Cooking",
                    ].map((hobbies) => (
                        <button
                            key={hobbies}
                            type="button"
                            onClick={() => setRecipientHobbies(hobbies)}
                            className={`${buttonsStyle} ${recipientHobbies === hobbies ? "bg-[#F25E0D] text-white border-0" : ""}`}
                        >
                            {hobbies}
                        </button>
                    ))}
                </div>

                <p className="font-semibold text-center mt-8" style={{ color: "var(--text-primary)" }}>
                    Select gift type
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                    {["Unique", "Practical", "Fun", "Luxury", "Handmade", "Personalized", "Experience"].map((gift) => (
                        <button
                            key={gift}
                            type="button"
                            onClick={() => setGiftType(gift)}
                            className={`${buttonsStyle} ${giftType === gift ? "bg-[#F25E0D] text-white border-0" : ""}`}
                        >
                            {gift}
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    className="mt-10 h-13.5 w-full bg-linear-to-r from-orange-500 to-pink-500 text-white font-medium py-2 rounded-full hover:opacity-90 transition hover:cursor-pointer"
                >
                    Get Ideas
                </button>
            </form>
        </div>
    );
}
