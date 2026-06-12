import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../supabase/client";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("loading");
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        subject: data.subject || "No Subject",
        message: data.message,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        setSubmitStatus("error");
      } else {
        setSubmitStatus("success");
        reset();
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-[1280px] w-full mx-auto flex flex-col justify-center text-left font-sans relative z-10">
      
      {/* Mesh gradients absolute behind */}
      <div className="bg-blob bg-primary/10 dark:bg-primary/5 w-[600px] h-[600px] top-[-100px] left-[-200px] absolute filter blur-[100px] rounded-full pointer-events-none -z-10 animate-float-1"></div>
      <div className="bg-blob bg-tertiary/10 dark:bg-tertiary/5 w-[500px] h-[500px] top-[40%] right-[-150px] absolute filter blur-[100px] rounded-full pointer-events-none -z-10 animate-float-2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Side: Context & Info */}
        <div className="flex flex-col gap-10">
          <div>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 mb-6 border border-primary/25">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">Open for new ventures</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
              Let's build something extraordinary.
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-lg leading-relaxed">
              Seeking technical precision and visionary design? Reach out to discuss engineering opportunities, design systems, or creative collaborations.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Contact Item: Email */}
            <a
              href="mailto:hello@romeobessenaar.com"
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low dark:hover:bg-inverse-surface border border-outline-variant/15 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <div>
                <div className="font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Email</div>
                <div className="font-display font-semibold text-base text-on-surface group-hover:text-primary transition-colors">hello@romeo.com</div>
              </div>
            </a>

            {/* Contact Item: Network */}
            <a
              href="https://linkedin.com/in/romeobessenaar"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low dark:hover:bg-inverse-surface border border-outline-variant/15 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-xl">link</span>
              </div>
              <div>
                <div className="font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Network</div>
                <div className="font-display font-semibold text-base text-on-surface group-hover:text-secondary transition-colors">LinkedIn /romeo</div>
              </div>
            </a>

            {/* Contact Item: Code */}
            <a
              href="https://github.com/romeobessenaar"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low dark:hover:bg-inverse-surface border border-outline-variant/15 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <div className="w-12 h-12 rounded-full bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-xl">code</span>
              </div>
              <div>
                <div className="font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Code</div>
                <div className="font-display font-semibold text-base text-on-surface group-hover:text-tertiary transition-colors">GitHub /romeob</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-outline-variant/30 text-left hover:scale-[1.01] transition-transform duration-300">
          {submitStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <span className="material-symbols-outlined text-6xl text-tertiary animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 className="font-display font-bold text-xl text-on-surface">Message Sent Successfully!</h3>
              <p className="font-body text-sm text-on-surface-variant max-w-sm">
                Thank you for reaching out. Romeo will review your submission and get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-mono text-xs rounded-full hover:opacity-95"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="input-wrapper text-left">
                  <input
                    type="text"
                    {...register("name")}
                    className="input-glass w-full py-2 font-body text-base text-on-surface focus:outline-none border-b border-outline-variant focus:border-primary transition-all placeholder-transparent"
                    placeholder="Full Name"
                    required
                  />
                  <label className="floating-label font-mono text-xs text-on-surface-variant pointer-events-none select-none">Full Name</label>
                  {errors.name && (
                    <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.name.message}</span>
                  )}
                </div>

                <div className="input-wrapper text-left">
                  <input
                    type="email"
                    {...register("email")}
                    className="input-glass w-full py-2 font-body text-base text-on-surface focus:outline-none border-b border-outline-variant focus:border-primary transition-all placeholder-transparent"
                    placeholder="Email Address"
                    required
                  />
                  <label className="floating-label font-mono text-xs text-on-surface-variant pointer-events-none select-none">Email Address</label>
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="input-wrapper text-left">
                <input
                  type="text"
                  {...register("subject")}
                  className="input-glass w-full py-2 font-body text-base text-on-surface focus:outline-none border-b border-outline-variant focus:border-primary transition-all placeholder-transparent"
                  placeholder="Subject (Optional)"
                />
                <label className="floating-label font-mono text-xs text-on-surface-variant pointer-events-none select-none">Subject (Optional)</label>
              </div>

              <div className="input-wrapper text-left mt-4">
                <textarea
                  rows={4}
                  {...register("message")}
                  className="input-glass w-full py-2 font-body text-base text-on-surface focus:outline-none border-b border-outline-variant focus:border-primary transition-all placeholder-transparent resize-none"
                  placeholder="Your Message"
                  required
                ></textarea>
                <label className="floating-label font-mono text-xs text-on-surface-variant pointer-events-none select-none">Your Message</label>
                {errors.message && (
                  <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="mt-4 bg-primary text-on-primary font-mono text-xs py-4 px-8 rounded-full flex items-center justify-center gap-2 hover:bg-primary-container hover:scale-101 active:scale-95 transition-all w-full md:w-auto self-start"
              >
                <span>{submitStatus === "loading" ? "Sending..." : "Send Message"}</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>

              {submitStatus === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/35 rounded-lg text-xs font-mono text-red-500 text-center">
                  An error occurred. Please check network connection and try again.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Contact;
