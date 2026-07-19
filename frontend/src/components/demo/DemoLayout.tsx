import type { ReactNode } from "react";
import DemoBanner from "./DemoBanner";
import SignupPromptModal from "./SignupPromptModal";

export default function DemoLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <DemoBanner />
            {children}
            <SignupPromptModal />
        </>
    );
}
