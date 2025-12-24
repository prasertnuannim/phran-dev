import FormInput from "@/components/form/formInput";
import { SubmitButton } from "@/components/form/submitButton";
import FormAlert from "@/components/form/formAlert";
import { registerUser } from "@/app/actions/registerForm";


export default function RegisterForm({
  searchParams,
}: {
  searchParams?: {
    error?: string;
    success?: string;
    name?: string;
    email?: string;
  };
}) {
  return (
    <form action={registerUser} className="space-y-4">
      <FormInput
        name="name"
        label="Username"
        placeholder="Enter your username"
        defaultValue={searchParams?.name}
      />

      <FormInput
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        defaultValue={searchParams?.email}
      />

      <FormInput
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
      />

      <FormInput
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      <SubmitButton text="Register" />

      {searchParams?.error && (
        <FormAlert variant="error" message={searchParams.error} />
      )}

      {searchParams?.success && (
        <FormAlert variant="success" message="Registration successful!" />
      )}

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
