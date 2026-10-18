import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import App from "@/App";

interface AuthModalProps {
  activeTab: "login" | "register";
  subtitle: string;
  children: ReactNode;
}

export function AuthModal({ activeTab, subtitle, children }: AuthModalProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Home */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        <App />
      </div>

      {/* Dimmed Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/55" aria-hidden="true" />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-[420px] bg-[#241612] border border-[#3a2416] p-7 pt-6 pb-6 text-zinc-100 font-mono shadow-2xl rounded-none my-auto">
          {/* Close button */}
          <Link
            to="/"
            aria-label="Fechar"
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="size-4" aria-hidden="true" />
          </Link>

          {/* Tab navigation */}
          <div className="text-center font-bold text-base tracking-wide mb-3">
            <Link
              to="/login"
              className={
                activeTab === "login"
                  ? "text-[#d4893f]"
                  : "text-zinc-100 hover:text-[#d4893f] transition-colors"
              }
            >
              Entrar
            </Link>
            <span className="text-[#d4893f] mx-2 font-light">|</span>
            <Link
              to="/register"
              className={
                activeTab === "register"
                  ? "text-[#d4893f]"
                  : "text-zinc-100 hover:text-[#d4893f] transition-colors"
              }
            >
              Criar conta
            </Link>
          </div>

          {/* Subtitle */}
          <p className="text-center text-[10px] text-zinc-300 leading-relaxed max-w-[320px] mx-auto mb-5">
            {subtitle}
          </p>

          {/* Modal Form content */}
          {children}

          {/* Bottom gold accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#d4893f]" />
        </div>
      </div>
    </div>
  );
}
