
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save } from "lucide-react";

const RecruiterProfile = () => {
  const { recruiter, updateRecruiter } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: recruiter?.companyName || "",
    companyInfo: recruiter?.companyInfo || "",
    recruiterName: recruiter?.recruiterName || "",
    email: recruiter?.email || "",
    profilePhoto: recruiter?.profilePhoto || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = () => {
    updateRecruiter(formData);
    setIsEditing(false);
  };
  
  if (!recruiter) {
    return (
      <MainLayout>
        <div className="text-center py-12">Loading profile...</div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Recruiter Profile</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Company Information</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>
          <CardDescription>Information visible to applicants</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="recruiterName">Recruiter Name</Label>
                  <Input
                    id="recruiterName"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter contact email"
                  type="email"
                />
              </div>
              <div>
                <Label htmlFor="profilePhoto">Company Logo URL</Label>
                <Input
                  id="profilePhoto"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  placeholder="Enter logo URL (optional)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a URL to your company logo (for a real app, you would upload an image)
                </p>
              </div>
              <div>
                <Label htmlFor="companyInfo">Company Information</Label>
                <Textarea
                  id="companyInfo"
                  name="companyInfo"
                  value={formData.companyInfo}
                  onChange={handleChange}
                  placeholder="Describe your company, industry, size, etc."
                  rows={5}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  {formData.profilePhoto ? (
                    <AvatarImage src={formData.profilePhoto} alt={formData.companyName} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {formData.companyName
                        ? formData.companyName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)
                        : "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">{formData.companyName || "Your Company"}</h3>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <p className="text-sm mt-1">Recruiter: {formData.recruiterName || "Not specified"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">About the Company</h3>
                <p className="text-muted-foreground">
                  {formData.companyInfo || "No company information provided yet. Click edit to add information about your company."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Analytics Card - Placeholder for potential future feature */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Analytics</CardTitle>
          <CardDescription>Overview of your recruiting activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary/10 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{recruiter.id ? 0 : 0}</div>
              <p className="text-sm text-muted-foreground">Active Job Posts</p>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{recruiter.id ? 0 : 0}</div>
              <p className="text-sm text-muted-foreground">Connection Requests</p>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{recruiter.id ? 0 : 0}</div>
              <p className="text-sm text-muted-foreground">Applicant Matches</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Complete your company profile to improve applicant matching and visibility.
            </p>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default RecruiterProfile;
