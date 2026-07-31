import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { type FC, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@phosphor-icons/react";
import RotatingSubtitle from "../components/home/RotatingSubtitle";

const Home: FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    if (!user) navigate("/login");
    else navigate("/add-poll");
  };

  return (
    <>
      {/* Main rotating container */}
      <motion.div
        className="relative"
        animate={{ rotate: isHovering ? -1.2 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative pt-6 sm:pt-10 pb-2 sm:pb-3">
          <div className="relative w-full max-w-300 mx-auto px-4">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-4xl p-6 sm:p-10 md:p-14 shadow-2xl"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-left"
                style={{ fontFamily: "'Sora', sans-serif", containerType: "inline-size" }}
              >
                <div
                  className="font-black leading-[1.05] mb-6"
                  style={{ fontSize: "clamp(63px, 9cqw, 118px)" }}
                >
                  <div
                    className="bg-linear-to-r from-[#ff6a00] to-[#ec4899] bg-clip-text text-transparent"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    choosr.
                  </div>
                  <div style={{ color: "var(--text-heading)" }}>
                    we help you choose what matters.
                  </div>
                </div>

                <RotatingSubtitle />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10"
                >
                  <button
                    onClick={handleCreateEvent}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="inline-flex items-center gap-2 rounded-full px-8 py-4
                               text-white font-light text-base sm:text-lg
                               bg-linear-to-r from-[#ff6a00] to-[#ec4899] shadow-lg
                               hover:shadow-[0_10px_30px_rgba(255,138,91,0.45)]
                               transition-shadow cursor-pointer"
                  >
                    Create a poll
                    <ArrowRightIcon size={20} weight="bold" />
                  </button>
                  <Link
                    to="/demo"
                    className="text-base sm:text-lg font-semibold underline underline-offset-4
                               hover:opacity-70 transition-opacity"
                    style={{ color: "var(--text-primary)" }}
                  >
                    or try the live demo
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;