"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  ResearchPillarItem,
  ResearchFocusData,
  DEFAULT_RESEARCH_FOCUS,
} from "@/lib/cms-defaults";

const AVAILABLE_ICONS = [
  { value: "Baby", label: "Baby (Adolescent/Maternal)" },
  { value: "Blocks", label: "Blocks (Early Childhood)" },
  { value: "TrendingUp", label: "Trending Up (Lifecourse)" },
  { value: "Dna", label: "DNA (Multiomics / Genetics)" },
  { value: "Apple", label: "Apple (Nutrition / Lifestyle)" },
  { value: "FileText", label: "File / Document (Health Policy)" },
  { value: "Heart", label: "Heart (Cardiovascular)" },
  { value: "Activity", label: "Activity / Pulse" },
  { value: "Microscope", label: "Microscope (Lab Science)" },
  { value: "Stethoscope", label: "Stethoscope (Clinical)" },
  { value: "Globe", label: "Globe (Public Health)" },
  { value: "Users", label: "Users (Community)" },
  { value: "Brain", label: "Brain (Cognitive / Neuro)" },
  { value: "Shield", label: "Shield (Prevention)" },
];

export default function ResearchPillarsAdminPage() {
  const [data, setData] = useState<ResearchFocusData>(DEFAULT_RESEARCH_FOCUS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings?.researchFocus) {
            const rf = settings.researchFocus;
            setData({
              title: rf.title || DEFAULT_RESEARCH_FOCUS.title,
              subtitle: rf.subtitle || DEFAULT_RESEARCH_FOCUS.subtitle,
              pillars:
                Array.isArray(rf.pillars) && rf.pillars.length > 0
                  ? rf.pillars
                  : DEFAULT_RESEARCH_FOCUS.pillars,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load research pillars settings", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddPillar = () => {
    const newPillar: ResearchPillarItem = {
      title: "New Research Focus Area",
      description:
        "Description of this research focus, objectives, and health outcomes studied.",
      icon: "Dna",
      order: data.pillars.length,
    };
    setData((prev) => ({
      ...prev,
      pillars: [...prev.pillars, newPillar],
    }));
  };

  const handleUpdatePillar = (
    index: number,
    patch: Partial<ResearchPillarItem>
  ) => {
    setData((prev) => {
      const copy = [...prev.pillars];
      copy[index] = { ...copy[index], ...patch };
      return { ...prev, pillars: copy };
    });
  };

  const handleDeletePillar = (index: number) => {
    if (confirm("Are you sure you want to delete this research pillar?")) {
      setData((prev) => ({
        ...prev,
        pillars: prev.pillars.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMovePillar = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= data.pillars.length) return;
    const copy = [...data.pillars];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setData((prev) => ({ ...prev, pillars: copy }));
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Reset research pillars to the original default 6 areas? Click 'Save Changes' afterwards to apply."
      )
    ) {
      setData(DEFAULT_RESEARCH_FOCUS);
      toast.info("Research pillars reset to default values.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const normalizedPillars = data.pillars.map((p, idx) => ({
        ...p,
        order: idx,
      }));

      const payload = {
        researchFocus: {
          title: data.title,
          subtitle: data.subtitle,
          pillars: normalizedPillars,
        },
      };

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Research pillars updated successfully! Homepage refreshed.");
      } else {
        toast.error("Failed to save changes. Please try again.");
      }
    } catch (err) {
      console.error("Save error", err);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Manage Research Focus Areas
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the 6 research pillars and bento cards displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Section Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Section Title & Subtitle
          </CardTitle>
          <CardDescription>
            The introductory text displayed above the research focus bento grid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Main Heading</Label>
            <Input
              value={data.title}
              onChange={(e) =>
                setData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Research Focus Areas"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Subtitle / Narrative</Label>
            <Textarea
              value={data.subtitle}
              onChange={(e) =>
                setData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              rows={2}
              className="resize-y"
              placeholder="Our research spans multiple disciplines..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Pillars List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Research Pillars ({data.pillars.length})
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPillar}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Pillar
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.pillars.map((pillar, idx) => (
            <Card key={idx} className="border shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-semibold">Pillar Title *</Label>
                    <Input
                      value={pillar.title}
                      onChange={(e) =>
                        handleUpdatePillar(idx, { title: e.target.value })
                      }
                      placeholder="e.g. Adolescent & Maternal Health"
                      className="h-9 mt-1 font-medium"
                    />
                  </div>

                  <div className="w-44 shrink-0">
                    <Label className="text-xs font-semibold">Icon</Label>
                    <select
                      value={pillar.icon || "Dna"}
                      onChange={(e) =>
                        handleUpdatePillar(idx, { icon: e.target.value })
                      }
                      className="w-full h-9 mt-1 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {AVAILABLE_ICONS.map((iconOption) => (
                        <option key={iconOption.value} value={iconOption.value}>
                          {iconOption.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={idx === 0}
                      onClick={() => handleMovePillar(idx, "up")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={idx === data.pillars.length - 1}
                      onClick={() => handleMovePillar(idx, "down")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePillar(idx)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Description & Objectives
                  </Label>
                  <Textarea
                    value={pillar.description}
                    onChange={(e) =>
                      handleUpdatePillar(idx, { description: e.target.value })
                    }
                    rows={2}
                    className="text-xs resize-y"
                    placeholder="Comprehensive research on..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Save bar */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddPillar}
          className="gap-2 border-dashed border-2 hover:border-primary hover:text-primary"
        >
          <Plus className="w-4 h-4" /> Add Another Pillar
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
