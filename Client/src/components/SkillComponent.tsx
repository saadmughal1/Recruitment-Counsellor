import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Skill } from "@/types";

function SkillComponent() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true); // NEW
  const [skillForm, setSkillForm] = useState({ name: "" });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const resetForm = () => {
    setSkillForm({ name: "" });
    setEditingSkillId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchSkills = async () => {
    setLoading(true);
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;
    // console.log("skill tok:" + token);
    if (!token) {
      setLoading(false); // No token, stop loading
      return;
    }

    try {
      const res = await axios.get("http://localhost:4000/api/skill/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSkills(res?.data?.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load skills.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;

    if (!skillForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Skill name is required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingSkillId) {
        await axios.put(
          `http://localhost:4000/api/skill/update/${editingSkillId}`,
          skillForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast({ title: "Skill updated", description: "Updated successfully" });
      } else {
        await axios.post("http://localhost:4000/api/skill/add", skillForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({ title: "Skill added", description: "Added successfully" });
      }

      fetchSkills();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save skill.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;

    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/api/skill/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Skill deleted",
        description: "Skill successfully removed.",
      });
      fetchSkills();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (skill: Skill) => {
    setSkillForm({ name: skill.name });
    setEditingSkillId(skill._id || null);
    setDialogOpen(true);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Skills</CardTitle>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) resetForm();
              setDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSkillId ? "Edit Skill" : "Add Skill"}
                </DialogTitle>
                <DialogDescription>
                  {editingSkillId
                    ? "Update your skill information"
                    : "Add a new technical or soft skill"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={skillForm.name}
                    onChange={handleChange}
                    placeholder="JavaScript, Communication, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingSkillId ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Your skills and proficiencies</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet. Add your strengths to your profile.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-primary/10 rounded-full px-3 py-1.5 flex items-center"
              >
                <span className="mr-2">{skill.name}</span>
                <div className="flex ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(skill)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skill._id && handleDelete(skill._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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

export default SkillComponent;
