export type InputStep =
  | "verification"
  | "name"
  | "email"
  | "message"
  | "confirmation"
  | "goodbye";

export interface Message {
  id?: string;
  text: string;
  sender: "bot" | "user";
  timestamp?: Date;
  complete?: boolean;
}

export interface FormData {
  userName: string;
  userEmail: string;
  userMessage: string;
  userVerification: string;
}
