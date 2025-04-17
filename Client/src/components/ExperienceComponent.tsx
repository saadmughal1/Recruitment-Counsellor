import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { Experience } from "@/types";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading states

function ExperienceComponent() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading of experiences
  const [submitting, setSubmitting] = useState<boolean>(false); // State for form submission loading

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? "" : prev.endDate,
    }));
  };

  const resetForm = () => {
    setForm({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setEditingId(null);
  };

  const loadExperiences = async () => {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

    // console.log("experience tok:" + token);

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/experience/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExperiences(res.data?.data || []);
    } catch (error) {
      console.error("Error loading experiences", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
    const { company, position, location, startDate, endDate, current } = form;

    if (!company || !position || !location || !startDate) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }

    if (!current && !endDate) {
      toast({
        title: "End date or current employment status required",
        description: "Please enter an end date or mark as currently working.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true); // Start submitting
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:4000/api/experience/update/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: "Experience updated" });
      } else {
        await axios.post(`http://localhost:4000/api/experience/add`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({ title: "Experience added" });
      }

      resetForm();
      setDialogOpen(false);
      loadExperiences();
    } catch (err) {
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSubmitting(false); // Stop submitting
    }
  };

  const handleEdit = (exp: Experience) => {
    setForm({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: exp.startDate.slice(0, 10),
      endDate: exp.current ? "" : exp.endDate?.slice(0, 10) || "",
      current: exp.current,
      description: exp.description || "",
    });
    setEditingId(exp._id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      await axios.delete(`http://localhost:4000/api/experience/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Experience deleted" });
      loadExperiences();
    } catch (err) {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Experience</CardTitle>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
              <DialogDescription>
                Add or update your professional experience here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {["company", "position", "location", "startDate", "endDate"].map(
                (field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </Label>
                    <Input
                      type={field.includes("Date") ? "date" : "text"}
                      name={field}
                      value={(form as any)[field]}
                      onChange={handleInputChange}
                      disabled={field === "endDate" && form.current}
                    />
                  </div>
                )
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="current"
                  checked={form.current}
                  onCheckedChange={(val) => handleCheckboxChange(!!val)}
                />
                <Label htmlFor="current">Currently working here</Label>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Your responsibilities..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : editingId ? "Update" : "Add"}{" "}
                Experience
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : experiences.length === 0 ? (
          <p className="text-sm text-gray-500">No experiences added yet.</p>
        ) : ( 
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.company} — {exp.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate.slice(0, 10)} –{" "}
                    {exp.current ? "Present" : exp.endDate?.slice(0, 10)}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm">{exp.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(exp)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(exp._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ExperienceComponent;
