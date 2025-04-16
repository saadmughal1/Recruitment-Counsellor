import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  Applicant,
  Recruiter,
  JobPost,
  Connection,
  Notification,
  Message,
  Skill,
  Experience,
  Education,
  Language,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

interface DataContextType {
  // Applicant data
  applicant: Applicant | null;
  updateApplicant: (data: Partial<Applicant>) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (education: Education) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (experience: Experience) => void;
  deleteExperience: (id: string) => void;
  addLanguage: (language: Omit<Language, "id">) => void;
  updateLanguage: (language: Language) => void;
  deleteLanguage: (id: string) => void;

  // Recruiter data
  recruiter: Recruiter | null;
  updateRecruiter: (data: Partial<Recruiter>) => void;

  // Job posts
  jobPosts: JobPost[];
  createJobPost: (
    jobPost: Omit<
      JobPost,
      "id" | "recruiterId" | "companyName" | "postedDate" | "isActive"
    >
  ) => void;
  updateJobPost: (jobPost: JobPost) => void;
  deleteJobPost: (id: string) => void;

  // Connections
  connections: Connection[];
  createConnection: (
    applicantId: string,
    recruiterId: string,
    jobPostId: string,
    initiatedBy: "applicant" | "recruiter"
  ) => void;
  updateConnectionStatus: (id: string, status: "accepted" | "rejected") => void;

  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;

  // Messages
  messages: Message[];
  sendMessage: (
    connectionId: string,
    recipientId: string,
    content: string
  ) => void;
  markMessageAsRead: (id: string) => void;

