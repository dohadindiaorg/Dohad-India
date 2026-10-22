"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  RotateCcw,
  ExternalLink,
  Layers,
  FileText,
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
  MembershipTier,
  MembershipPageData,
  DEFAULT_MEMBERSHIP_PAGE,
} from "@/lib/cms-defaults";

export default function MembershipAdminPage() {
  const [data, setData] = useState<MembershipPageData>(DEFAULT_MEMBERSHIP_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings?.membershipPage) {
            const mp = settings.membershipPage;
            setData({
              hero: {
                title: mp.hero?.title || DEFAULT_MEMBERSHIP_PAGE.hero.title,
                description:
                  mp.hero?.description ||
                  DEFAULT_MEMBERSHIP_PAGE.hero.description,
              },
              whoCanJoin: {
                title:
                  mp.whoCanJoin?.title ||
                  DEFAULT_MEMBERSHIP_PAGE.whoCanJoin.title,
                content:
                  mp.whoCanJoin?.content ||
                  DEFAULT_MEMBERSHIP_PAGE.whoCanJoin.content,
              },
              tiers:
                Array.isArray(mp.tiers) && mp.tiers.length > 0
                  ? mp.tiers
                  : DEFAULT_MEMBERSHIP_PAGE.tiers,
              tierNotes: {
                note1:
                  mp.tierNotes?.note1 ||
                  DEFAULT_MEMBERSHIP_PAGE.tierNotes.note1,
                note2:
                  mp.tierNotes?.note2 ||
                  DEFAULT_MEMBERSHIP_PAGE.tierNotes.note2,
              },
              howToJoin: {
                title:
                  mp.howToJoin?.title ||
                  DEFAULT_MEMBERSHIP_PAGE.howToJoin.title,
                description1:
                  mp.howToJoin?.description1 ||
                  DEFAULT_MEMBERSHIP_PAGE.howToJoin.description1,
                description2:
                  mp.howToJoin?.description2 ||
                  DEFAULT_MEMBERSHIP_PAGE.howToJoin.description2,
                buttonText:
                  mp.howToJoin?.buttonText ||
                  DEFAULT_MEMBERSHIP_PAGE.howToJoin.buttonText,
                buttonLink:
                  mp.howToJoin?.buttonLink ||
                  DEFAULT_MEMBERSHIP_PAGE.howToJoin.buttonLink,
              },
            });
          }
        }
      } catch (err) {
        console.error("Failed to load membership settings", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddTier = () => {
    const newTier: MembershipTier = {
      name: "New Membership Tier",
      fee: "₹750",
      period: "Annual Fee",
      order: data.tiers.length,
    };
    setData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, newTier],
    }));
  };

  const handleUpdateTier = (index: number, patch: Partial<MembershipTier>) => {
    setData((prev) => {
      const copy = [...prev.tiers];
      copy[index] = { ...copy[index], ...patch };
      return { ...prev, tiers: copy };
    });
  };

  const handleDeleteTier = (index: number) => {
    if (confirm("Are you sure you want to delete this membership tier?")) {
      setData((prev) => ({
        ...prev,
        tiers: prev.tiers.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMoveTier = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= data.tiers.length) return;
    const copy = [...data.tiers];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setData((prev) => ({ ...prev, tiers: copy }));
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Reset all membership data to the original default values? Click 'Save Changes' afterwards to apply."
      )
    ) {
      setData(DEFAULT_MEMBERSHIP_PAGE);
      toast.info("Membership fields reset to default values.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const normalizedTiers = data.tiers.map((t, idx) => ({
        ...t,
        order: idx,
      }));

      const payload = {
        membershipPage: {
          ...data,
          tiers: normalizedTiers,
        },
      };

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Membership settings updated successfully!");
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Manage Membership Page & Tiers
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Edit membership tier pricing, eligibility rules, and registration links for /join-us.
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

      {/* 1. Membership Tiers & Pricing Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Membership Tiers & Annual Fees
              </CardTitle>
              <CardDescription>
                Configure the pricing tiers displayed prominently on the /join-us page.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTier}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Tier
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {data.tiers.map((tier, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl border bg-muted/10 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={idx === 0}
                    onClick={() => handleMoveTier(idx, "up")}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={idx === data.tiers.length - 1}
                    onClick={() => handleMoveTier(idx, "down")}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <Label className="text-[11px] text-muted-foreground">
                    Tier Name *
                  </Label>
                  <Input
                    value={tier.name}
                    onChange={(e) =>
                      handleUpdateTier(idx, { name: e.target.value })
                    }
                    placeholder="e.g. Undergraduate Students"
                    className="h-9 bg-white"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <Label className="text-[11px] text-muted-foreground">
                    Fee (INR) *
                  </Label>
                  <Input
                    value={tier.fee}
                    onChange={(e) =>
                      handleUpdateTier(idx, { fee: e.target.value })
                    }
                    placeholder="e.g. ₹250"
                    className="h-9 bg-white font-bold"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <Label className="text-[11px] text-muted-foreground">
                    Billing Period
                  </Label>
                  <Input
                    value={tier.period}
                    onChange={(e) =>
                      handleUpdateTier(idx, { period: e.target.value })
                    }
                    placeholder="Annual Fee"
                    className="h-9 bg-white"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTier(idx)}
                  className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0 self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Fee Explanatory Notes */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fee Policy Explanatory Notes
            </h4>
            <div className="space-y-1.5">
              <Label className="text-xs">General Fee Usage Note</Label>
              <Textarea
                value={data.tierNotes.note1}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    tierNotes: { ...prev.tierNotes, note1: e.target.value },
                  }))
                }
                rows={2}
                className="text-xs resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">International LMIC/MIC Rate Note</Label>
              <Textarea
                value={data.tierNotes.note2}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    tierNotes: { ...prev.tierNotes, note2: e.target.value },
                  }))
                }
                rows={2}
                className="text-xs resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Registration CTA Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Registration Call-To-Action Block
          </CardTitle>
          <CardDescription>
            Configure the banner where visitors click to register as members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">CTA Section Title</Label>
            <Input
              value={data.howToJoin.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  howToJoin: { ...prev.howToJoin, title: e.target.value },
                }))
              }
              placeholder="How to Become a Member"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Primary Invitation Text</Label>
            <Textarea
              value={data.howToJoin.description1}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  howToJoin: {
                    ...prev.howToJoin,
                    description1: e.target.value,
                  },
                }))
              }
              rows={2}
              className="resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Secondary Policy Text</Label>
            <Textarea
              value={data.howToJoin.description2}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  howToJoin: {
                    ...prev.howToJoin,
                    description2: e.target.value,
                  },
                }))
              }
              rows={2}
              className="resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Button Label</Label>
              <Input
                value={data.howToJoin.buttonText}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    howToJoin: {
                      ...prev.howToJoin,
                      buttonText: e.target.value,
                    },
                  }))
                }
                placeholder="Go to Registration"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Button Destination URL</Label>
              <Input
                value={data.howToJoin.buttonLink}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    howToJoin: {
                      ...prev.howToJoin,
                      buttonLink: e.target.value,
                    },
                  }))
                }
                placeholder="https://dohadsoc.org/join-us/"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Who Can Join Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Eligibility Section
          </CardTitle>
          <CardDescription>
            The introductory card explaining who is eligible to join DOHaD India.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Section Heading</Label>
            <Input
              value={data.whoCanJoin.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  whoCanJoin: { ...prev.whoCanJoin, title: e.target.value },
                }))
              }
              placeholder="Who Can Become a Member?"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Eligibility Description</Label>
            <Textarea
              value={data.whoCanJoin.content}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  whoCanJoin: { ...prev.whoCanJoin, content: e.target.value },
                }))
              }
              rows={3}
              className="resize-y"
            />
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
