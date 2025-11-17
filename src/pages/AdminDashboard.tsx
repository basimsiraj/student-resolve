import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/badge-status";
import { getCurrentUser, logoutUser, mockComplaints, mockReplies, getRepliesByComplaint } from "@/lib/mockData";
import { Complaint, ComplaintStatus, ComplaintReply } from "@/types/complaint";
import { LogOut, Eye, Trash2, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/auth");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    const updatedComplaints = mockComplaints.map((c) =>
      c.id === complaintId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
    );
    
    const index = mockComplaints.findIndex((c) => c.id === complaintId);
    if (index !== -1) {
      mockComplaints[index] = updatedComplaints[index];
    }

    setComplaints([...mockComplaints]);
    
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updatedComplaints.find((c) => c.id === complaintId) || null);
    }

    toast({
      title: "Status updated",
      description: `Complaint status changed to ${newStatus.replace('_', ' ')}`,
    });
  };

  const handleDeleteComplaint = (complaintId: string) => {
    const index = mockComplaints.findIndex((c) => c.id === complaintId);
    if (index !== -1) {
      mockComplaints.splice(index, 1);
    }
    
    setComplaints([...mockComplaints]);
    setIsDetailsDialogOpen(false);
    
    toast({
      title: "Complaint deleted",
      description: "The complaint has been removed",
    });
  };

  const handleAddReply = () => {
    if (!replyMessage.trim() || !selectedComplaint) return;

    const newReply: ComplaintReply = {
      id: `R${String(mockReplies.length + 1).padStart(3, '0')}`,
      complaint_id: selectedComplaint.id,
      admin_id: user!.id,
      admin_name: user!.name,
      message: replyMessage,
      created_at: new Date().toISOString(),
    };

    mockReplies.push(newReply);
    
    // Update complaint updated_at
    const complaint = mockComplaints.find((c) => c.id === selectedComplaint.id);
    if (complaint) {
      complaint.updated_at = new Date().toISOString();
      setSelectedComplaint({ ...complaint });
    }

    setReplyMessage("");
    toast({
      title: "Reply added",
      description: "Your response has been sent to the student",
    });
  };

  const openComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsDialogOpen(true);
  };

  const statusCounts = {
    total: complaints.length,
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
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage student complaints</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertCircle className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.open}</div>
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

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>Review and manage student complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{complaint.student_name}</p>
                        <p className="text-xs text-muted-foreground">{complaint.student_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{complaint.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={complaint.status} />
                    </TableCell>
                    <TableCell>{format(new Date(complaint.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openComplaintDetails(complaint)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Complaint Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            {selectedComplaint && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Complaint Details</span>
                    <StatusBadge status={selectedComplaint.status} />
                  </DialogTitle>
                  <DialogDescription>
                    {selectedComplaint.id} • {selectedComplaint.student_name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Complaint Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Title</h4>
                      <p className="text-sm">{selectedComplaint.title}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Student Email:</span>
                        <p className="font-medium">{selectedComplaint.student_email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">{format(new Date(selectedComplaint.created_at), "PPP")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedComplaint.status}
                        onValueChange={(value) => handleStatusChange(selectedComplaint.id, value as ComplaintStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteComplaint(selectedComplaint.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Replies Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Responses</h4>
                    {getRepliesByComplaint(selectedComplaint.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No responses yet</p>
                    ) : (
                      <div className="space-y-2">
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

                  {/* Add Reply */}
                  <div className="space-y-2">
                    <Label htmlFor="reply">Add Response</Label>
                    <Textarea
                      id="reply"
                      placeholder="Type your response to the student..."
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <Button onClick={handleAddReply} disabled={!replyMessage.trim()}>
                      Send Response
                    </Button>
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

export default AdminDashboard;