  // Utils
  getJobPostById: (id: string) => JobPost | undefined;
  getConnectionById: (id: string) => Connection | undefined;
  getNotificationById: (id: string) => Notification | undefined;
  getMatchingJobPosts: (applicantId: string) => JobPost[];
  getMatchingApplicants: (jobPostId: string) => Applicant[];
  getConnectionsByUserId: (userId: string) => Connection[];
  getApplicantById: (id: string) => Applicant | null;
  getRecruiterById: (id: string) => Recruiter | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State for applicant and recruiter
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);

  // State for app data
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);
  const [allRecruiters, setAllRecruiters] = useState<Recruiter[]>([]);

  // Load user data based on type
  useEffect(() => {
    if (user) {
      // Load data from localStorage (in a real app this would be API calls)
      const storedJobPosts = localStorage.getItem("jobPosts");
      const storedConnections = localStorage.getItem("connections");
      const storedNotifications = localStorage.getItem("notifications");
      const storedMessages = localStorage.getItem("messages");

      if (storedJobPosts) setJobPosts(JSON.parse(storedJobPosts));
      if (storedConnections) setConnections(JSON.parse(storedConnections));
      if (storedNotifications)
        setNotifications(JSON.parse(storedNotifications));
      if (storedMessages) setMessages(JSON.parse(storedMessages));

      // Load all applicants and recruiters for matching
      loadAllUsers();

      if (user.userType === "applicant") {
        const storedApplicant = localStorage.getItem(`applicant-${user.id}`);
        if (storedApplicant) {
          setApplicant(JSON.parse(storedApplicant));
        } else {
          // Create empty profile if not exists
          const newApplicant: Applicant = {
            id: user.id,
            fullName: "",
            email: user.email,
            education: [],
            skills: [],
            experience: [],
            languages: [],
          };
          setApplicant(newApplicant);
          localStorage.setItem(
            `applicant-${user.id}`,
            JSON.stringify(newApplicant)
          );
        }
      } else {
        const storedRecruiter = localStorage.getItem(`recruiter-${user.id}`);
        if (storedRecruiter) {
          setRecruiter(JSON.parse(storedRecruiter));
        } else {
          // Create empty profile if not exists
          const newRecruiter: Recruiter = {
            id: user.id,
            companyName: "",
            companyInfo: "",
            recruiterName: "",
            email: user.email,
          };
          setRecruiter(newRecruiter);
          localStorage.setItem(
            `recruiter-${user.id}`,
            JSON.stringify(newRecruiter)
          );
        }
      }
    }
  }, [user]);

  // Load all users from localStorage for matching purposes
  const loadAllUsers = () => {
    const storedApplicants: Applicant[] = [];
    const storedRecruiters: Recruiter[] = [];

    // Scan localStorage for all applicant and recruiter profiles
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("applicant-")) {
        const data = localStorage.getItem(key);
        if (data) {
          storedApplicants.push(JSON.parse(data));
        }
      } else if (key?.startsWith("recruiter-")) {
        const data = localStorage.getItem(key);
        if (data) {
          storedRecruiters.push(JSON.parse(data));
        }
      }
    }

    setAllApplicants(storedApplicants);
    setAllRecruiters(storedRecruiters);
  };

  // Applicant methods
  const updateApplicant = async (data: Partial<Applicant>) => {
    if (data) {
      // setApplicant(updatedApplicant);

      const response = await axios.post("http://localhost/api/user/update", {
        fullname: data.fullName,
        email: data.email,
        profilePhoto: data.profilePhoto,
      });

      console.log(response)

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    }
  };

  const addEducation = (education: Omit<Education, "id">) => {
    if (applicant) {
      const newEducation = {
        ...education,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updatedApplicant = {
        ...applicant,
        education: [...applicant.education, newEducation],
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Education added",
        description: "New education entry has been added to your profile",
      });
    }
  };

  const updateEducation = (education: Education) => {
    if (applicant) {
      const updatedApplicant = {
        ...applicant,
        education: applicant.education.map((e) =>
          e.id === education.id ? education : e
        ),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Education updated",
        description: "Education entry has been updated successfully",
      });
    }
  };

  const deleteEducation = (id: string) => {
    if (applicant) {
      const updatedApplicant = {
        ...applicant,
        education: applicant.education.filter((e) => e.id !== id),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Education deleted",
        description: "Education entry has been removed from your profile",
      });
    }
  };

  const addSkill = (skill: Omit<Skill, "id">) => {
    if (applicant) {
      const newSkill = {
        ...skill,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updatedApplicant = {
        ...applicant,
        skills: [...applicant.skills, newSkill],
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Skill added",
        description: `${skill.name} has been added to your skills`,
      });
    }
  };

  const updateSkill = (skill: Skill) => {
    if (applicant) {
      const updatedApplicant = {
        ...applicant,
        skills: applicant.skills.map((s) => (s.id === skill.id ? skill : s)),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Skill updated",
        description: `${skill.name} has been updated successfully`,
      });
    }
  };

  const deleteSkill = (id: string) => {
    if (applicant) {
      const skillName = applicant.skills.find((s) => s.id === id)?.name;
      const updatedApplicant = {
        ...applicant,
        skills: applicant.skills.filter((s) => s.id !== id),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Skill deleted",
        description: `${
          skillName || "Skill"
        } has been removed from your profile`,
      });
    }
  };

  const addExperience = (experience: Omit<Experience, "id">) => {
    if (applicant) {
      const newExperience = {
        ...experience,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updatedApplicant = {
        ...applicant,
        experience: [...applicant.experience, newExperience],
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Experience added",
        description: `Your experience at ${experience.company} has been added`,
      });
    }
  };

  const updateExperience = (experience: Experience) => {
    if (applicant) {
      const updatedApplicant = {
        ...applicant,
        experience: applicant.experience.map((e) =>
          e.id === experience.id ? experience : e
        ),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Experience updated",
        description: `Your experience at ${experience.company} has been updated`,
      });
    }
  };

  const deleteExperience = (id: string) => {
    if (applicant) {
      const expCompany = applicant.experience.find((e) => e.id === id)?.company;
      const updatedApplicant = {
        ...applicant,
        experience: applicant.experience.filter((e) => e.id !== id),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Experience deleted",
        description: `Your experience at ${
          expCompany || "company"
        } has been removed`,
      });
    }
  };

  const addLanguage = (language: Omit<Language, "id">) => {
    if (applicant) {
      const newLanguage = {
        ...language,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updatedApplicant = {
        ...applicant,
        languages: [...applicant.languages, newLanguage],
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Language added",
        description: `${language.name} has been added to your languages`,
      });
    }
  };

  const updateLanguage = (language: Language) => {
    if (applicant) {
      const updatedApplicant = {
        ...applicant,
        languages: applicant.languages.map((l) =>
          l.id === language.id ? language : l
        ),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Language updated",
        description: `${language.name} proficiency has been updated`,
      });
    }
  };

  const deleteLanguage = (id: string) => {
    if (applicant) {
      const langName = applicant.languages.find((l) => l.id === id)?.name;
      const updatedApplicant = {
        ...applicant,
        languages: applicant.languages.filter((l) => l.id !== id),
      };

      setApplicant(updatedApplicant);
      localStorage.setItem(
        `applicant-${applicant.id}`,
        JSON.stringify(updatedApplicant)
      );

      // Update in allApplicants
      setAllApplicants((prev) =>
        prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );

      toast({
        title: "Language deleted",
        description: `${
          langName || "Language"
        } has been removed from your profile`,
      });
    }
  };

  // Recruiter methods
  const updateRecruiter = (data: Partial<Recruiter>) => {
    if (recruiter) {
      const updatedRecruiter = { ...recruiter, ...data };
      setRecruiter(updatedRecruiter);
      localStorage.setItem(
        `recruiter-${recruiter.id}`,
        JSON.stringify(updatedRecruiter)
      );

      // Update in allRecruiters
      setAllRecruiters((prev) =>
        prev.map((r) => (r.id === updatedRecruiter.id ? updatedRecruiter : r))
      );

      // Also update company name in job posts if changed
      if (data.companyName) {
        const updatedJobPosts = jobPosts.map((job) =>
          job.recruiterId === recruiter.id
            ? { ...job, companyName: data.companyName! }
            : job
        );
        setJobPosts(updatedJobPosts);
        localStorage.setItem("jobPosts", JSON.stringify(updatedJobPosts));
      }

      toast({
        title: "Profile updated",
        description: "Your company profile has been updated successfully",
      });
    }
  };

  // Job post methods
  const createJobPost = (
    jobPost: Omit<
      JobPost,
      "id" | "recruiterId" | "companyName" | "postedDate" | "isActive"
    >
  ) => {
    if (recruiter) {
      const newJobPost: JobPost = {
        ...jobPost,
        id: Math.random().toString(36).substring(2, 9),
        recruiterId: recruiter.id,
        companyName: recruiter.companyName,
        postedDate: new Date().toISOString(),
        isActive: true,
      };

      const updatedJobPosts = [...jobPosts, newJobPost];
      setJobPosts(updatedJobPosts);
      localStorage.setItem("jobPosts", JSON.stringify(updatedJobPosts));

      toast({
        title: "Job post created",
        description: `Your job post for ${jobPost.title} has been published`,
      });
    }
  };

  const updateJobPost = (jobPost: JobPost) => {
    const updatedJobPosts = jobPosts.map((job) =>
      job.id === jobPost.id ? jobPost : job
    );

    setJobPosts(updatedJobPosts);
    localStorage.setItem("jobPosts", JSON.stringify(updatedJobPosts));

    toast({
      title: "Job post updated",
      description: `Your job post for ${jobPost.title} has been updated`,
    });
  };

  const deleteJobPost = (id: string) => {
    const jobTitle = jobPosts.find((job) => job.id === id)?.title;
    const updatedJobPosts = jobPosts.filter((job) => job.id !== id);

    setJobPosts(updatedJobPosts);
    localStorage.setItem("jobPosts", JSON.stringify(updatedJobPosts));

    // Also delete related connections and notifications
    const updatedConnections = connections.filter(
      (conn) => conn.jobPostId !== id
    );
    setConnections(updatedConnections);
    localStorage.setItem("connections", JSON.stringify(updatedConnections));

    toast({
      title: "Job post deleted",
      description: `Your job post for ${
        jobTitle || "position"
      } has been removed`,
    });
  };

  // Connection methods
  const createConnection = (
    applicantId: string,
    recruiterId: string,
    jobPostId: string,
    initiatedBy: "applicant" | "recruiter"
  ) => {
    const newConnection: Connection = {
      id: Math.random().toString(36).substring(2, 9),
      applicantId,
      recruiterId,
      jobPostId,
      status: "pending",
      initiatedBy,
      createdAt: new Date().toISOString(),
    };

    const updatedConnections = [...connections, newConnection];
    setConnections(updatedConnections);
    localStorage.setItem("connections", JSON.stringify(updatedConnections));

    // Create notifications for both parties
    const applicant = allApplicants.find((a) => a.id === applicantId);
    const recruiter = allRecruiters.find((r) => r.id === recruiterId);
    const job = jobPosts.find((j) => j.id === jobPostId);

    let notificationForRecipient: Notification;

    if (initiatedBy === "applicant") {
      notificationForRecipient = {
        id: Math.random().toString(36).substring(2, 9),
        userId: recruiterId,
        title: "New Connection Request",
        message: `${
          applicant?.fullName || "An applicant"
        } wants to connect regarding ${job?.title || "a job post"}`,
        type: "connection",
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: newConnection.id,
      };
    } else {
      notificationForRecipient = {
        id: Math.random().toString(36).substring(2, 9),
        userId: applicantId,
        title: "New Connection Request",
        message: `${
          recruiter?.companyName || "A company"
        } wants to connect regarding ${job?.title || "a job post"}`,
        type: "connection",
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: newConnection.id,
      };
    }

    const updatedNotifications = [...notifications, notificationForRecipient];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    toast({
      title: "Connection requested",
      description: "Your connection request has been sent",
    });
  };

  const updateConnectionStatus = (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    const updatedConnections = connections.map((conn) =>
      conn.id === id ? { ...conn, status } : conn
    );

    setConnections(updatedConnections);
    localStorage.setItem("connections", JSON.stringify(updatedConnections));

    // Get connection details for notification
    const connection = connections.find((conn) => conn.id === id);
    if (connection) {
      const job = jobPosts.find((j) => j.id === connection.jobPostId);
      const applicant = allApplicants.find(
        (a) => a.id === connection.applicantId
      );
      const recruiter = allRecruiters.find(
        (r) => r.id === connection.recruiterId
      );

      // Create notification for initiator
      const receiverId =
        connection.initiatedBy === "applicant"
          ? connection.applicantId
          : connection.recruiterId;

      const newNotification: Notification = {
        id: Math.random().toString(36).substring(2, 9),
        userId: receiverId,
        title: `Connection ${status === "accepted" ? "Accepted" : "Rejected"}`,
        message:
          status === "accepted"
            ? `Connection for ${
                job?.title || "job post"
              } has been accepted. You can now message each other.`
            : `Connection for ${job?.title || "job post"} has been rejected.`,
        type: "connection",
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
      };

      const updatedNotifications = [...notifications, newNotification];
      setNotifications(updatedNotifications);
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
    }

    toast({
      title: `Connection ${status}`,
      description: `You have ${status} the connection request`,
    });
  };

  // Notification methods
  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(
      (notif) => notif.id !== id
    );

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  // Message methods
  const sendMessage = (
    connectionId: string,
    recipientId: string,
    content: string
  ) => {
    if (user) {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        connectionId,
        senderId: user.id,
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem("messages", JSON.stringify(updatedMessages));

      // Create notification for recipient
      const connection = connections.find((conn) => conn.id === connectionId);
      let senderName = "";

      if (connection) {
        if (user.userType === "applicant") {
          const applicant = allApplicants.find((a) => a.id === user.id);
          senderName = applicant?.fullName || "An applicant";
        } else {
          const recruiter = allRecruiters.find((r) => r.id === user.id);
          senderName = recruiter?.companyName || "A recruiter";
        }

        const newNotification: Notification = {
          id: Math.random().toString(36).substring(2, 9),
          userId: recipientId,
          title: "New Message",
          message: `${senderName} sent you a message: "${content.substring(
            0,
            30
          )}${content.length > 30 ? "..." : ""}"`,
          type: "message",
          read: false,
          createdAt: new Date().toISOString(),
          relatedId: connectionId,
        };

        const updatedNotifications = [...notifications, newNotification];
        setNotifications(updatedNotifications);
        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );
      }
    }
  };

  const markMessageAsRead = (id: string) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, read: true } : msg
    );

    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  // Utility methods
  const getJobPostById = (id: string) => {
    return jobPosts.find((job) => job.id === id);
  };

  const getConnectionById = (id: string) => {
    return connections.find((conn) => conn.id === id);
  };

  const getNotificationById = (id: string) => {
    return notifications.find((notif) => notif.id === id);
  };

  // Match applicants with job posts based on skills
  const getMatchingJobPosts = (applicantId: string) => {
    const applicant = allApplicants.find((a) => a.id === applicantId);
    if (!applicant) return [];

    // Extract applicant skills for matching
    const applicantSkills = applicant.skills.map((skill) =>
      skill.name.toLowerCase()
    );

    return jobPosts.filter((job) => {
      // Only show active jobs
      if (!job.isActive) return false;

      // Match based on skills (case insensitive)
      const requiredSkills = job.skillsRequired.map((skill) =>
        skill.toLowerCase()
      );
      const matchingSkills = applicantSkills.filter((skill) =>
        requiredSkills.some(
          (reqSkill) => reqSkill.includes(skill) || skill.includes(reqSkill)
        )
      );

      // Consider it a match if at least one skill matches
      return matchingSkills.length > 0;
    });
  };

  // Match job posts with applicants based on skills
  const getMatchingApplicants = (jobPostId: string) => {
    const job = jobPosts.find((j) => j.id === jobPostId);
    if (!job) return [];

    // Extract job required skills for matching
    const requiredSkills = job.skillsRequired.map((skill) =>
      skill.toLowerCase()
    );

    return allApplicants.filter((applicant) => {
      // Extract applicant skills
      const applicantSkills = applicant.skills.map((skill) =>
        skill.name.toLowerCase()
      );

      // Match based on skills (case insensitive)
      const matchingSkills = applicantSkills.filter((skill) =>
        requiredSkills.some(
          (reqSkill) => reqSkill.includes(skill) || skill.includes(reqSkill)
        )
      );

      // Consider it a match if at least one skill matches
      return matchingSkills.length > 0;
    });
  };

  const getConnectionsByUserId = (userId: string) => {
    return connections.filter(
      (conn) =>
        (conn.applicantId === userId || conn.recruiterId === userId) &&
        conn.status === "accepted"
    );
  };

  const getApplicantById = (id: string) => {
    return allApplicants.find((a) => a.id === id) || null;
  };

  const getRecruiterById = (id: string) => {
    return allRecruiters.find((r) => r.id === id) || null;
  };

  return (
    <DataContext.Provider
      value={{
        applicant,
        updateApplicant,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        addExperience,
        updateExperience,
        deleteExperience,
        addLanguage,
        updateLanguage,
        deleteLanguage,

        recruiter,
        updateRecruiter,

        jobPosts,
        createJobPost,
        updateJobPost,
        deleteJobPost,

        connections,
        createConnection,
        updateConnectionStatus,

        notifications,
        markNotificationAsRead,
        deleteNotification,

        messages,
        sendMessage,
        markMessageAsRead,

        getJobPostById,
        getConnectionById,
        getNotificationById,
        getMatchingJobPosts,
        getMatchingApplicants,
        getConnectionsByUserId,
        getApplicantById,
        getRecruiterById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
