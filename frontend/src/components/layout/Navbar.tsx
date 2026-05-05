import { Link } from "react-router-dom";
import logoImg from "../../assets/logo_orange.svg"
import { MoonIcon, PlusIcon, SignInIcon, SunIcon } from "@phosphor-icons/react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";


export default function Navbar() {
  const { user, avatarUrl } = useUser();
  const { theme, toggleTheme } = useTheme();

  // NOT LOGGED IN
  if (!user) {
    return (
      <header className="w-full">
        <div className="flex justify-between items-center
                        px-4
                        max-w-300 mx-auto">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="logo"
              className="w-26"
            />
          </Link>

          {/* SIGN IN */}
          <Link
            to="/login"
            className="flex items-center gap-2
                       px-4 py-2 rounded-full
                       border border-[#FF6A00]
                       text-[#FF6A00] text-[14px] tracking-[0.3px]
                       transition hover:bg-[#FF6A00] hover:text-white font-medium"
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
      <div className="flex justify-between items-center
                      px-4 
                      max-w-300 mx-auto">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={logoImg}
            alt="logo"
            className="w-26"
          />
        </Link>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-8" style={{ color: 'var(--text-heading)' }}>

          <Link
            to="/my-polls"
            className=" text-[14px] tracking-[0.3px]
                       hover:text-[#F25E0D]
                       transition"
          >
            Polls
          </Link>

          <Link
            to="/my-ideas"
            className="text-[14px] tracking-[0.3px]
                       hover:text-[#F25E0D]
                       transition"
          >
            Ideas
          </Link>

          <Link
            to="/add-poll"
            className="flex items-center gap-2
                       px-4 py-2 rounded-full
                       border-2
                       border-[#FF6A00]
                       text-[14px] tracking-[0.3px]
                       transition hover:opacity-90 
                       text-('var(--text-heading)') hover:text-(--pill-text-hover)
                       hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)] duration-200
                      hover:bg-linear-to-r from-[#ff6a00] to-[#ec4899]"
          >
            <PlusIcon size={16} strokeWidth={2.5} className="text-('var(--text-heading)') hover:text-(--pill-text-hover)" />
            Create Poll
          </Link>

          <div className="flex items-center gap-2 cursor-pointer group">
            <Link to="/profile">
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-7 rounded-full"
              />
            </Link>
          </div>
        </div>

        <button onClick={toggleTheme} className="group  flex items-center justify-center cursor-pointer
                       w-8 h-8 rounded-full transition hover:bg-[#B0B6CC] poll-card"
          style={{
            backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)'
          }}
        >
          {theme === 'light' ? <MoonIcon size={18} weight="fill" color="#645DD7" /> : <SunIcon size={18} weight="fill" color="#F4AC45" />}
        </button>

      </div>
    </header>
  );
}
