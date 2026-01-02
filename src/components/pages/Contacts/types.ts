export interface Contact {
  _id: string;
  name: string;
  contactValue: string;
  message: string;
  createdAt: string;
  replied: boolean;
  adminReply?: string;
}
