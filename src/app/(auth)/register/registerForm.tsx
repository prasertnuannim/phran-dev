"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { registerUser } from "./action";
import { AuthFormState } from "@/types/auth.type";
import FormInput from "@/components/form/formInput";
import { SubmitButton } from "@/components/form/submitButton";
import FormAlert from "@/components/form/formAlert";

export default function RegisterForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const initialState: AuthFormState = {
    errors: {},
    values: { name: "", email: "", password: "", confirmPassword: "" },
  };

  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const values = state.values ?? {};

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsModalOpen(open);
      if (!open) router.push("/");
    },
    [router]
  );

  useEffect(() => {
    if (state.success) {
      if (formRef.current) formRef.current.reset();
      const timer = setTimeout(() => handleOpenChange(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [state.success, handleOpenChange]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-1">
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>Fill in your details to get started.</DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <FormInput
            name="name"
            type="text"
            label="Username"
            placeholder="Enter your username"
            defaultValue={values.name ?? ""}
            error={state.errors?.name}
          />

          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            defaultValue={values.email ?? ""}
            error={state.errors?.email}
          />

          <FormInput
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            defaultValue={values.password ?? ""}
            error={state.errors?.password}
          />

          <FormInput
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            defaultValue={values.confirmPassword ?? ""}
            error={state.errors?.confirmPassword}
          />

          <SubmitButton text="Register" isPending={isPending} />

          {state.errors?.general && (
            <FormAlert message={state.errors.general} variant="error" />
          )}
          {state.success && (
            <FormAlert message="Registration successful!" variant="success" />
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-gray-800 hover:underline">
              Login
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
