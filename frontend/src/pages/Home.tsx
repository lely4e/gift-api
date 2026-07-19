import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { type FC, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ConfettiIcon,
  PencilLineIcon,
  PlusIcon,
  ThumbsUpIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

const Home: FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleCreateEvent = () => {
    if (!user) navigate("/login");
    else navigate("/add-poll");
  };

  const steps = [
    {
      label: "CREATE POLL",
      step: "01",
      icon: PencilLineIcon,
      bgColor: theme === "dark" ? "bg-none" : "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      label: "INVITE FRIENDS",
      step: "02",
      icon: UsersThreeIcon,
      bgColor: theme === "dark" ? "bg-none" : "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "ADD OPTIONS",
      step: "03",
      icon: PlusIcon,
      bgColor: theme === "dark" ? "bg-none" : "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      label: "VOTE",
      step: "04",
      icon: ThumbsUpIcon,
      bgColor: theme === "dark" ? "bg-none" : "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "CELEBRATE",
      step: "05",
      icon: ConfettiIcon,
      bgColor: theme === "dark" ? "bg-none" : "bg-pink-100",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-1/5 right-0 flex-col gap-4 z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="poll-card w-44 rounded-2xl p-4 shadow-lg cursor-pointer opacity-80"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "var(--pill-active-bg)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
              <span className="text-[10px] font-bold" style={{ color: "var(--pill-text)" }}>
                Active
              </span>
            </div>
          </div>
          <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-active)" }}>
            Mike's Birthday 🎉
          </h4>
          <p className="text-xs mb-3" style={{ color: "var(--text-active)" }}>Budget: $450</p>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--accent-orange)" }}>
            <span>8 votes</span><span>•</span><span>67%</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotate: -2 }}
          className="poll-card w-44 rounded-2xl p-4 shadow-lg cursor-pointer opacity-80"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "var(--pill-active-bg)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
              <span className="text-[10px] font-bold" style={{ color: "var(--pill-text)" }}>
                Active
              </span>
            </div>
          </div>
          <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-active)" }}>
            Emma's Party 🏡
          </h4>
          <p className="text-xs mb-3" style={{ color: "var(--text-active)" }}>Budget: $380</p>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--accent-orange)" }}>
            <span>5 votes</span><span>•</span><span>42%</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main rotating container */}
      <motion.div
        className="min-h-screen relative"
        animate={{ rotate: isHovering ? -1.2 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative min-h-screen flex justify-center px-4 sm:px-6 pt-6 sm:pt-10
                        pb-32 sm:pb-28">
          <div className="relative w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-4xl p-6 sm:p-10 md:p-14 shadow-2xl"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-3 right-4 sm:-top-4 sm:-right-4 inline-flex
                           items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-lg"
                style={{ backgroundColor: "var(--pill-active-bg)" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4CAF50]"
                />
                <span className="text-xs sm:text-sm font-bold" style={{ color: "var(--pill-text)" }}>
                  LIVE NOW
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mb-4 text-left"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <div className="text-2xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.05] mb-1">
                  <span style={{ position: "relative", display: "inline-block", color: "#B0B6CC" }}>
                    Keep debating.
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "60%",
                        height: 4,
                        background: "#E63946",
                        transform: "translateY(-50%) rotate(-1.5deg)",
                        display: "block",
                        transformOrigin: "left center",
                      }}
                    />
                  </span>
                </div>

                <div className="text-2xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.05] mb-4 bg-linear-to-r from-[#ff6a00] to-[#ec4899] bg-clip-text text-transparent">
                  Start celebrating.
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 mt-2">
                  <div
                    className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black leading-[0.8] md:leading-[1.4] lg:leading-[1.4] text-left text-[#7f88ab]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    <span className="block w-fit relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-full before:bg-[#a4f0ff] before:mix-blend-multiply">
                      <span className="relative">[ Decision </span>
                    </span>
                    <span className="block w-fit relative mt-1 md:-mt-6 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[90%] before:bg-[#a4f0ff] before:mix-blend-multiply">
                      <span className="relative">infrastructure for</span>
                    </span>
                    <span className="block w-fit relative mt-1 md:-mt-6 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[90%] before:bg-[#a4f0ff] before:mix-blend-multiply">
                      <span className="relative">the indecisive ]</span>
                    </span>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="lg:w-1/4 text-xs sm:text-sm leading-relaxed mt-2 lg:mt-auto font-light"
                    style={{ color: "var(--text-primary)" }}
                  >
                    The fastest way to turn "any gift ideas?" into the perfect surprise 🎉
                  </motion.p>
                </div>
              </motion.div>

              {/* Steps grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8 mt-8">
                {steps.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="poll-card rounded-2xl p-3 sm:p-4 text-center shadow-md
                                 hover:shadow-xl transition-all cursor-pointer relative
                                 overflow-hidden group"
                      style={{ backgroundColor: "var(--card-bg)" }}
                    >
                      <div className="absolute top-1.5 right-1.5 text-[9px] font-black text-[#F25E0D]/40">
                        {item.step}
                      </div>
                      <div
                        className={`absolute inset-0 ${item.bgColor} opacity-0
                                   group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                      />
                      <div className="relative z-10 flex items-center justify-center mb-2">
                        <div
                          className={`${item.bgColor} rounded-xl p-1.5 sm:p-2
                                     group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${item.iconColor}`} />
                        </div>
                      </div>
                      <div
                        className="relative z-10 text-[9px] sm:text-[10px] font-black tracking-wider"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="rounded-2xl p-4 sm:p-6"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <p className="font-serif italic leading-relaxed mb-2" style={{ color: "var(--text-primary)" }}>
                  "We spent 3 hours deciding on a group gift. Never again."
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  - Everyone, Eventually
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-2.5"
      >
        <Link
          to="/demo"
          className="rounded-full px-4 py-2 text-[13px] sm:text-sm font-semibold border backdrop-blur-md
                     transition-colors hover:opacity-80"
          style={{
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          Try the demo — no sign up
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCreateEvent();
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative bg-linear-to-r from-[#ff6a00] to-[#ec4899] rounded-full
                       px-6 py-4 sm:px-10 sm:py-6
                       text-white font-black text-base sm:text-xl shadow-2xl
                       hover:shadow-[0_12px_48px_rgba(255,138,91,0.5)]
                       transition-shadow duration-200
                       flex items-center gap-3 sm:gap-4 cursor-pointer"
          >
            <span>CREATE POLL</span>
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRightIcon weight="bold" className="w-5 h-5 sm:w-7 sm:h-7" />
            </motion.span>
          </button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;