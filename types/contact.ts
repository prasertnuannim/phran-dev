export type ContactFormStatus = "idle" | "success" | "error";

export interface ContactFormState {
  status: ContactFormStatus;
  message: string;
}
