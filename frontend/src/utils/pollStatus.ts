import type { Poll } from "./types";

export type PollStatus = "active" | "closed";

export type PollStatusFilter = "all" | PollStatus;

export const POLL_STATUS_FILTERS: PollStatusFilter[] = ["all", "active", "closed"];

export function getPollStatus(poll: Poll): PollStatus {
    return poll.active ? "active" : "closed";
}

export function isPollStatusFilter(value: string | null): value is PollStatusFilter {
    return value !== null && (POLL_STATUS_FILTERS as string[]).includes(value);
}

export function matchesPollStatusFilter(poll: Poll, filter: PollStatusFilter): boolean {
    return filter === "all" || getPollStatus(poll) === filter;
}

export function countPollStatuses(polls: Poll[]): Record<PollStatusFilter, number> {
    return polls.reduce(
        (counts, poll) => {
            counts.all += 1;
            counts[getPollStatus(poll)] += 1;
            return counts;
        },
        { all: 0, active: 0, closed: 0 } as Record<PollStatusFilter, number>,
    );
}
