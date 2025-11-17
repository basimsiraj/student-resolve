import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageSquare, Shield, CheckCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/mockData";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect if already logged in
    const user = getCurrentUser();
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Student Complaints</span>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Student Complaint Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A streamlined platform for students to submit complaints and for administrators to manage and resolve them efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Login / Sign Up
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Students</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Submit complaints easily
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Track status in real-time
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                View admin responses
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Manage your submissions
              </li>
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Administrators</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                View all complaints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Update status workflow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Reply to students
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Delete invalid complaints
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-card border rounded-lg p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Join our platform today and experience streamlined complaint management
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Create Your Account
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Student Complaint Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
