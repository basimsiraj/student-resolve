import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/badge-status";
import { getCurrentUser, getComplaintsByStudent, logoutUser, mockComplaints, getRepliesByComplaint } from "@/lib/mockData";
import { Complaint } from "@/types/complaint";
import { Plus, LogOut, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "student") {
      navigate("/auth");
      return;
    }
    setUser(currentUser);
    setComplaints(getComplaintsByStudent(currentUser.id));
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Create new complaint
    const newComplaint: Complaint = {
      id: `C${String(mockComplaints.length + 1).padStart(3, '0')}`,
      student_id: user!.id,
      student_name: user!.name,
      student_email: user!.email,
      title,
      description,
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockComplaints.push(newComplaint);
    setComplaints(getComplaintsByStudent(user!.id));
    setIsSubmitDialogOpen(false);
    setTitle("");
    setDescription("");

    toast({
      title: "Complaint submitted",
      description: "Your complaint has been submitted successfully",
    });
  };

  const openComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const statusCounts = {
    open: complaints.filter((c) => c.status === "open").length,
    in_progress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.in_progress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Complaint Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Complaints</h2>
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Complaint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New Complaint</DialogTitle>
                <DialogDescription>
                  Describe your issue and we'll get back to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your complaint"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No complaints yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Submit your first complaint to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openComplaintDetails(complaint)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                        {complaint.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        ID: {complaint.id} • Created {format(new Date(complaint.created_at), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Complaint Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedComplaint && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedComplaint.title}</span>
                    <StatusBadge status={selectedComplaint.status} />
                  </DialogTitle>
                  <DialogDescription>
                    Complaint ID: {selectedComplaint.id}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{format(new Date(selectedComplaint.created_at), "PPP")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span>
                      <p className="font-medium">{format(new Date(selectedComplaint.updated_at), "PPP")}</p>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  <div>
                    <h4 className="font-medium mb-3">Admin Responses</h4>
                    {getRepliesByComplaint(selectedComplaint.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No responses yet</p>
                    ) : (
                      <div className="space-y-3">
                        {getRepliesByComplaint(selectedComplaint.id).map((reply) => (
                          <Card key={reply.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium">{reply.admin_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(reply.created_at), "PPP")}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">{reply.message}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default StudentDashboard;
