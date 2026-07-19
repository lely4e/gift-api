import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClockIcon, XIcon } from "@phosphor-icons/react";
import Modal from "../ui/Modal";
import { pollSchema, type PollFormErrors } from "../../schemas/pollSchema";
import { useDemo } from "../../context/DemoContext";

type CreatePollModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CreatePollModal({ isOpen, onClose }: CreatePollModalProps) {
    const { addPoll } = useDemo();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [errors, setErrors] = useState<PollFormErrors>({});

    const reset = () => {
        setTitle("");
        setBudget("");
        setDescription("");
        setDeadline("");
        setErrors({});
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const result = pollSchema.safeParse({
            title,
            budget: Number(budget),
            description: description || undefined,
            deadline: deadline || undefined,
        });

        if (!result.success) {
            const fieldErrors: PollFormErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof PollFormErrors;
                if (!fieldErrors[field]) fieldErrors[field] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        const newPoll = addPoll(result.data);
        reset();
        onClose();
        navigate(`/demo/polls/${newPoll.uuid}`);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="w-full max-w-md">
                <div className="flex justify-end -mt-2 -mr-2 mb-1">
                    <XIcon
                        onClick={handleClose}
                        className="cursor-pointer"
                        size={18}
                        weight="bold"
                        style={{ color: 'var(--text-muted)' }}
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-1">
                        <input
                            type="text"
                            placeholder="Mike's Birthday"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ color: 'var(--text-primary)' }}
                            className={`w-full text-left m-0 font-bold text-2xl sm:text-3xl
                                        ${errors.title ? "border-b border-red-400" : "border-[#737791]"}`}
                        />
                        {errors.title && (
                            <span className="text-red-500 text-xs mt-1">{errors.title}</span>
                        )}
                    </div>
                    <div className="flex justify-between items-start gap-5 mt-2.5 text-sm">
                        <label htmlFor="demo-budget" className="text-sm shrink-0" style={{ color: 'var(--text-primary)' }}>
                            Budget $
                        </label>
                        <input
                            id="demo-budget"
                            type="number"
                            placeholder="300"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            required
                            style={{ color: 'var(--text-primary)' }}
                            className={`flex-1 text-sm
                                        ${errors.budget ? "border-b border-red-400" : "border-[#737791]"}`}
                        />
                    </div>
                    {errors.budget && (
                        <span className="text-red-500 text-xs mt-1">{errors.budget}</span>
                    )}

                    <div className="flex w-full">
                        <input
                            type="text"
                            placeholder="Here is a short description you could add to your poll"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ color: 'var(--text-primary)' }}
                            className={`flex w-full text-left mt-2.5 text-sm font-serif italic pt-1 pb-1
                                        ${errors.description ? "border-b border-red-400" : "border-[#737791]"}`}
                        />
                    </div>
                    {errors.description && (
                        <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                    )}

                    <div className="flex items-center mt-8 mb-5 gap-2 ml-0 text-[12px]" style={{ color: 'var(--accent-orange)' }}>
                        <ClockIcon size={14} strokeWidth={1.5} />
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            style={{ color: 'var(--text-primary)' }}
                            className={`date-icon flex-1 text-left text-sm font-serif italic pt-1 pb-1
                                        ${errors.deadline ? "border-red-400" : "border-[#737791]"}`}
                        />
                        {errors.deadline && (
                            <span className="text-red-500 text-xs mt-1">{errors.deadline}</span>
                        )}
                    </div>

                    <div className="flex pt-3">
                        <button
                            type="submit"
                            className="justify-center items-center mx-auto w-full h-12 bg-linear-to-r from-[#ff6a00] to-[#ec4899]
                                       hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)] duration-200 rounded-3xl text-white cursor-pointer"
                        >
                            Create Poll
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
