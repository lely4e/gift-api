import { Link } from "react-router-dom";
import { SparkleIcon } from "@phosphor-icons/react";

export default function DemoBanner() {
    return (
        <div
            className="mt-5 rounded-full sticky top-0 z-40 w-full flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-[13px] font-medium text-center"
            style={{ backgroundColor: 'var(--demo-banner-bg)', color: 'var(--demo-banner-text)' }}
        >
            <span className="inline-flex items-center gap-1.5">
                <SparkleIcon size={14} weight="fill" />
                You're viewing a demo — nothing here is saved and also not all options available to try.
            </span>
            <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white font-semibold
                           bg-linear-to-r from-[#ff6a00] to-[#ec4899] hover:opacity-90 transition"
            >
                Sign up free
            </Link>
        </div>
    );
}
