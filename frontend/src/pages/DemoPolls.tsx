import { useState } from "react";
import { motion } from "framer-motion";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import DemoLayout from "../components/demo/DemoLayout";
import DemoPollCard from "../components/demo/DemoPollCard";
import DemoCreateCard from "../components/demo/DemoCreateCard";
import CreatePollModal from "../components/demo/CreatePollModal";
import StatusSegmentedControl from "../components/ui/StatusSegmentedControl";
import { useDemo } from "../context/DemoContext";
import {
  matchesPollStatusFilter,
  countPollStatuses,
  type PollStatusFilter,
} from "../utils/pollStatus";

export default function DemoPolls() {
  const { myPolls, sharedPolls } = useDemo();

  const [openSharedPolls, setOpenSharedPolls] = useState(true);
  const [openPolls, setOpenPolls] = useState(true);
  const [sharedFilter, setSharedFilter] = useState<PollStatusFilter>("all");
  const [myFilter, setMyFilter] = useState<PollStatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredSharedPolls = sharedPolls.filter((poll) => matchesPollStatusFilter(poll, sharedFilter));
  const filteredPolls = myPolls.filter((poll) => matchesPollStatusFilter(poll, myFilter));
  const sharedStatusCounts = countPollStatuses(sharedPolls);
  const myStatusCounts = countPollStatuses(myPolls);

  return (
    <DemoLayout>
      <div className="max-w-300 mx-auto px-4">
      {/* wrap-title-poll */}
      <motion.div className="flex justify-between items-start text-center"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex flex-col items-center mx-auto">
          <h1 className="px-5 text-[1.5em] leading-[1.1] font-black mb-2 mt-16" style={{ color: 'var(--text-heading)' }}>
            Polls & Picks
          </h1>
          <span className="font-serif italic" style={{ color: 'var(--text-primary)' }}>
            View, manage, and collaborate on your polls.
          </span>
        </div>
      </motion.div>

      {sharedPolls.length > 0 && (
        <hr className="w-full border-t mt-8 mb-2 sm:hidden" style={{ borderColor: 'var(--divider-color)' }} />
      )}

      <motion.div className="w-full flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {sharedPolls.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setOpenSharedPolls((prev) => !prev)}
              className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 ml-3 mt-2 sm:mt-6 px-1 py-1 rounded-md
                         text-[16px] font-semibold tracking-normal cursor-pointer
                         hover:opacity-70 transition-opacity
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-muted)"
              style={{ color: 'var(--text-eyebrow)' }}
            >
              Shared With Me
              {openSharedPolls ? (
                <CaretUpIcon size={20} strokeWidth={2} weight="bold" style={{ color: 'var(--text-muted)' }} />
              ) : (
                <CaretDownIcon size={20} strokeWidth={2} weight="bold" style={{ color: 'var(--text-muted)' }} />
              )}
            </button>
            {openSharedPolls && (
              <div className="w-full flex justify-center mt-2 sm:w-auto sm:mt-6 sm:mr-4 sm:ml-auto sm:justify-end">
                <StatusSegmentedControl
                  value={sharedFilter}
                  onChange={setSharedFilter}
                  counts={sharedStatusCounts}
                  label="Filter shared polls by status"
                />
              </div>
            )}
          </>
        )}
      </motion.div>
      {/* wrap-poll */}
      <motion.div className="flex justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {openSharedPolls && sharedPolls.length > 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {filteredSharedPolls.length === 0 && (
              <div className="col-span-full flex justify-center py-10">
                <p
                  className="text-sm rounded-full border px-4 py-2"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--toggle-inactive-bg)',
                    borderColor: 'var(--toggle-inactive-border)',
                  }}
                >
                  No {sharedFilter} polls yet
                </p>
              </div>
            )}
            {filteredSharedPolls.map((poll) => (
              <DemoPollCard key={poll.uuid} poll={poll} showCreator />
            ))}
          </div>
        )}
      </motion.div>

      {sharedPolls.length > 0 && (
        <hr
          className={`w-full border-t mb-0 sm:hidden ${openSharedPolls ? "mt-8" : "mt-2"}`}
          style={{ borderColor: 'var(--divider-color)' }}
        />
      )}

      <motion.div className="w-full flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <button
          type="button"
          onClick={() => setOpenPolls((prev) => !prev)}
          className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 ml-3 mt-2 sm:mt-14 px-1 py-1 rounded-md
                     text-[16px] font-semibold tracking-normal cursor-pointer
                     hover:opacity-70 transition-opacity
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-muted)"
          style={{ color: 'var(--text-eyebrow)' }}
        >
          My Polls
          {openPolls ? (
            <CaretUpIcon size={20} strokeWidth={2} weight="bold" style={{ color: 'var(--text-muted)' }} />
          ) : (
            <CaretDownIcon size={20} strokeWidth={2} weight="bold" style={{ color: 'var(--text-muted)' }} />
          )}
        </button>

        {openPolls && (
          <div className="w-full flex justify-center mt-2 sm:w-auto sm:mt-14 sm:mr-4 sm:ml-auto sm:justify-end">
            <StatusSegmentedControl
              value={myFilter}
              onChange={setMyFilter}
              counts={myStatusCounts}
              label="Filter my polls by status"
            />
          </div>
        )}
      </motion.div>
      {/* wrap-poll */}
      <motion.div className="flex justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {openPolls && myPolls.length > 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {filteredPolls.length === 0 && (
              <div className="col-span-full flex justify-center py-10">
                <p
                  className="text-sm rounded-full border px-4 py-2"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--toggle-inactive-bg)',
                    borderColor: 'var(--toggle-inactive-border)',
                  }}
                >
                  No {myFilter} polls yet
                </p>
              </div>
            )}
            {filteredPolls.map((poll) => (
              <DemoPollCard key={poll.uuid} poll={poll} />
            ))}
            <DemoCreateCard text="Create Poll" onClick={() => setCreateOpen(true)} />
          </div>
        )}
        {openPolls && myPolls.length === 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <DemoCreateCard text="Create Poll" onClick={() => setCreateOpen(true)} />
          </div>
        )}
      </motion.div>
      </div>

      <CreatePollModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </DemoLayout>
  );
}
