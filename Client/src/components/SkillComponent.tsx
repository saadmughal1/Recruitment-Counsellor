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
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skill } from "@/types";

function SkillComponent() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [getInputskills, setInputSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillForm, setSkillForm] = useState({ name: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const resetForm = () => {
    setSkillForm({ name: "" });
  };

  const loadInputSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:4000/api/inputskills/get-input-skills"
      );
      setInputSkills(res?.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load input skills.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;
    if (!token) {
      setLoading(false);
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
    loadInputSkills();
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
      await axios.post("http://localhost:4000/api/skill/add", skillForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Skill added", description: "Added successfully" });
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
                <DialogTitle>Add Skill</DialogTitle>
                <DialogDescription>
                  Add a new technical or soft skill
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Skill Name</Label>
                  <Select
                    onValueChange={(value) =>
                      setSkillForm((prev) => ({ ...prev, name: value }))
                    }
                    value={skillForm.name}
                  >
                    <SelectTrigger id="name">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {getInputskills.map((skill) => (
                        <SelectItem key={skill._id} value={skill.name}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Add</Button>
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
