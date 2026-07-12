import type { PollStatusFilter } from "../../utils/pollStatus";

type StatusSegmentedControlProps = {
    value: PollStatusFilter;
    onChange: (value: PollStatusFilter) => void;
    counts: Record<PollStatusFilter, number>;
    label: string;
};

const OPTIONS: { key: PollStatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "closed", label: "Closed" },
];

export default function StatusSegmentedControl({
    value,
    onChange,
    counts,
    label,
}: StatusSegmentedControlProps) {
    return (
        <div
            role="group"
            aria-label={label}
            className="inline-flex items-center rounded-full border p-1 backdrop-blur-md"
            style={{
                backgroundColor: 'var(--segment-frost-bg)',
                borderColor: 'var(--segment-frost-border)',
            }}
        >
            {OPTIONS.map(({ key, label: optionLabel }) => {
                const isSelected = value === key;
                return (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onChange(key)}
                        className="rounded-full px-3 py-1.5 text-[11px] sm:text-[12px] font-medium cursor-pointer
                                   transition-colors duration-150 motion-reduce:transition-none"
                        style={{
                            backgroundColor: isSelected ? 'var(--segment-selected-bg)' : 'transparent',
                            color: isSelected ? 'var(--segment-selected-text)' : 'var(--segment-unselected-text)',
                        }}
                    >
                        {optionLabel}
                        {typeof counts[key] === "number" && (
                            <>
                                {" "}
                                <span
                                    style={{
                                        color: isSelected ? 'var(--segment-selected-count-text)' : 'var(--text-muted)',
                                    }}
                                >
                                    {counts[key]}
                                </span>
                            </>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
