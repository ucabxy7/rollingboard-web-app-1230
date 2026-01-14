"use client";

import { useState } from "react";
import { signupSchema } from "@/models/users";
import SignupForm from "../form/signupForm";
import OTPForm from "../form/otpForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { autoSignIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

const SignupFlow = () => {
  const router = useRouter();

  const [step, setStep] = useState<"signup" | "otp">("signup");
  const signUpForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const handleSignupSuccess = () => {
    setStep("otp");
  };

  const handleOTPSuccess = async () => {
    try {
      await autoSignIn();
      router.push("/");
    } catch (error) {
      // TODO: Bugsnag notify error
      console.error(error);
    }
  };

  return (
    <>
      {step === "signup" && (
        <SignupForm form={signUpForm} onSuccess={handleSignupSuccess} />
      )}
      {step === "otp" && (
        <OTPForm
          userId={signUpForm.getValues("email")}
          onSuccess={handleOTPSuccess}
        />
      )}
    </>
  );
};

export default SignupFlow;
