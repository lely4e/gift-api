import { Link } from "react-router-dom";
import { LockKeyIcon } from "@phosphor-icons/react";
import Modal from "../ui/Modal";
import { useDemo } from "../../context/DemoContext";

export default function SignupPromptModal() {
    const { signupPromptOpen, closeSignupPrompt } = useDemo();

    return (
        <Modal isOpen={signupPromptOpen} onClose={closeSignupPrompt}>
            <div className="flex flex-col items-center text-center max-w-70">
                <div
                    className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{ backgroundColor: 'var(--accent-purple-bg)', color: 'var(--accent-purple)' }}
                >
                    <LockKeyIcon size={22} weight="fill" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-heading)' }}>
                    That's a real-account feature
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-primary)' }}>
                    Sharing, comments, and AI gift ideas are available once you create a free account —
                    everything else here you can keep exploring.
                </p>
                <div className="flex w-full gap-2 justify-center items-center">
                    <button
                        className="flex border rounded-full px-4 py-2 transition-colors"
                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                        onClick={closeSignupPrompt}
                    >
                        Keep exploring
                    </button>
                    <Link
                        to="/signup"
                        className="flex-1 rounded-full px-4 py-2 text-white text-center font-semibold
                                   bg-linear-to-r from-[#ff6a00] to-[#ec4899] hover:opacity-90 transition"
                    >
                        Sign up free
                    </Link>
                </div>
            </div>
        </Modal>
    );
}
