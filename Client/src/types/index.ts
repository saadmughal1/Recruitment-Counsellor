
export type UserType = 'applicant' | 'recruiter';

export interface User {
  id: string;
  token: string;
  fullname: string;
  email: string;
  userType: UserType;
  profilePhoto?: string;
  companyName?: string;
  companyDescription?: string;
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
  _id: string,
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  _id: string;
  name: string;
}

export interface Experience {
  _id: string;
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
  _id: string;
  recruiterId: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  skillsRequired: string[];
  experienceRequired: number;
  createdAt: string;
  isActive: Boolean;
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
