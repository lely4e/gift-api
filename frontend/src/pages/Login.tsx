import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { loginSchema, type LoginFormErrors } from "../schemas/loginSchema";
import { EnvelopeIcon, LockIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useUser();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse({
      username: loginData.username,
      password: loginData.password,
    })

    if (!result.success) {
      const fieldErrors: LoginFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});

    const body = new URLSearchParams({
      username: result.data.username,
      password: result.data.password,
    });

    try {
      // login and get token
      const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data.detail?.toLowerCase().includes("password")) {
          setErrors({ password: data.detail });
        }
        if (data.detail?.toLowerCase().includes("username")) {
          setErrors({ password: data.detail });
        } else {
          toast.error(data.detail || "Login failed");
        }
        return;
      }

      console.log("Token recieved:", data.access_token);

      const userResponse = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        return;
      }

      const userData = await userResponse.json();
      console.log("User data fetched:", userData);

      login(data.access_token, userData);

      toast.success("User logged in successfully!", {
        duration: 2000,
      });
      console.log("Login successful:", data);

      navigate("/my-polls")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Error to log in:", error);
    }
  }

  return (
    <motion.div className="min-h-screen flex items-start justify-center px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0, duration: 0.6 }}>
      <section className="w-full max-w-md">
        <div
          className="box-content poll-card backdrop-blur-md rounded-[30px] p-6 sm:p-8
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
          style={{
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-1.25 pb-0"
          >
            <h1 className="text-center mb-3 mt-5 text-[#737791] font-black text-3xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Welcome back
            </h1>
            <p className="flex flex-col items-center text-[12px] mb-5"
              style={{ color: 'var(--text-primary)' }}>
              Please sign in to continue
            </p>

            <div className="relative w-full mb-3">
              <EnvelopeIcon className="absolute left-4 top-5 -translate-y-1/2 text-white w-4 h-4" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="email@example.com"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                required
                className={`w-full h-10 bg-[#737791] text-white text-[12px] rounded-full
                text-center placeholder-[#fff1ea] placeholder:italic placeholder:font-normal
                 ${errors.username ? "border-red-400" : "border-[#737791]"}`}
              />
              {errors.username && (
                <span className="text-red-500 text-xs mt-1">{errors.username}</span>
              )}
            </div>

            <div className="relative w-full mb-3">
              <LockIcon className="absolute left-4 top-5 -translate-y-1/2 text-white w-4 h-4" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                className={`w-full h-10 bg-[#737791] text-white text-[12px] rounded-full
                text-center placeholder-[#fff1ea] placeholder:italic placeholder:font-normal
                       ${errors.password ? "border-red-400" : "border-[#737791]"}`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password}</span>
              )}

            </div>
            <div className="w-full pt-3">
              <button
                id="submitButton"
                type="submit"
                className="w-full h-11 bg-linear-to-r from-[#ff6a00] to-[#ec4899] hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)] duration-200 rounded-full text-white cursor-pointer"
              >
                Sign In
              </button>
              <p className="flex flex-col items-center text-[12px] text-[#737791] pt-7.5"
                style={{ color: 'var(--text-primary)' }}>
                Don’t have an account?{" "}
                <Link to="/signup" className="text-[#F25E0D]"
                  style={{ color: 'var(--accent-orange)' }}>
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  );
}
