
export type UserType = 'applicant' | 'recruiter';

export interface User {
  token: string;
  fullname: string;
  email: string;
  userType: UserType;
  profilePhoto?: string;
}

export interface Applicant {
  fullName: string;
  email: string;
  profilePhoto?: string;
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  languages: Language[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Recruiter {
  id: string;
  companyName: string;
  companyInfo: string;
  recruiterName: string;
  email: string;
  profilePhoto?: string;
}

export interface JobPost {
  id: string;
  recruiterId: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  skillsRequired: string[];
  experienceRequired: number;
  postedDate: string;
  isActive: boolean;
}

export interface Connection {
  id: string;
  applicantId: string;
  recruiterId: string;
  jobPostId: string;
  status: 'pending' | 'accepted' | 'rejected';
  initiatedBy: 'applicant' | 'recruiter';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'connection' | 'message' | 'job';
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
