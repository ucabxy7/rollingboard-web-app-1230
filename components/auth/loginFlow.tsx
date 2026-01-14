"use client";

import LoginForm, { loginSchema } from "../form/loginForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation";

const LoginFlow = () => {
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return <LoginForm form={loginForm} onSuccess={handleLoginSuccess} />;
};

export default LoginFlow;
