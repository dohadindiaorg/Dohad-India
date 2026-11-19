"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  Menu,
  Save,
  Loader2,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronDown,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  NavigationSettings,
  DEFAULT_NAVIGATION,
  NavItem,
  NavSubItem,
  FooterLink,
} from "@/lib/cms-defaults";

export default function NavigationAdminPage() {
  const [data, setData] = useState<NavigationSettings>(DEFAULT_NAVIGATION);
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings?.navigation) {
            const nav = settings.navigation;
            setData({
              header: {
                tagline:
                  nav.header?.tagline !== undefined
                    ? nav.header.tagline
                    : DEFAULT_NAVIGATION.header.tagline,
                ctaText:
                  nav.header?.ctaText !== undefined
                    ? nav.header.ctaText
                    : DEFAULT_NAVIGATION.header.ctaText,
                ctaLink:
                  nav.header?.ctaLink !== undefined
                    ? nav.header.ctaLink
                    : DEFAULT_NAVIGATION.header.ctaLink,
                navItems:
                  Array.isArray(nav.header?.navItems) &&
                  nav.header.navItems.length > 0
                    ? nav.header.navItems
                    : DEFAULT_NAVIGATION.header.navItems,
              },
              footer: {
                copyrightText:
                  nav.footer?.copyrightText !== undefined
                    ? nav.footer.copyrightText
                    : DEFAULT_NAVIGATION.footer.copyrightText,
                contactEmail:
                  nav.footer?.contactEmail !== undefined
                    ? nav.footer.contactEmail
                    : DEFAULT_NAVIGATION.footer.contactEmail,
                quickLinks:
                  Array.isArray(nav.footer?.quickLinks) &&
                  nav.footer.quickLinks.length > 0
                    ? nav.footer.quickLinks
                    : DEFAULT_NAVIGATION.footer.quickLinks,
                engagementLinks:
                  Array.isArray(nav.footer?.engagementLinks) &&
                  nav.footer.engagementLinks.length > 0
                    ? nav.footer.engagementLinks
                    : DEFAULT_NAVIGATION.footer.engagementLinks,
              },
            });
          }
        }
      } catch (err) {
        console.error("Failed to load navigation settings", err);
        toast.error("Failed to load navigation data");
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
        body: JSON.stringify({ navigation: data }),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }

      toast.success("Navigation settings updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save navigation settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetCurrentTab = () => {
    if (activeTab === "header") {
      if (
        confirm(
          "Are you sure you want to reset Header navigation to default values?"
        )
      ) {
        setData((prev) => ({
          ...prev,
          header: DEFAULT_NAVIGATION.header,
        }));
        toast.info("Header navigation reset to defaults (click Save to persist)");
      }
    } else {
      if (
        confirm(
          "Are you sure you want to reset Footer navigation to default values?"
        )
      ) {
        setData((prev) => ({
          ...prev,
          footer: DEFAULT_NAVIGATION.footer,
        }));
        toast.info("Footer navigation reset to defaults (click Save to persist)");
      }
    }
  };

  // Header Nav Items Operations
  const addNavItem = () => {
    const newItem: NavItem = {
      name: "New Link",
      href: "/new-link",
    };
    setData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navItems: [...prev.header.navItems, newItem],
      },
    }));
  };

  const updateNavItem = (
    index: number,
    field: "name" | "href",
    val: string
  ) => {
    setData((prev) => {
      const items = [...prev.header.navItems];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, header: { ...prev.header, navItems: items } };
    });
  };

  const deleteNavItem = (index: number) => {
    setData((prev) => {
      const items = prev.header.navItems.filter((_, i) => i !== index);
      return { ...prev, header: { ...prev.header, navItems: items } };
    });
  };

  const moveNavItem = (index: number, direction: "up" | "down") => {
    setData((prev) => {
      const items = [...prev.header.navItems];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const [removed] = items.splice(index, 1);
      items.splice(targetIndex, 0, removed);
      return { ...prev, header: { ...prev.header, navItems: items } };
    });
  };

  // Sub-items operations
  const addSubItem = (itemIndex: number) => {
    setData((prev) => {
      const items = [...prev.header.navItems];
      const currentSub = items[itemIndex].subItems || [];
      const newSub: NavSubItem = {
        name: "New Sub-link",
        href: "/link",
      };
      items[itemIndex] = {
        ...items[itemIndex],
        subItems: [...currentSub, newSub],
      };
      return { ...prev, header: { ...prev.header, navItems: items } };
    });
  };

  const updateSubItem = (
    itemIndex: number,
    subIndex: number,
    field: "name" | "href",
    val: string
  ) => {
    setData((prev) => {
      const items = [...prev.header.navItems];
      const subItems = [...(items[itemIndex].subItems || [])];
      subItems[subIndex] = { ...subItems[subIndex], [field]: val };
      items[itemIndex] = { ...items[itemIndex], subItems };
      return { ...prev, header: { ...prev.header, navItems: items } };
    });
  };

  const deleteSubItem = (itemIndex: number, subIndex: number) => {
    setData((prev) => {
      const items = [...prev.header.navItems];
      const subItems = (items[itemIndex].subItems || []).filter(
        (_, i) => i !== subIndex
      );
      items[itemIndex] = {
        ...items[itemIndex],
        subItems: subItems.length > 0 ? subItems : undefined,
      };
      return { ...prev, header: { ...prev.header, navItems: items } };
    });
  };

  // Footer Quick Links Operations
  const addQuickLink = () => {
    const newLink: FooterLink = { name: "New Quick Link", link: "/" };
    setData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: [...prev.footer.quickLinks, newLink],
      },
    }));
  };

  const updateQuickLink = (
    index: number,
    field: "name" | "link",
    val: string
  ) => {
    setData((prev) => {
      const list = [...prev.footer.quickLinks];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, footer: { ...prev.footer, quickLinks: list } };
    });
  };

  const deleteQuickLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: prev.footer.quickLinks.filter((_, i) => i !== index),
      },
    }));
  };

  // Footer Engagement Links Operations
  const addEngagementLink = () => {
    const newLink: FooterLink = { name: "New Engagement Link", link: "/" };
    setData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        engagementLinks: [...prev.footer.engagementLinks, newLink],
      },
    }));
  };

  const updateEngagementLink = (
    index: number,
    field: "name" | "link",
    val: string
  ) => {
    setData((prev) => {
      const list = [...prev.footer.engagementLinks];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, footer: { ...prev.footer, engagementLinks: list } };
    });
  };

  const deleteEngagementLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        engagementLinks: prev.footer.engagementLinks.filter((_, i) => i !== index),
      },
    }));
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
            <Compass className="h-6 w-6 text-primary" />
            Navigation & Menus Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize header navigation links, dropdown menus, CTA button, and
            footer columns.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View Site
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
          onClick={() => setActiveTab("header")}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "header"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Menu className="h-4 w-4" />
          Header Navigation
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted">
            {data.header.navItems.length} links
          </span>
        </button>
        <button
          onClick={() => setActiveTab("footer")}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "footer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="h-4 w-4" />
          Footer Columns & Info
        </button>
      </div>

      {/* TAB 1: HEADER NAVIGATION */}
      {activeTab === "header" && (
        <div className="space-y-6">
          {/* Header Bar Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Header Bar Settings</CardTitle>
              <CardDescription>
                Tagline next to the logo and primary call-to-action button in the
                top navigation bar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="header-tagline">Header Subtitle / Tagline</Label>
                <Input
                  id="header-tagline"
                  value={data.header.tagline}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      header: { ...prev.header, tagline: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-cta-text">CTA Button Text</Label>
                  <Input
                    id="header-cta-text"
                    value={data.header.ctaText}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        header: { ...prev.header, ctaText: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="header-cta-link">CTA Button Link</Label>
                  <Input
                    id="header-cta-link"
                    value={data.header.ctaLink}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        header: { ...prev.header, ctaLink: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Header Navigation Links</h2>
                <p className="text-xs text-muted-foreground">
                  Manage top-level navigation links and optional dropdown
                  sub-items.
                </p>
              </div>
              <Button size="sm" onClick={addNavItem}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Link
              </Button>
            </div>

            {data.header.navItems.map((item, idx) => (
              <Card key={idx} className="relative">
                <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {item.name || "(Unnamed)"}
                    </span>
                    {item.subItems && item.subItems.length > 0 && (
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                        {item.subItems.length} dropdown items
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveNavItem(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveNavItem(idx, "down")}
                      disabled={idx === data.header.navItems.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteNavItem(idx)}
                      disabled={data.header.navItems.length <= 1}
                      title="Delete Link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Link Label</Label>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateNavItem(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">URL / Path</Label>
                      <Input
                        value={item.href}
                        onChange={(e) =>
                          updateNavItem(idx, "href", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Sub-items (Dropdowns) */}
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <ChevronDown className="h-3.5 w-3.5" />
                        Dropdown Sub-items (Optional)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => addSubItem(idx)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Sub-item
                      </Button>
                    </div>

                    {item.subItems && item.subItems.length > 0 ? (
                      <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                        {item.subItems.map((sub, subIdx) => (
                          <div
                            key={subIdx}
                            className="flex items-center gap-2 bg-muted/40 p-2 rounded-md"
                          >
                            <Input
                              placeholder="Sub-item name"
                              value={sub.name}
                              className="h-8 text-xs"
                              onChange={(e) =>
                                updateSubItem(
                                  idx,
                                  subIdx,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              placeholder="Sub-item URL"
                              value={sub.href}
                              className="h-8 text-xs"
                              onChange={(e) =>
                                updateSubItem(
                                  idx,
                                  subIdx,
                                  "href",
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                              onClick={() => deleteSubItem(idx, subIdx)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic pl-2">
                        No dropdown items. This is a direct top-level link.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FOOTER SETTINGS */}
      {activeTab === "footer" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Footer Meta & Contact</CardTitle>
              <CardDescription>
                General information displayed at the bottom of every page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="footer-contact-email">
                    Primary Contact Email
                  </Label>
                  <Input
                    id="footer-contact-email"
                    value={data.footer.contactEmail || ""}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          contactEmail: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer-copyright">
                    Copyright Suffix Text
                  </Label>
                  <Input
                    id="footer-copyright"
                    value={data.footer.copyrightText || ""}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          copyrightText: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Column */}
          <Card>
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Quick Links Column</CardTitle>
                <CardDescription>
                  Links shown under &quot;Quick Links&quot; in the footer.
                </CardDescription>
              </div>
              <Button size="sm" onClick={addQuickLink}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {data.footer.quickLinks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-lg border border-border"
                >
                  <span className="text-xs text-muted-foreground w-6 text-center shrink-0">
                    #{idx + 1}
                  </span>
                  <Input
                    placeholder="Link Name"
                    value={item.name}
                    className="h-9 text-sm"
                    onChange={(e) =>
                      updateQuickLink(idx, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="URL (e.g. /#faq-section)"
                    value={item.link}
                    className="h-9 text-sm"
                    onChange={(e) =>
                      updateQuickLink(idx, "link", e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => deleteQuickLink(idx)}
                    disabled={data.footer.quickLinks.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Engagement Links Column */}
          <Card>
            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Engagement Column</CardTitle>
                <CardDescription>
                  Links shown under &quot;Engagement&quot; in the footer.
                </CardDescription>
              </div>
              <Button size="sm" onClick={addEngagementLink}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {data.footer.engagementLinks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-lg border border-border"
                >
                  <span className="text-xs text-muted-foreground w-6 text-center shrink-0">
                    #{idx + 1}
                  </span>
                  <Input
                    placeholder="Link Name"
                    value={item.name}
                    className="h-9 text-sm"
                    onChange={(e) =>
                      updateEngagementLink(idx, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="URL (e.g. /join-us)"
                    value={item.link}
                    className="h-9 text-sm"
                    onChange={(e) =>
                      updateEngagementLink(idx, "link", e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => deleteEngagementLink(idx)}
                    disabled={data.footer.engagementLinks.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
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
