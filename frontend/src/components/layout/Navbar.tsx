import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo_orange.svg";
import { MoonIcon, PlusIcon, SignInIcon, SunIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, avatarUrl } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // NOT LOGGED IN
  if (!user) {
    return (
      <header className="w-full">
        <div className="flex justify-between items-center px-4 max-w-300 mx-auto">
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="logo" className="w-22 sm:w-26" />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       border border-[#FF6A00] text-[#FF6A00] text-[14px]
                       tracking-[0.3px] transition hover:bg-[#FF6A00]
                       hover:text-white font-medium"
          >
            Sign in
            <SignInIcon size={16} weight="fill" />
          </Link>
        </div>
      </header>
    );
  }

  // LOGGED IN
  return (
    <header className="w-full">
      <div className="flex justify-between items-center px-4 max-w-300 mx-auto h-14">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="logo" className="w-22 sm:w-26" />
        </Link>

        {/* DESKTOP RIGHT MENU */}
        <div
          className="hidden sm:flex items-center gap-8"
          style={{ color: 'var(--text-heading)' }}
        >
          <Link to="/my-polls" className="text-[14px] tracking-[0.3px] hover:text-[#F25E0D] transition">
            Polls
          </Link>
          <Link to="/my-ideas" className="text-[14px] tracking-[0.3px] hover:text-[#F25E0D] transition">
            Ideas
          </Link>
          <Link
            to="/add-poll"
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2
                       border-[#FF6A00] text-[14px] tracking-[0.3px] transition
                       hover:opacity-90 hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)]
                       duration-200 hover:bg-linear-to-r from-[#ff6a00] to-[#ec4899]"
          >
            <PlusIcon size={16} strokeWidth={2.5} />
            Create Poll
          </Link>
          <Link to="/profile">
            <img src={avatarUrl} alt="avatar" className="h-7 rounded-full" />
          </Link>
        </div>

        {/* MOBILE RIGHT: avatar + theme + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <Link to="/profile">
            <img src={avatarUrl} alt="avatar" className="h-7 rounded-full" />
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-7 h-7 rounded-full transition hover:bg-[#B0B6CC] poll-card"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
          >
            {theme === 'light'
              ? <MoonIcon size={16} weight="fill" color="#645DD7" />
              : <SunIcon size={16} weight="fill" color="#F4AC45" />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-7 h-7 rounded-full transition"
            style={{ color: 'var(--text-heading)' }}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <XIcon size={20} weight="bold" />
              : <ListIcon size={20} weight="bold" />}
          </button>
        </div>

        {/* DESKTOP THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full
                     transition hover:bg-[#B0B6CC] poll-card cursor-pointer"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          {theme === 'light'
            ? <MoonIcon size={18} weight="fill" color="#645DD7" />
            : <SunIcon size={18} weight="fill" color="#F4AC45" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div
          className="sm:hidden flex flex-col px-4 pb-4 pt-2 gap-1"
          style={{ borderColor: 'var(--border-color, #e5e7eb)', color: 'var(--text-heading)' }}
        >
          <Link
            to="/my-polls"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-3 rounded-lg text-[14px] tracking-[0.3px]
                       hover:text-[#F25E0D] hover:bg-black/5 transition"
          >
            Polls
          </Link>
          <Link
            to="/my-ideas"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-3 rounded-lg text-[14px] tracking-[0.3px]
                       hover:text-[#F25E0D] hover:bg-black/5 transition"
          >
            Ideas
          </Link>
          <div className="h-px my-1" />
          <Link
            to="/add-poll"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 mx-2 mt-1 px-4 py-2.5
                       rounded-full border-2 border-[#FF6A00] text-[14px] tracking-[0.3px]
                       transition hover:opacity-90 hover:bg-linear-to-r
                       from-[#ff6a00] to-[#ec4899] duration-200"
          >
            <PlusIcon size={16} strokeWidth={2.5} />
            Create Poll
          </Link>
        </div>
      )}
    </header>
  );
}