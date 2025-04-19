import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import JobListing from "@/pages/JobListing";
import JobDetail from "@/pages/JobDetail";
import JobForm from "@/pages/JobForm";
import ChatList from "@/pages/ChatList";
import Chat from "@/pages/Chat";
import Notifications from "@/pages/Notifications";

import EducationComponent from "./components/EducationComponent";

import ViewApplicantProfile from "./pages/ViewApplicantProfile";
import ViewCompanyProfile from "./pages/ViewCompanyProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Landing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes (require authentication) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applicant-profile/:id"
                element={
                  <ProtectedRoute>
                    <ViewApplicantProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/company-profile/:id"
                element={
                  <ProtectedRoute>
                    <ViewCompanyProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/new"
                element={
                  <ProtectedRoute requiredUserType="recruiter">
                    <JobForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/start-chat/:id"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat-list"
                element={
                  <ProtectedRoute>
                    <ChatList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {/* Update the index route to redirect to landing page */}
              <Route
                path="/index"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Landing />
                  </ProtectedRoute>
                }
              />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
