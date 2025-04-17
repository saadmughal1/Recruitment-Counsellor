import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const Auth: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("applicant");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload a .png, .jpg, or .jpeg image",
          variant: "destructive",
        });
        return;
      }

      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(email, password, userType);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !fullname) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (userType === "applicant" && !profilePhoto) {
      toast({
        title: "Error",
        description: "Please upload a profile photo",
        variant: "destructive",
      });
      return;
    }

    if (userType === "recruiter" && (!companyName || !companyDescription)) {
      toast({
        title: "Error",
        description: "Please fill out company name and description",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", userType);

    if (userType === "applicant" && profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    if (userType === "recruiter") {
      formData.append("companyName", companyName);
      formData.append("companyDescription", companyDescription);
    }

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            <span className="bg-primary text-white px-2 py-1 rounded mr-1">AI</span>
            Recruitment Counsellor
          </h1>
          <p className="text-muted-foreground">
            Connect talent with opportunity through AI-powered matching
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value) => setUserType(value as UserType)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="applicant" id="applicant-login" />
                        <Label htmlFor="applicant-login">Applicant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="recruiter-login" />
                        <Label htmlFor="recruiter-login">Recruiter</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname-register">Fullname</Label>
                    <Input
                      id="fullname-register"
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <Input
                      id="password-register"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value) => setUserType(value as UserType)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="applicant" id="applicant-register" />
                        <Label htmlFor="applicant-register">Applicant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="recruiter-register" />
                        <Label htmlFor="recruiter-register">Recruiter</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {userType === "applicant" && (
                    <div className="space-y-2">
                      <Label htmlFor="profile-photo">Profile Photo</Label>
                      <Input
                        id="profile-photo"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      {preview && (
                        <div className="mt-4">
                          <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-32 h-32 object-cover rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {userType === "recruiter" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-description">Company Description</Label>
                        <Input
                          id="company-description"
                          type="text"
                          value={companyDescription}
                          onChange={(e) => setCompanyDescription(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
