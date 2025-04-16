import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullname: string,
    userType: UserType
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          email: email,
          role: userType,
          password: password,
        }
      );

      const newUser: User = {
        token: response.data.token,
        fullname: response.data.fullname,
        userType: userType,
        email: email,
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

  const register = async (
    email: string,
    password: string,
    fullname: string,
    userType: UserType
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await axios.post("http://localhost:4000/api/user/register", {
        fullname: fullname,
        email: email,
        password: password,
        role: userType,
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Please try again later";

      toast({
        title: "Registration failed",
        description: errorMessage,
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
