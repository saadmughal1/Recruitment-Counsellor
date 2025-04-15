
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, Users, Building, BadgeCheck, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary">
              <span className="bg-primary text-white px-2 py-1 rounded mr-1">AI</span>
              Recruitment Counsellor
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?tab=register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
            <span className="bg-primary text-white px-3 py-1 rounded mr-2">AI</span>
            Powered Recruitment Matching
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect talent with opportunity using intelligent skill matching and streamlined communication.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" className="text-lg" asChild>
              <Link to="/auth?tab=register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100 max-w-5xl mx-auto">
            <div className="aspect-video relative">
              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-95">
                <div className="bg-primary/10 rounded-lg p-4 flex flex-col justify-center items-center">
                  <h3 className="text-lg font-medium text-primary mb-2">For Applicants</h3>
                  <p className="text-center mb-4">Create your profile and get matched with relevant job opportunities.</p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4 flex flex-col justify-center items-center">
                  <h3 className="text-lg font-medium text-secondary mb-2">For Recruiters</h3>
                  <p className="text-center mb-4">Post jobs and find the perfect candidates based on skills and experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create Your Profile</CardTitle>
                <CardDescription>
                  Build a comprehensive profile showcasing your skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Whether you're an applicant or recruiter, your profile helps our AI make better matches.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Matching</CardTitle>
                <CardDescription>
                  Our intelligent system connects the right talent with the right opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze skills and requirements to create optimal matches.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Connect & Collaborate</CardTitle>
                <CardDescription>
                  Establish connections and communicate directly within the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once matched, recruiters and applicants can connect and communicate seamlessly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your recruitment process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals using AI to optimize their hiring and job search experience.
          </p>
          <Button size="lg" variant="default" className="text-lg bg-primary hover:bg-primary/90" asChild>
            <Link to="/auth?tab=register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                <span className="bg-primary text-white px-2 py-1 rounded mr-1">AI</span>
                Recruitment Counsellor
              </h3>
              <p className="mb-4">
                Connecting talent with opportunity through intelligent matching.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">For Applicants</h3>
              <ul className="space-y-2">
                <li>Build your professional profile</li>
                <li>Get matched with relevant jobs</li>
                <li>Connect with recruiters</li>
                <li>Track your applications</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">For Recruiters</h3>
              <ul className="space-y-2">
                <li>Post job opportunities</li>
                <li>Find qualified candidates</li>
                <li>Direct messaging with applicants</li>
                <li>Manage your talent pipeline</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>© 2025 AI Recruitment Counsellor. All Rights Reserved.</p>
            <p className="text-sm mt-2">This is a demo frontend application. No real data is stored.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
