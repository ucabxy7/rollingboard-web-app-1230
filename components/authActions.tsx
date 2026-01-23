"use client";

import { Button } from "./shared/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { User } from "@/models/users";
//  in charge of 2 things
//  before log in (sign up & sign in buttons and click route)
//  after log in (avatar+email & sign out button and click route)

// input parameters:
// user - null or user object (affect elements itself: before/after log in info and shape)
// variant - inline or stack (affect layout of all elements)
// onsignedout - callback after sign out (if click 'sign out' button)
// onactioncomplete - callback after 3 action (if click 'any' button, used in sidedrawer layout)

type AuthActionsProps = {
  user: User | null;

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
  // authChecked,
  onSignedOut,
  onActionComplete,
  variant = "inline",
}: AuthActionsProps) => {
  const t = useTranslations();
  const router = useRouter();
  // if (!authChecked) return null;

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
          // await signOut();
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
