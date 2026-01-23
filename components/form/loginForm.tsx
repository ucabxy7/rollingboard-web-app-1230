"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import Input from "../shared/input";
import Link from "next/link";
import { Button } from "../shared/button";
import { signIn } from "@/services/auth";
import { UseFormReturn } from "react-hook-form";
import Bugsnag from "@bugsnag/js";
import useUsersStore from "@/stores/users";
import { fetchCurrentUser } from "@/services/users";
import { signOut } from "aws-amplify/auth";

// Zod schema for login validation
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Login is required")
    .min(3, "Login must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess?: () => void;
  form: UseFormReturn<LoginFormData>;
};

const LoginForm = ({ form, onSuccess }: LoginFormProps) => {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = form;
  const { setUser } = useUsersStore();

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearErrors("root");
      await signOut();
      // fetchCurrentUser needs tokens produced by signIn
      await signIn(data.email, data.password);
      const user = await fetchCurrentUser();
      setUser(user);
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";
      setError("root", { type: "server", message });
      // TODO: Bugsnag notify error
      Bugsnag.notify(error as Error);
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-dark-9 rounded-[16px] p-8 border border-white/10 flex flex-col gap-5 max-w-md"
    >
      <h2 className="text-white text-h4 font-bold mb-6">
        {t("buttons.signIn")}
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        {/* Email Input */}
        <Input
          id="email"
          type="email"
          label={t("login.email")}
          placeholder={t("login.email")}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Input */}
        <Input
          id="password"
          type="password"
          label={t("login.password")}
          placeholder={t("login.password")}
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {errors.root?.message && (
        <p className="text-red-6 text-small" role="alert">
          {errors.root.message}
        </p>
      )}
      {/* Sign Up Link */}
      <div>
        <p className="text-dark-2 text-small">
          {t("login.alreadyHaveAccount")}{" "}
          <Link
            href="/auth/signup"
            className="text-dark-0 hover:text-dark-1 font-semibold transition-colors"
          >
            {t("login.createAccount")}
          </Link>
        </p>
      </div>

      <div className="flex justify-center">
        {/* Submit Button */}
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {t("buttons.signIn")}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
