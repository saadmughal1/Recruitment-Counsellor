import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useData } from "@/contexts/DataContext";
import { Bell, Menu, X, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { applicant, recruiter, notifications } = useData();
  const navigate = useNavigate();

  const userName =
    user?.userType === "applicant"
      ? applicant?.fullName || user?.email
      : recruiter?.companyName || user?.email;

  const userAvatar =
    user?.userType === "applicant"
      ? applicant?.profilePhoto
      : recruiter?.profilePhoto;

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notif) => notif.userId === user?.id && !notif.read
  ).length;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user?.userType === "applicant" && applicant?.fullName) {
      return applicant.fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    } else if (user?.userType === "recruiter" && recruiter?.companyName) {
      return recruiter.companyName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email.substring(0, 2).toUpperCase() || "??";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-primary">
              <span className="bg-primary text-white px-2 py-1 rounded mr-1">
                AI
              </span>
              Recruitment Counsellor
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center pb-4">
                    <span className="font-semibold text-lg">Menu</span>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>

                  <div className="flex flex-col space-y-4 py-4">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      to="/chat-list"
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <span>Chats</span>
                    </Link>
                    <Link
                      to="/notifications"
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  <div className="mt-auto pb-4">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat-list"
                  className="text-gray-700 hover:text-primary"
                >
                  Chats
                </Link>
                <Link
                  to="/notifications"
                  className="text-gray-700 hover:text-primary"
                >
                  <NotificationIndicator count={unreadCount} />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        {userAvatar ? (
                          <AvatarImage
                            src={`http://localhost:4000/uploads/${userAvatar}`}
                            alt={userName || ""}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="cursor-pointer w-full flex"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 AI Recruitment Counsellor. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
