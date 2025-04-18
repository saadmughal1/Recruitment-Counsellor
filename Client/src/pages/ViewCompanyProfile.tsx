import { useEffect, useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import axios from "axios";

const ViewCompanyProfile = () => {
  const { recruiter, updateRecruiter } = useData();
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    fullname: "",
    email: "",
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

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const profile = await axios.get(
        `http://localhost:4000/api/user/profile-recruiter/${id}`
      );

      setFormData(profile.data?.user || []);

      console.log(profile);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Recruiter Profile
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
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
                  Recruiter: {formData.fullname || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">About the Company</h3>
              <p className="text-muted-foreground">
                {formData.companyDescription ||
                  "No company information provided yet. Click edit to add information about your company."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ViewCompanyProfile;
