import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
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

  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.companyName || "",
    companyInfo: user?.companyDescription || "",
    recruiterName: user?.fullname || "",
    email: user?.email || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    updateRecruiter(formData);
    setIsEditing(false);
  };

  // if (!recruiter) {
  //   return (
  //     <MainLayout>
  //       <div className="text-center py-12">Loading profile...</div>
  //     </MainLayout>
  //   );
  // }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Recruiter Profile
      </h1>

      <Card className="mb-8">
        <CardHeader>
            <CardTitle>Company Information</CardTitle>
          {/* <div className="flex justify-between items-center">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div> */}
          {/* <CardDescription>Information visible to applicants</CardDescription> */}
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
                  {
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
                  }
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">
                    {formData.companyName || "Your Company"}
                  </h3>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <p className="text-sm mt-1">
                    Recruiter: {formData.recruiterName || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">About the Company</h3>
                <p className="text-muted-foreground">
                  {formData.companyInfo ||
                    "No company information provided yet. Click edit to add information about your company."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    
    </MainLayout>
  );
};

export default RecruiterProfile;
