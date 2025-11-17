export type ComplaintStatus = "open" | "in_progress" | "resolved";

export interface Complaint {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
}

export interface ComplaintReply {
  id: string;
  complaint_id: string;
  admin_id: string;
  admin_name: string;
  message: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
}
