type DemoCreateCardProps = {
    text: string;
    onClick: () => void;
};

export default function DemoCreateCard({ text, onClick }: DemoCreateCardProps) {
    return (
        <div
            className="h-full box-content poll-card backdrop-blur-[10px] border-2 border-dashed
            rounded-[30px] p-6 flex flex-col items-center justify-center cursor-pointer
            transition-all duration-250 hover:border-[#F25E0D] hover:bg-[rgba(246,143,92,0.05)]"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            onClick={onClick}
        >
            <div className="w-14 h-14 flex items-center justify-center mb-4">
                <svg
                    className="w-7 h-7"
                    style={{ color: 'var(--text-primary)' }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </div>
            <p className="mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>{text}</p>
        </div>
    );
}
