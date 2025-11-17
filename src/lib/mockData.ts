import { Complaint, ComplaintReply, User } from "@/types/complaint";

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.student@university.edu",
    role: "student",
  },
  {
    id: "2",
    name: "Admin Smith",
    email: "admin@university.edu",
    role: "admin",
  },
  {
    id: "3",
    name: "Jane Student",
    email: "jane@university.edu",
    role: "student",
  },
];

// Mock complaints
export const mockComplaints: Complaint[] = [
  {
    id: "C001",
    student_id: "1",
    student_name: "John Doe",
    student_email: "john.student@university.edu",
    title: "Library WiFi Connection Issues",
    description: "The WiFi in the library keeps disconnecting every 10 minutes. This is making it impossible to complete my online assignments and attend virtual classes.",
    status: "in_progress",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "C002",
    student_id: "3",
    student_name: "Jane Student",
    student_email: "jane@university.edu",
    title: "Cafeteria Food Quality",
    description: "The food quality in the cafeteria has significantly decreased over the past month. Multiple students have complained about undercooked meals.",
    status: "open",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "C003",
    student_id: "1",
    student_name: "John Doe",
    student_email: "john.student@university.edu",
    title: "Lab Equipment Not Working",
    description: "Several microscopes in Biology Lab 204 are not functioning properly. This is affecting our practical coursework.",
    status: "resolved",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "C004",
    student_id: "3",
    student_name: "Jane Student",
    student_email: "jane@university.edu",
    title: "Parking Space Shortage",
    description: "There are not enough parking spaces for students. I often have to arrive 30 minutes early just to find a spot.",
    status: "open",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock replies
export const mockReplies: ComplaintReply[] = [
  {
    id: "R001",
    complaint_id: "C001",
    admin_id: "2",
    admin_name: "Admin Smith",
    message: "Thank you for reporting this issue. We have contacted the IT department and they are investigating the WiFi connectivity problems. A technician will be on-site tomorrow.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "R002",
    complaint_id: "C003",
    admin_id: "2",
    admin_name: "Admin Smith",
    message: "The microscopes have been repaired and are now fully functional. Thank you for bringing this to our attention.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Auth state
export let currentUser: User | null = null;

export const loginUser = (email: string, password: string): User | null => {
  // Simple mock authentication
  const user = mockUsers.find((u) => u.email === email);
  if (user && password.length > 0) {
    currentUser = user;
    localStorage.setItem("mockUser", JSON.stringify(user));
    return user;
  }
  return null;
};

export const signupUser = (name: string, email: string, password: string): User | null => {
  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    return null;
  }

  // Create new student user
  const newUser: User = {
    id: String(mockUsers.length + 1),
    name,
    email,
    role: "student",
  };

  mockUsers.push(newUser);
  currentUser = newUser;
  localStorage.setItem("mockUser", JSON.stringify(newUser));
  return newUser;
};

export const logoutUser = () => {
  currentUser = null;
  localStorage.removeItem("mockUser");
};

export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem("mockUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

export const getComplaintsByStudent = (studentId: string): Complaint[] => {
  return mockComplaints.filter((c) => c.student_id === studentId);
};

export const getRepliesByComplaint = (complaintId: string): ComplaintReply[] => {
  return mockReplies.filter((r) => r.complaint_id === complaintId);
};
