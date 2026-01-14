"use client";

import { signOut } from "@/services/auth";
import { Button } from "./shared/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type User = {
  username: string;
  email?: string | null;
};

type AuthActionsProps = {
  user: User | null;
  authChecked: boolean;

  /**
   * Called after sign out succeeds
   * e.g. setUser(null),
   */
  onSignedOut?: () => void;

  /**
   * UI side-effect
   * e.g. close drawer
   */
  onActionComplete?: () => void;

  /**
   * Layout variant for styling only
   * default: inline (desktop header)
   * stack: vertical (mobile drawer)
   */
  variant?: "inline" | "stack";
};

const AuthActions = ({
  user,
  authChecked,
  onSignedOut,
  onActionComplete,
  variant = "inline",
}: AuthActionsProps) => {
  const t = useTranslations();
  const router = useRouter();
  if (!authChecked) return null;

  /* ---------- Unauthenticated ---------- */
  if (!user) {
    const linkClass =
      "text-medium font-semibold text-dark-2 hover:text-dark-0 transition-colors";

    const containerClass =
      variant === "stack" ? "flex flex-col gap-4" : "flex items-center gap-4";

    return (
      <div className={containerClass}>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/auth/login");
            onActionComplete?.();
          }}
        >
          {t("buttons.signIn")}
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            router.push("/auth/signup");
            onActionComplete?.();
          }}
        >
          {t("buttons.signUp")}
        </Button>
      </div>
    );
  }

  /* ---------- Authenticated ---------- */
  const containerClass =
    variant === "stack"
      ? "flex flex-col gap-3 pt-4 border-t border-dark-7"
      : "flex items-center gap-3";

  return (
    <div className={containerClass}>
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-dark-6 text-white
        flex items-center justify-center shrink-0"
          aria-hidden
        >
          {user.username[0].toUpperCase()}
        </div>
        <div className="text-sm text-dark-2 truncate">
          {user.email ?? user.username}
        </div>
      </div>
      {/* Sign out */}
      <Button
        onClick={async () => {
          await signOut();
          onSignedOut?.();
          onActionComplete?.();
        }}
        className="text-sm font-semibold text-dark-2 hover:text-dark-0 transition-colors"
      >
        {t("buttons.signOut")}
      </Button>
    </div>
  );
};

export default AuthActions;
