"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileText,
  Save,
  Loader2,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Info,
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
  LegalPagesSettings,
  DEFAULT_LEGAL_PAGES,
  LegalSection,
} from "@/lib/cms-defaults";

export default function LegalPagesAdmin() {
  const [data, setData] = useState<LegalPagesSettings>(DEFAULT_LEGAL_PAGES);
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings?.legalPages) {
            const lp = settings.legalPages;
            setData({
              privacyPolicy: {
                title:
                  lp.privacyPolicy?.title ||
                  DEFAULT_LEGAL_PAGES.privacyPolicy.title,
                lastUpdated:
                  lp.privacyPolicy?.lastUpdated !== undefined
                    ? lp.privacyPolicy.lastUpdated
                    : DEFAULT_LEGAL_PAGES.privacyPolicy.lastUpdated,
                sections:
                  Array.isArray(lp.privacyPolicy?.sections) &&
                  lp.privacyPolicy.sections.length > 0
                    ? lp.privacyPolicy.sections
                    : DEFAULT_LEGAL_PAGES.privacyPolicy.sections,
              },
              termsOfService: {
                title:
                  lp.termsOfService?.title ||
                  DEFAULT_LEGAL_PAGES.termsOfService.title,
                lastUpdated:
                  lp.termsOfService?.lastUpdated !== undefined
                    ? lp.termsOfService.lastUpdated
                    : DEFAULT_LEGAL_PAGES.termsOfService.lastUpdated,
                sections:
                  Array.isArray(lp.termsOfService?.sections) &&
                  lp.termsOfService.sections.length > 0
                    ? lp.termsOfService.sections
                    : DEFAULT_LEGAL_PAGES.termsOfService.sections,
              },
            });
          }
        }
      } catch (err) {
        console.error("Failed to load legal pages settings", err);
        toast.error("Failed to load legal pages data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legalPages: data }),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }

      toast.success("Legal pages updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save legal pages");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetCurrentTab = () => {
    if (activeTab === "privacy") {
      if (
        confirm(
          "Are you sure you want to reset Privacy Policy content to defaults?"
        )
      ) {
        setData((prev) => ({
          ...prev,
          privacyPolicy: DEFAULT_LEGAL_PAGES.privacyPolicy,
        }));
        toast.info("Privacy Policy reset to defaults (click Save to persist)");
      }
    } else {
      if (
        confirm(
          "Are you sure you want to reset Terms & Conditions content to defaults?"
        )
      ) {
        setData((prev) => ({
          ...prev,
          termsOfService: DEFAULT_LEGAL_PAGES.termsOfService,
        }));
        toast.info(
          "Terms & Conditions reset to defaults (click Save to persist)"
        );
      }
    }
  };

  // Section operations for Privacy Policy
  const addPrivacySection = () => {
    const newId = `privacy-sec-${Date.now()}`;
    const newSection: LegalSection = {
      id: newId,
      title: "New Section",
      content: "Enter section content here...",
    };
    setData((prev) => ({
      ...prev,
      privacyPolicy: {
        ...prev.privacyPolicy,
        sections: [...prev.privacyPolicy.sections, newSection],
      },
    }));
  };

  const updatePrivacySection = (
    index: number,
    field: "title" | "content",
    val: string
  ) => {
    setData((prev) => {
      const updated = [...prev.privacyPolicy.sections];
      updated[index] = { ...updated[index], [field]: val };
      return {
        ...prev,
        privacyPolicy: { ...prev.privacyPolicy, sections: updated },
      };
    });
  };

  const deletePrivacySection = (index: number) => {
    setData((prev) => {
      const updated = prev.privacyPolicy.sections.filter((_, i) => i !== index);
      return {
        ...prev,
        privacyPolicy: { ...prev.privacyPolicy, sections: updated },
      };
    });
  };

  const movePrivacySection = (index: number, direction: "up" | "down") => {
    setData((prev) => {
      const sections = [...prev.privacyPolicy.sections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;
      const [removed] = sections.splice(index, 1);
      sections.splice(targetIndex, 0, removed);
      return {
        ...prev,
        privacyPolicy: { ...prev.privacyPolicy, sections },
      };
    });
  };

  // Section operations for Terms of Service
  const addTermsSection = () => {
    const newId = `terms-sec-${Date.now()}`;
    const newSection: LegalSection = {
      id: newId,
      title: "New Section",
      content: "Enter section content here...",
    };
    setData((prev) => ({
      ...prev,
      termsOfService: {
        ...prev.termsOfService,
        sections: [...prev.termsOfService.sections, newSection],
      },
    }));
  };

  const updateTermsSection = (
    index: number,
    field: "title" | "content",
    val: string
  ) => {
    setData((prev) => {
      const updated = [...prev.termsOfService.sections];
      updated[index] = { ...updated[index], [field]: val };
      return {
        ...prev,
        termsOfService: { ...prev.termsOfService, sections: updated },
      };
    });
  };

  const deleteTermsSection = (index: number) => {
    setData((prev) => {
      const updated = prev.termsOfService.sections.filter((_, i) => i !== index);
      return {
        ...prev,
        termsOfService: { ...prev.termsOfService, sections: updated },
      };
    });
  };

  const moveTermsSection = (index: number, direction: "up" | "down") => {
    setData((prev) => {
      const sections = [...prev.termsOfService.sections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;
      const [removed] = sections.splice(index, 1);
      sections.splice(targetIndex, 0, removed);
      return {
        ...prev,
        termsOfService: { ...prev.termsOfService, sections },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Legal Pages Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage policy content, legal sections, and update dates for Privacy
            Policy and Terms & Conditions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Privacy Policy
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Terms & Conditions
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetCurrentTab}
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset Tab
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "privacy"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Privacy Policy
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted">
            {data.privacyPolicy.sections.length} sections
          </span>
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "terms"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Terms & Conditions
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted">
            {data.termsOfService.sections.length} sections
          </span>
        </button>
      </div>

      {/* Formatting Guide Banner */}
      <div className="bg-muted/40 border border-border rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Formatting Tip:</strong> Separate
          paragraphs by a blank line. Lines starting with &quot;- &quot; or
          &quot;* &quot; automatically render as formatted bullet lists. Email
          addresses (e.g., <em>contact@dohadindia.org</em>) and web URLs will be
          automatically detected as clickable links.
        </div>
      </div>

      {/* TAB 1: PRIVACY POLICY */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Header</CardTitle>
              <CardDescription>
                Main document title and last updated date displayed at the top
                of the Privacy Policy page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="privacy-title">Page Title</Label>
                  <Input
                    id="privacy-title"
                    value={data.privacyPolicy.title}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        privacyPolicy: {
                          ...prev.privacyPolicy,
                          title: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacy-lastUpdated">
                    Last Updated Date
                  </Label>
                  <Input
                    id="privacy-lastUpdated"
                    placeholder="e.g., 12 April 2022"
                    value={data.privacyPolicy.lastUpdated || ""}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        privacyPolicy: {
                          ...prev.privacyPolicy,
                          lastUpdated: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Policy Sections</h2>
              <Button size="sm" onClick={addPrivacySection}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Section
              </Button>
            </div>

            {data.privacyPolicy.sections.map((section, idx) => (
              <Card key={section.id || idx} className="relative">
                <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      Section {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate max-w-sm">
                      {section.title || "(Untitled Section)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => movePrivacySection(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => movePrivacySection(idx, "down")}
                      disabled={idx === data.privacyPolicy.sections.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => deletePrivacySection(idx)}
                      disabled={data.privacyPolicy.sections.length <= 1}
                      title="Delete Section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      placeholder="e.g. How we use your data"
                      onChange={(e) =>
                        updatePrivacySection(idx, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Content</Label>
                    <Textarea
                      rows={7}
                      value={section.content}
                      placeholder="Enter paragraphs and bullet points here..."
                      className="font-mono text-sm leading-relaxed"
                      onChange={(e) =>
                        updatePrivacySection(idx, "content", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TERMS & CONDITIONS */}
      {activeTab === "terms" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Header</CardTitle>
              <CardDescription>
                Main document title and last updated date displayed at the top
                of the Terms & Conditions page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="terms-title">Page Title</Label>
                  <Input
                    id="terms-title"
                    value={data.termsOfService.title}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        termsOfService: {
                          ...prev.termsOfService,
                          title: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms-lastUpdated">
                    Last Updated Date (Optional)
                  </Label>
                  <Input
                    id="terms-lastUpdated"
                    placeholder="e.g., Leave empty if not displayed"
                    value={data.termsOfService.lastUpdated || ""}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        termsOfService: {
                          ...prev.termsOfService,
                          lastUpdated: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Terms Sections</h2>
              <Button size="sm" onClick={addTermsSection}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Section
              </Button>
            </div>

            {data.termsOfService.sections.map((section, idx) => (
              <Card key={section.id || idx} className="relative">
                <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      Section {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate max-w-sm">
                      {section.title || "(Untitled Section)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveTermsSection(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveTermsSection(idx, "down")}
                      disabled={idx === data.termsOfService.sections.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteTermsSection(idx)}
                      disabled={data.termsOfService.sections.length <= 1}
                      title="Delete Section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      placeholder="e.g. Welcome to DOHaD India..."
                      onChange={(e) =>
                        updateTermsSection(idx, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Content</Label>
                    <Textarea
                      rows={7}
                      value={section.content}
                      placeholder="Enter paragraphs and bullet points here..."
                      className="font-mono text-sm leading-relaxed"
                      onChange={(e) =>
                        updateTermsSection(idx, "content", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="bg-background/95 backdrop-blur border shadow-lg rounded-full px-4 py-2 flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[130px] rounded-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
