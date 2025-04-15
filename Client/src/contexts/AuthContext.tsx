
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserType } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we'd validate credentials with a backend
      // For this frontend-only app, we'll just create a user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        userType
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Login successful",
        description: "Welcome back to your dashboard",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        userType
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // Also initialize profile data based on user type
      if (userType === 'applicant') {
        const applicantData = {
          id: newUser.id,
          fullName: "",
          email: email,
          education: [],
          skills: [],
          experience: [],
          languages: [],
        };
        localStorage.setItem("applicant-" + newUser.id, JSON.stringify(applicantData));
      } else {
        const recruiterData = {
          id: newUser.id,
          companyName: "",
          companyInfo: "",
          recruiterName: "",
          email: email,
        };
        localStorage.setItem("recruiter-" + newUser.id, JSON.stringify(recruiterData));
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
