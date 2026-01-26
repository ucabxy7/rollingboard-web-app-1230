"use client";

import { useTranslations } from "next-intl";
import Input from "../shared/input";
import { Button } from "../shared/button";
import { refreshToken, updateProfile } from "@/services/auth";
import { UseFormReturn } from "react-hook-form";
import { UpdateProfileFormData } from "@/models/users";

type UpdateProfileFormProps = {
  onSuccess?: () => void;
  onError?: () => void;
  form: UseFormReturn<UpdateProfileFormData>;
};

const UpdateProfileForm = ({
  form,
  onSuccess,
  onError,
}: UpdateProfileFormProps) => {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile(data);
      await refreshToken();
      onSuccess?.();
    } catch (error) {
      // TODO: Bugsnag notify error
      console.error(error);
      onError?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-white text-h4 font-bold mb-6">
        {t("editProfile.title")}
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        {/* Name Input */}
        <Input
          id="name"
          type="text"
          label={t("signup.form.name")}
          placeholder={t("signup.form.name")}
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Email Input */}
        <Input
          id="email"
          type="email"
          disabled
          label={t("signup.form.email")}
          placeholder={t("signup.form.email")}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="flex justify-center">
        {/* Submit Button */}
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {t("editProfile.save")}
        </Button>
      </div>
    </form>
  );
};

export default UpdateProfileForm;
