export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export type ContactFormStatus = "idle" | "success" | "error";

export interface ContactFormState {
  status: ContactFormStatus;
  message: string;
}
