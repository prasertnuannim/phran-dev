"use client";

import { useActionState, useState } from "react";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/form/submitButton";
import FormInput from "@/components/form/formInput";
import { LoginFormState } from "@/types/auth.type";
import FormAlert from "@/components/form/formAlert";
import { loginUser } from "@/app/actions/loginForm";
import RegisterModal from "./RegisterForm";

export default function LoginForm() {
  const initialState: LoginFormState = {
    errors: {},
    //values: { email: "admin@example.com", password: "admin123" },
  };

  const [state, formAction, isPending] = useActionState(loginUser, initialState);
  const [openRegister, setOpenRegister] = useState(false);


  if (state.success) {
    redirect("/");
  }

  return (
    <>
      <form action={formAction} className="space-y-4">
        <FormInput
          name="email"
          type="email"
          label="Email"
          placeholder="Your email"
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          defaultValue={state.values?.password}
          error={state.errors?.password}
        />
        <SubmitButton text="Login" isPending={isPending} />

        {state.errors?.general && (
          <FormAlert
            variant="error"
            title="Login failed"
            message={state.errors?.general}
          />
        )}

        {/* <div className="flex justify-end text-xs text-gray-600 dark:text-gray-400">
          <button
            type="button"
             onClick={() => setOpenRegister(true)}
            className="hover:text-gray-400 text-white/20 transition"
          >
            Register here
          </button>
        </div> */}
      </form>

      <RegisterModal
        open={openRegister}
        onOpenChange={setOpenRegister}
      />
    </>
  );
}
