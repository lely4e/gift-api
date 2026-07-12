import React, { useEffect, useMemo, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import Modal from "../components/ui/Modal";
import CreateCard from "../components/ui/CreateCard";
import StatusSegmentedControl from "../components/ui/StatusSegmentedControl";
import { CalendarBlankIcon, CalendarCheckIcon, CalendarIcon, CaretDownIcon, CaretUpIcon, CheckIcon, DotIcon, LinkIcon, ShareFatIcon, ShoppingCartSimpleIcon, XIcon } from "@phosphor-icons/react";
import { daysLeft, getTimeLeftPercentage } from "../utils/date";
import { motion } from "framer-motion";
import {
  getPollStatus,
  isPollStatusFilter,
  matchesPollStatusFilter,
  countPollStatuses,
  type PollStatusFilter,
} from "../utils/pollStatus";

const Polls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [sharedPolls, setSharedPolls] = useState<Poll[]>([]);

  const [openSharedPolls, setOpenSharedPollls] = useState(true);
  const [openPolls, setOpenPollls] = useState(true);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const sharedFilterParam = searchParams.get("shared");
  const myFilterParam = searchParams.get("mine");
  const sharedFilter: PollStatusFilter = isPollStatusFilter(sharedFilterParam) ? sharedFilterParam : "all";
  const myFilter: PollStatusFilter = isPollStatusFilter(myFilterParam) ? myFilterParam : "all";

  const setStatusFilter = (key: "shared" | "mine", filter: PollStatusFilter) => {
    const next = new URLSearchParams(searchParams);
    if (filter === "all") {
      next.delete(key);
    } else {
      next.set(key, filter);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredSharedPolls = useMemo(
    () => sharedPolls.filter((poll) => matchesPollStatusFilter(poll, sharedFilter)),
    [sharedPolls, sharedFilter],
  );
  const filteredPolls = useMemo(
    () => polls.filter((poll) => matchesPollStatusFilter(poll, myFilter)),
    [polls, myFilter],
  );
  const sharedStatusCounts = useMemo(() => countPollStatuses(sharedPolls), [sharedPolls]);
  const myStatusCounts = useMemo(() => countPollStatuses(polls), [polls]);

  const [share, setShare] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const getPolls = async () => {
      try {
        const response = await authFetch(`${API_URL}/polls`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          toast.error(data?.detail || "Failed to fetch polls");
          console.error("Failed to fetch polls:", data);
          return;
        }

        setPolls(data.items);
        console.log("Polls fetched:", data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
        console.error("Failed to fetch polls:", error);
      }
    };

    getPolls();
  }, []);

  useEffect(() => {
    const getSharedPolls = async () => {
      try {
        const response = await authFetch(`${API_URL}/activities`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          toast.error(data?.detail || "Failed to fetch shared polls");
          console.error("Failed to fetch shared polls:", data);
          return;
        }

        setSharedPolls(data);
        console.log("Shared Polls fetched:", data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
        console.error("Failed to fetch shared polls:", error);
      }
    };

    getSharedPolls();
  }, []);

  const handleCopy = async (uuid: string) => {
    if (!uuid) return;
    const linkToCopy = `${window.location.origin}/polls/${uuid}`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(uuid);
      toast.success("Link copied to clipboard!", { duration: 2000 });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Failed to copy:", error);
    }
  };

  return (
    <>
      {/* wrap-title-poll */}
      <motion.div className="flex justify-between items-start text-center"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}>
        <div className="flex flex-col items-center mx-auto">
          <h1 className="px-5 text-[1.5em] leading-[1.1] font-black mb-2 mt-16" style={{ color: 'var(--text-heading)' }}>
            Polls & Picks
          </h1>
          <span className="font-serif italic" style={{ color: 'var(--text-primary)' }}>
            View, manage, and collaborate on your polls.
          </span>
        </div>
      </motion.div>

      {sharedPolls && sharedPolls.length > 0 && (
        <hr className="w-full border-t mt-8 mb-2 sm:hidden" style={{ borderColor: 'var(--divider-color)' }} />
      )}

      <motion.div className="w-full flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {sharedPolls && sharedPolls.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setOpenSharedPollls((prev) => !prev)}
              className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 ml-3 mt-2 sm:mt-6 px-1 py-1 rounded-md
                         text-[16px] font-semibold  tracking-normal cursor-pointer
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
                  onChange={(filter) => setStatusFilter("shared", filter)}
                  counts={sharedStatusCounts}
                  label="Filter shared polls by status"
                />
              </div>
            )}
          </>
        )}
      </motion.div>
      {/* wrap-poll */}
      <motion.div className="mx-auto flex px-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {/* poll-grid */}
        {openSharedPolls && sharedPolls && sharedPolls.length > 0 && (
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
              // card
              <div
                key={poll.uuid}
                id={poll.uuid}
                className="box-content poll-card backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                style={{
                  backgroundColor: 'var(--card-bg)',
                }}
                onClick={(e) => {
                  navigate(`/polls/${poll.uuid}`);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <div className="flex items-center justify-between mr-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full -rotate-6"
                      style={{ backgroundColor: getPollStatus(poll) === "active" ? 'var(--pill-active-bg)' : 'var(--pill-inactive-bg)' }}
                    >

                      <div className="relative w-1.5 h-1.5">
                        {getPollStatus(poll) === "active" && (
                          <div className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: '#4CAF50', opacity: 0.6 }} />
                        )}
                        <div className="relative w-1.5 h-1.5 rounded-full "
                          style={{ backgroundColor: getPollStatus(poll) === "active" ? '#4CAF50' : '#F44336' }} />
                      </div>

                      <span className="text-[10px] font-bold text-gray-700 tracking-[0.5px]" style={{ color: 'var(--pill-text)' }}>
                        {getPollStatus(poll) === "active" ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <ShareFatIcon
                    size={18}
                    strokeWidth={1.5}
                    className="hover:text-[#F25E0D]"
                    onClick={(e) => {
                      setShare(poll.uuid);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </div>

                <Modal
                  isOpen={share === poll.uuid}
                  onClose={() => setShare(null)}
                >
                  <div className="flex justify-between items-start gap-2 mb-4" >
                    <h3 className="font-bold text-lg mb-4.5 text-center ">
                      Your event link for{" "}
                      <span className="text-[#F25E0D]" >{poll.title}</span> is
                      ready to share! 🎉
                    </h3>
                    <XIcon
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShare(null);
                      }}
                      className="cursor-pointer shrink-0 mt-1"
                      size={20}
                      weight="bold"
                    />
                  </div>
                  <div className="flex">
                    <input
                      className="border-0 border-b border-[#F25E0D] bg-transparent text-[#737791] text-sm flex-1 min-w-0 h-12 "
                      id={poll.uuid}
                      value={`${window.location.origin}/polls/${poll.uuid}`}
                      readOnly
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(poll.uuid);
                      }}
                      className={` px-4  border-[#F25E0D] hover:bg-black h-12 hover:text-white transition-colors rounded-full
                             ${copied === poll.uuid
                          ? "bg-[#B0B6CC]"
                          : "bg-[#F25E0D] text-white cursor-pointer"
                        }
                           `}
                    >
                      {copied === poll.uuid ? (
                        <CheckIcon
                          size={16}
                          strokeWidth={2}
                          style={{ color: "white" }}
                          weight="bold"
                        />
                      ) : (
                        <LinkIcon size={16} strokeWidth={2} weight="bold" />
                      )}
                    </button>
                  </div>
                </Modal>

                <h3 className={`text-left m-0 font-bold text-3xl
                ${poll.active ?
                    " text-black "
                    :
                    "text-[#B0B6CC]"}`}
                  style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                >
                  {poll.title}
                </h3>

                {/* poll-text */}
                <p className="flex justify-between items-start gap-5 mt-2.5 text-lg sm:text-xl font-bold"
                  style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                >
                  Budget: ${poll.budget}
                </p>

                {/* poll-description */}
                {poll.description && (
                  <p className="flex text-left mt-2.5 text-sm font-serif italic"
                    style={{ color: poll.active ? 'var(--text-primary)' : 'var(--text-inactive)' }}
                  >
                    {poll.description}
                  </p>
                )}

                {/* progress bar */}
                <div className="mt-auto w-full h-1 bg-[#e5e7eb] rounded-full overflow-hidden my-1.5 mb-1" style={{ backgroundColor: 'var(--progress-track)' }}>
                  <div
                    className="h-full transition-[width] duration-300"
                    style={{
                      backgroundColor: poll.active ? 'var(--accent-orange-2)' : 'transparent',
                      width: `${getTimeLeftPercentage(poll)}%`,
                    }}
                  />
                </div>

                {/* meta row: items · deadline */}
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-1 mb-3 text-[12px]" style={{ color: poll.active ? 'var(--text-muted)' : 'var(--text-inactive)' }}>
                  <ShoppingCartSimpleIcon size={14} strokeWidth={1.5} weight="fill" />
                  <span>{poll.total_products} {poll.total_products === 1 ? "item" : "items"}</span>

                  <DotIcon size={18} weight="bold" />

                  {poll.deadline ? (
                    daysLeft(poll) > 0 ? (
                      <>
                        <CalendarIcon size={14} strokeWidth={1.5} weight="fill" />
                        <span>
                          {daysLeft(poll)}{" "}
                          {daysLeft(poll) === 1 ? "day left" : "days left"}
                        </span>
                      </>
                    ) : (
                      <>
                        <CalendarCheckIcon size={14} strokeWidth={1.5} weight="fill" />
                        <span>Finished</span>
                      </>
                    )
                  ) : (
                    <>
                      <CalendarBlankIcon size={14} strokeWidth={1.5} />
                      <span>No deadline</span>
                    </>
                  )}
                </div>

                {/* creator chip: footer, full width, non-interactive */}
                <div
                  className="flex w-full items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:text-[12px] select-none"
                  style={{ borderColor: 'var(--chip-border-muted)', color: 'var(--text-muted)' }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${poll.user_id}`}
                    alt="avatar"
                    className="w-4 h-4 rounded-full shrink-0"
                  />
                  <span>created by {poll.created_by}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {sharedPolls && sharedPolls.length > 0 && (
        <hr
          className={`w-full border-t mb-0 sm:hidden ${openSharedPolls ? "mt-8" : "mt-2"}`}
          style={{ borderColor: 'var(--divider-color)' }}
        />
      )}

      <motion.div className="w-full flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {/* {polls && polls.length > 0 && ( */}
        <button
          type="button"
          onClick={() => setOpenPollls((prev) => !prev)}
          className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 ml-3 mt-2 sm:mt-14 px-1 py-1 rounded-md
                     text-[16px] font-semibold  tracking-normal cursor-pointer
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
              onChange={(filter) => setStatusFilter("mine", filter)}
              counts={myStatusCounts}
              label="Filter my polls by status"
            />
          </div>
        )}
      </motion.div>
      {/* wrap-poll */}
      <motion.div className="mx-auto flex px-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {/* poll-grid */}
        {openPolls && polls.length > 0 && (
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
              // card
              <div
                key={poll.uuid}
                id={poll.uuid}
                className="box-content poll-card backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                style={{
                  backgroundColor: 'var(--card-bg)',
                }}
                onClick={(e) => {
                  navigate(`/polls/${poll.uuid}`);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <div className="flex items-center justify-between mr-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full -rotate-6"
                      style={{ backgroundColor: getPollStatus(poll) === "active" ? 'var(--pill-active-bg)' : 'var(--pill-inactive-bg)' }}
                    >

                      <div className="relative w-1.5 h-1.5">
                        {getPollStatus(poll) === "active" && (
                          <div className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: '#4CAF50', opacity: 0.6 }} />
                        )}
                        <div className="relative w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: getPollStatus(poll) === "active" ? '#4CAF50' : '#F44336' }} />
                      </div>

                      <span className="text-[10px] font-bold text-gray-700 " style={{ color: 'var(--pill-text)' }}>
                        {getPollStatus(poll) === "active" ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <ShareFatIcon
                    size={18}
                    strokeWidth={1.5}
                    className="hover:text-[#F25E0D]"
                    onClick={(e) => {
                      setShare(poll.uuid);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </div>

                <Modal
                  isOpen={share === poll.uuid}
                  onClose={() => setShare(null)}
                >
                  <div className="flex justify-between  items-start gap-2 mb-4">
                    <h3 className="font-bold text-lg mb-4.5 text-center ">
                      Your event link for{" "}
                      <span className="text-[#F25E0D]">{poll.title}</span> is
                      ready to share! 🎉
                    </h3>
                    <XIcon
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShare(null);
                      }}
                      className="cursor-pointer"
                      size={20}
                      weight="bold"
                    />
                  </div>
                  <div className="flex">
                    <input
                      className="border-0 border-b border-[#F25E0D] bg-transparent text-[#737791] text-sm flex-1 min-w-0 h-12 "
                      id={poll.uuid}
                      value={`${window.location.origin}/polls/${poll.uuid}`}
                      readOnly
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(poll.uuid);
                      }}
                      className={` px-4  border-[#F25E0D] hover:bg-black h-12 hover:text-white transition-colors rounded-full
                              ${copied === poll.uuid
                          ? "bg-[#B0B6CC]"
                          : "bg-[#F25E0D] text-white cursor-pointer"
                        }
                          `}
                    >
                      {copied === poll.uuid ? (
                        <CheckIcon
                          size={16}
                          strokeWidth={2}
                          style={{ color: "white" }}
                          weight="bold"
                        />
                      ) : (
                        <LinkIcon size={16} strokeWidth={2} weight="bold" />
                      )}
                    </button>
                  </div>
                </Modal>


                <h3 className={`text-left m-0 font-bold text-3xl
                ${poll.active ?
                    " text-black "
                    :
                    "text-[#B0B6CC]"}`}
                  style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                >
                  {poll.title}
                </h3>

                {/* poll-text */}
                <p className="flex justify-between items-start gap-5 mt-2.5 text-lg sm:text-xl font-bold"
                  style={{ color: poll.active ? 'var(--text-active)' : 'var(--text-inactive)' }}
                >
                  Budget: ${poll.budget}
                </p>

                {/* poll-description */}
                {poll.description && (
                  <p className="flex text-left mt-2.5 text-sm font-serif italic"
                    style={{ color: poll.active ? 'var(--text-primary)' : 'var(--text-inactive)' }}
                  >
                    {poll.description}
                  </p>
                )}

                {/* progress bar */}
                <div className="mt-auto w-full h-1 bg-[#e5e7eb] rounded-full overflow-hidden my-1.5 mb-1" style={{ backgroundColor: 'var(--progress-track)' }}>
                  <div
                    className="h-full transition-[width] duration-300"
                    style={{
                      backgroundColor: poll.active ? 'var(--accent-orange-2)' : 'transparent',
                      width: `${getTimeLeftPercentage(poll)}%`,
                    }}
                  />
                </div>

                {/* meta row: items · deadline */}
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-1 mb-5 text-[12px]" style={{ color: poll.active ? 'var(--text-muted)' : 'var(--text-inactive)' }}>
                  <ShoppingCartSimpleIcon size={14} strokeWidth={1.5} weight="fill" />
                  <span>{poll.total_products} {poll.total_products === 1 ? "item" : "items"}</span>

                  <DotIcon size={18} weight="bold" />

                  {poll.deadline ? (
                    daysLeft(poll) > 0 ? (
                      <>
                        <CalendarIcon size={14} strokeWidth={1.5} weight="fill" />
                        <span>
                          {daysLeft(poll)}{" "}
                          {daysLeft(poll) === 1 ? "day left" : "days left"}
                        </span>
                      </>
                    ) : (
                      <>
                        <CalendarCheckIcon size={14} strokeWidth={1.5} weight="fill" />
                        <span>Finished</span>
                      </>
                    )
                  ) : (
                    <>
                      <CalendarBlankIcon size={14} strokeWidth={1.5} />
                      <span>No deadline</span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* create-card */}
            <CreateCard address={"/add-poll"} text={"Create Poll"} />
          </div>
        )}
        {/* create-card */}
        {polls.length === 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <CreateCard address={"/add-poll"} text={"Create Poll"} />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Polls;
