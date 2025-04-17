import React from "react";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BasicInformationComponent() {
  const { user } = useAuth();

  const basicInfo = {
    fullName: user?.fullname || "",
    email: user?.email || "",
    profilePhoto: user?.profilePhoto || "",
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Your personal information visible to recruiters
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            {basicInfo.profilePhoto ? (
              <AvatarImage
                className="object-cover w-full h-full"
                src={`http://localhost:4000/uploads/${basicInfo.profilePhoto}`}
                alt={basicInfo.fullName}
              />
            ) : (
              <AvatarFallback className="text-2xl">
                {basicInfo.fullName
                  ? basicInfo.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-xl font-medium">
              {basicInfo.fullName || "Your Name"}
            </h3>
            <p className="text-muted-foreground">{basicInfo.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BasicInformationComponent;
