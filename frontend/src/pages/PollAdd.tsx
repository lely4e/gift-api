import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api/auth";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { pollSchema, type PollFormErrors } from "../schemas/pollSchema";
import { ClockIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";


export default function PollAdd() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState<PollFormErrors>({});

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = pollSchema.safeParse({
      title: title,
      budget: Number(budget),
      description: description || undefined,
      deadline: deadline || undefined,
    })

    if (!result.success) {
      const fieldErrors: PollFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PollFormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});

    try {
      const response = await authFetch(`${API_URL}/polls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.data.title,
          budget: result.data.budget,
          description: result.data.description,
          deadline: result.data.deadline,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.detail || "Error creating poll");
        console.error("Error creating poll:", data);
        return;
      }

      console.log("Poll created successfully:", data);
      toast.success("Poll created successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/my-polls");
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Error creating poll:", error);
    }
  }

  return (
    <>
      {/* wrap-title-poll */}
      <motion.div className="min-h-screen flex items-start justify-center px-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.6 }}>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div
              className="box-content poll-card backdrop-blur-md rounded-[30px] p-6 sm:p-8
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
              style={{
                backgroundColor: 'var(--card-bg)',
              }}
            >

              {/* poll-text */}
              <div className="mb-1">
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Mike's Birthday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ color: 'var(--text-primary)' }}

                  className={`w-full text-left m-0 font-bold text-2xl sm:text-3xl
                       ${errors.title ? "border-b border-red-400" : "border-[#737791]"}`}
                />
                {errors.title && (
                  <span className="text-red-500 text-xs mt-1">{errors.title}</span>
                )}
              </div>
              <div className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">

                <label htmlFor="budget" className="text-sm shrink-0" style={{ color: 'var(--text-primary)' }}>
                  Budget $
                </label>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  placeholder="300"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  style={{ color: 'var(--text-primary)' }}
                  className={`flex-1  text-sm 
                   ${errors.budget ? "border-b border-red-400" : "border-[#737791]"}`}
                />

              </div>
              {errors.budget && (
                <span className="text-red-500 text-xs mt-1">{errors.budget}</span>
              )}

              <div className="flex w-full">
                <input
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Here is a short description you could add to your poll"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ color: 'var(--text-primary)' }}
                  className={`flex w-full text-left  mt-2.5 text-sm font-serif italic pt-1 pb-1
                  ${errors.description ? "border-b border-red-400" : "border-[#737791]"}`}
                />

              </div>
              {errors.description && (
                <span className="text-red-500 text-xs mt-1">{errors.description}</span>
              )}
              {/* deadline */}
              <div>
                <div className="flex items-center mt-8 mb-5 gap-2 ml-0 text-[12px]" style={{ color: 'var(--accent-orange)' }}>
                  <ClockIcon size={14} strokeWidth={1.5} />
                  <input
                    id="date"
                    type="date"
                    name="date"
                    placeholder="Date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ color: 'var(--text-primary)' }}
                    className={`date-icon flex-1 text-left text-sm font-serif italic pt-1 pb-1
                    ${errors.deadline ? "border-red-400" : "border-[#737791]"}`}
                  />
                  {errors.deadline && (
                    <span className="text-red-500 text-xs mt-1">{errors.deadline}</span>
                  )}
                </div>
              </div>
              <div className="flex pt-3">
                <button
                  id="submitButton"
                  type="submit"
                  className="justify-center items-center  mx-auto w-full h-12 bg-linear-to-r from-[#ff6a00] to-[#ec4899] hover:shadow-[0_6px_28px_rgba(255,138,91,0.5)] duration-200 rounded-3xl text-white cursor-pointer"
                >
                  Create Poll
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
