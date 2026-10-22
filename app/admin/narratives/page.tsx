"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Save,
  Loader2,
  RotateCcw,
  GraduationCap,
  Scale,
  Radio,
  BookOpen,
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
  SpecialNarrativesData,
  DEFAULT_NARRATIVES,
} from "@/lib/cms-defaults";

export default function NarrativesAdminPage() {
  const [data, setData] = useState<SpecialNarrativesData>(DEFAULT_NARRATIVES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings?.narratives) {
            const n = settings.narratives;
            setData({
              capacityBuilding: {
                title:
                  n.capacityBuilding?.title ||
                  DEFAULT_NARRATIVES.capacityBuilding.title,
                subtitle:
                  n.capacityBuilding?.subtitle ||
                  DEFAULT_NARRATIVES.capacityBuilding.subtitle,
                buttonText:
                  n.capacityBuilding?.buttonText ||
                  DEFAULT_NARRATIVES.capacityBuilding.buttonText,
                buttonLink:
                  n.capacityBuilding?.buttonLink ||
                  DEFAULT_NARRATIVES.capacityBuilding.buttonLink,
                items:
                  Array.isArray(n.capacityBuilding?.items) &&
                  n.capacityBuilding.items.length > 0
                    ? n.capacityBuilding.items
                    : DEFAULT_NARRATIVES.capacityBuilding.items,
              },
              advocacy: {
                title:
                  n.advocacy?.title || DEFAULT_NARRATIVES.advocacy.title,
                subtitle:
                  n.advocacy?.subtitle || DEFAULT_NARRATIVES.advocacy.subtitle,
                items:
                  Array.isArray(n.advocacy?.items) &&
                  n.advocacy.items.length > 0
                    ? n.advocacy.items
                    : DEFAULT_NARRATIVES.advocacy.items,
              },
              communication: {
                title:
                  n.communication?.title ||
                  DEFAULT_NARRATIVES.communication.title,
                subtitle:
                  n.communication?.subtitle ||
                  DEFAULT_NARRATIVES.communication.subtitle,
                webinarsTitle:
                  n.communication?.webinarsTitle ||
                  DEFAULT_NARRATIVES.communication.webinarsTitle,
                webinarsDescription:
                  n.communication?.webinarsDescription ||
                  DEFAULT_NARRATIVES.communication.webinarsDescription,
                webinarsBullets:
                  Array.isArray(n.communication?.webinarsBullets) &&
                  n.communication.webinarsBullets.length > 0
                    ? n.communication.webinarsBullets
                    : DEFAULT_NARRATIVES.communication.webinarsBullets,
                followUsTitle:
                  n.communication?.followUsTitle ||
                  DEFAULT_NARRATIVES.communication.followUsTitle,
                followUsDescription:
                  n.communication?.followUsDescription ||
                  DEFAULT_NARRATIVES.communication.followUsDescription,
              },
            });
          }
        }
      } catch (err) {
        console.error("Failed to load narratives", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleResetDefaults = () => {
    if (
      confirm(
        "Reset all narrative sections back to default original content? Click 'Save Changes' afterwards to apply."
      )
    ) {
      setData(DEFAULT_NARRATIVES);
      toast.info("Narrative fields reset to default values.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        narratives: data,
      };

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Homepage narratives updated successfully!");
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Megaphone className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Manage Special Homepage Narratives
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the Capacity Building, National Advocacy, and Communication & Outreach sections.
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

      {/* 1. Capacity Building Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            1. Capacity Building Section
          </CardTitle>
          <CardDescription>
            The training and professional growth section on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Section Heading</Label>
              <Input
                value={data.capacityBuilding.title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    capacityBuilding: {
                      ...prev.capacityBuilding,
                      title: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Button Label</Label>
              <Input
                value={data.capacityBuilding.buttonText}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    capacityBuilding: {
                      ...prev.capacityBuilding,
                      buttonText: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Subtitle</Label>
            <Textarea
              value={data.capacityBuilding.subtitle}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  capacityBuilding: {
                    ...prev.capacityBuilding,
                    subtitle: e.target.value,
                  },
                }))
              }
              rows={2}
              className="resize-y"
            />
          </div>

          <div className="space-y-3 pt-3 border-t">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              Capacity Building Cards (4 items)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.capacityBuilding.items.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border bg-muted/10 space-y-2">
                  <Label className="text-[11px] font-semibold text-foreground">
                    Card #{idx + 1} Title
                  </Label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...data.capacityBuilding.items];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData((prev) => ({
                        ...prev,
                        capacityBuilding: {
                          ...prev.capacityBuilding,
                          items: updated,
                        },
                      }));
                    }}
                    className="h-8 text-xs bg-white"
                  />
                  <Label className="text-[11px] text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...data.capacityBuilding.items];
                      updated[idx] = {
                        ...updated[idx],
                        description: e.target.value,
                      };
                      setData((prev) => ({
                        ...prev,
                        capacityBuilding: {
                          ...prev.capacityBuilding,
                          items: updated,
                        },
                      }));
                    }}
                    rows={2}
                    className="text-xs bg-white resize-y"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Advocacy & National Impact Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            2. Advocacy & National Engagement Section
          </CardTitle>
          <CardDescription>
            The 2×2 policy translation cards on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Heading</Label>
            <Input
              value={data.advocacy.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  advocacy: { ...prev.advocacy, title: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Subtitle</Label>
            <Textarea
              value={data.advocacy.subtitle}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  advocacy: { ...prev.advocacy, subtitle: e.target.value },
                }))
              }
              rows={2}
              className="resize-y"
            />
          </div>

          <div className="space-y-3 pt-3 border-t">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              Advocacy Cards (4 items)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.advocacy.items.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border bg-muted/10 space-y-2">
                  <Label className="text-[11px] font-semibold text-foreground">
                    Card #{idx + 1} Title
                  </Label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...data.advocacy.items];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData((prev) => ({
                        ...prev,
                        advocacy: { ...prev.advocacy, items: updated },
                      }));
                    }}
                    className="h-8 text-xs bg-white"
                  />
                  <Label className="text-[11px] text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...data.advocacy.items];
                      updated[idx] = {
                        ...updated[idx],
                        description: e.target.value,
                      };
                      setData((prev) => ({
                        ...prev,
                        advocacy: { ...prev.advocacy, items: updated },
                      }));
                    }}
                    rows={2}
                    className="text-xs bg-white resize-y"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Communication & Outreach Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" />
            3. Communication & Outreach Section
          </CardTitle>
          <CardDescription>
            The Webinars and Follow Us dual cards on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Heading</Label>
            <Input
              value={data.communication.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  communication: {
                    ...prev.communication,
                    title: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Subtitle</Label>
            <Textarea
              value={data.communication.subtitle}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  communication: {
                    ...prev.communication,
                    subtitle: e.target.value,
                  },
                }))
              }
              rows={2}
              className="resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t">
            {/* Webinars Card */}
            <div className="p-4 rounded-xl border bg-muted/10 space-y-2">
              <Label className="text-xs font-semibold">Webinars Card Title</Label>
              <Input
                value={data.communication.webinarsTitle}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    communication: {
                      ...prev.communication,
                      webinarsTitle: e.target.value,
                    },
                  }))
                }
                className="h-8 text-xs bg-white"
              />
              <Label className="text-[11px] text-muted-foreground">
                Description
              </Label>
              <Textarea
                value={data.communication.webinarsDescription}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    communication: {
                      ...prev.communication,
                      webinarsDescription: e.target.value,
                    },
                  }))
                }
                rows={2}
                className="text-xs bg-white resize-y"
              />
            </div>

            {/* Follow Us Card */}
            <div className="p-4 rounded-xl border bg-muted/10 space-y-2">
              <Label className="text-xs font-semibold">Follow Us Card Title</Label>
              <Input
                value={data.communication.followUsTitle}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    communication: {
                      ...prev.communication,
                      followUsTitle: e.target.value,
                    },
                  }))
                }
                className="h-8 text-xs bg-white"
              />
              <Label className="text-[11px] text-muted-foreground">
                Description
              </Label>
              <Textarea
                value={data.communication.followUsDescription}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    communication: {
                      ...prev.communication,
                      followUsDescription: e.target.value,
                    },
                  }))
                }
                rows={2}
                className="text-xs bg-white resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save bar */}
      <div className="flex justify-end pt-4 border-t">
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
