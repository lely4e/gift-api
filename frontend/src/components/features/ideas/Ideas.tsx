import { useRef, useState, useEffect } from "react";
import { authFetch } from "../../../utils/api/auth";
import type { GiftIdea } from "../../../utils/types";
import type { IdeasProps } from "../../../utils/types";
import toast from "react-hot-toast";
import SearchIdea from "./SearchIdea";
import { API_URL } from "../../../config";
import { useParams } from "react-router-dom";
import { ArrowDownIcon, XIcon } from "@phosphor-icons/react";
import AgeSlider from "../../ui/AgeSlider";

export default function Ideas({ getProducts, title, budget }: IdeasProps) {
  const [recipientRelation, setRecipientRelation] = useState("");
  const [recipientAge, setRecipientAge] = useState<number>(25);
  const [recipientHobbies, setRecipientHobbies] = useState("");
  const [giftType, setGiftType] = useState("");
  const [ideas, setIdeas] = useState<GiftIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const GiftSuggest = useRef<HTMLHeadingElement | null>(null);
  const [openIdeas, setOpenIdeas] = useState(false);
  const { uuid } = useParams<{ uuid: string }>();

  const buttonsStyle =
    "w-full text-center px-3 py-2 text-sm rounded-3xl border border-[#737791] hover:bg-[#F25E0D] hover:text-white hover:border-0";
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await authFetch(
        `${API_URL}/polls/${uuid}/products/suggestion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: title,
            recipient_relation: recipientRelation,
            recipient_age: recipientAge,
            recipient_hobbies: recipientHobbies,
            gift_type: giftType,
            budget_range: budget,
          }),
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.detail || "Failed to get gift ideas");
        console.error("Failed to get gift ideas:", data);
        return;
      }
      setIdeas(data);
      console.log("Gift suggestions:", data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Failed to get gift ideas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ideas.length > 0) {
      setOpenIdeas(true);
    }
  }, [ideas]);

  useEffect(() => {
    if (openIdeas && GiftSuggest.current) {
      GiftSuggest.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [openIdeas]);

  return (
    <>
      {/* wrap-poll */}
      <div className="w-full">
        <div className="w-full">
          <section className="w-full">
            {/* add-poll-form */}
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="poll-card backdrop-blur-md rounded-[30px] p-4 sm:p-14 
            flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
            transition-all duration-250"
                style={{
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <p
                  className="text-xl sm:text-2xl text-center font-bold mb-6"
                  style={{ color: "var(--text-primary)" }}
                >
                  Find the perfect gifts for {title}
                </p>

                <p
                  className="text-[#737791] font-semibold text-center mt-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Who are they to you?
                </p>
                <div className="grid  grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                  {[
                    "Family",
                    "Friend",
                    "Partner",
                    "Colleague",
                    "Parent",
                    "Other",
                  ].map((relation) => (
                    <button
                      key={relation}
                      type="button"
                      onClick={() => setRecipientRelation(relation)}
                      className={`${buttonsStyle} ${recipientRelation === relation
                          ? "bg-[#F25E0D] text-white border-0"
                          : ""
                        }`}
                    >
                      {relation}
                    </button>
                  ))}
                </div>

                <AgeSlider value={recipientAge} onChange={setRecipientAge} />

                <p
                  className="text-[#737791] font-semibold text-center mt-8"
                  style={{ color: "var(--text-primary)" }}
                >
                  Select hobbies & interests
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                  {[
                    "Sports",
                    "Music",
                    "Gaming",
                    "Books",
                    "Travel",
                    "Fitness",
                    "Fashion",
                    "Photography",
                    "Movies",
                    "Home decor",
                    "Technology",
                    "Art",
                    "Cooking",
                  ].map((hobbies) => (
                    <button
                      key={hobbies}
                      type="button"
                      onClick={() => setRecipientHobbies(hobbies)}
                      className={`${buttonsStyle} ${recipientHobbies === hobbies
                          ? "bg-[#F25E0D] text-white border-0"
                          : ""
                        }`}
                    >
                      {hobbies}
                    </button>
                  ))}
                </div>

                <p
                  className="text-[#737791] font-semibold text-center mt-8"
                  style={{ color: "var(--text-primary)" }}
                >
                  Select gift type
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                  {[
                    "Unique",
                    "Practical",
                    "Fun",
                    "Luxury",
                    "Handmade",
                    "Personalized",
                    "Experience",
                  ].map((gift) => (
                    <button
                      key={gift}
                      type="button"
                      onClick={() => setGiftType(gift)}
                      className={`${buttonsStyle} ${giftType === gift
                          ? "bg-[#F25E0D] text-white border-0"
                          : ""
                        }`}
                    >
                      {gift}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-10 h-13.5 w-full bg-linear-to-r disabled:opacity-60 from-orange-500 to-pink-500 text-white font-medium py-2 rounded-full hover:opacity-90 transition hover:cursor-pointer"
                >
                  {loading ? "Loading..." : "Get Ideas"}
                </button>
              </form>
            </div>

            {ideas.length > 0 && openIdeas && (
              <h1
                ref={GiftSuggest}
                className="text-[1.5em] text-center mb-8 text-[#737791] font-black mt-8"
                style={{ color: "var(--text-primary)" }}
              >
                <div className="flex items-center justify-center gap-3">
                  Gift Ideas
                  <ArrowDownIcon
                    size={32}
                    weight="bold"
                    style={{ color: "var(--text-primary)" }}
                  />
                </div>
              </h1>
            )}

            {/* ideas-list */}
            {openIdeas && (
              <div
                className="w-full p-4 sm:p-6 poll-card rounded-[30px] overflow-hidden"
                style={{
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <div className="flex mr-6 pt-5 justify-end">
                  <XIcon
                    size={30}
                    strokeWidth={2}
                    weight="bold"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenIdeas(false);
                    }}
                    className="cursor-pointer"
                  />
                </div>
                {ideas.map((idea, index) => (
                  <div key={index}>
                    <div className="w-full block font-bold mb-4">
                      <SearchIdea
                        userSearch={idea.name}
                        getProducts={getProducts}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
