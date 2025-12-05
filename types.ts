export interface GuestEntry {
  id: string;
  name: string;
  message: string;
  date: string; // Now represents "Time/Space" (customizable string)
  oc?: string;  // Original Character / Setting info
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}