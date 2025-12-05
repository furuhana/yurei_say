
export interface GuestEntry {
  id: string;
  name: string;
  message: string;
  date: string; // Now represents "Time/Space" (customizable string)
  oc?: string;  // Original Character / Setting info
  replyTo?: string; // ID of the parent message
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
