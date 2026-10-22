"use client";

import { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  Link as LinkIcon,
  Table as TableIcon,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { FAQItemData, DEFAULT_FAQS } from "@/lib/cms-defaults";

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState<FAQItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
            setFaqs(data.faqs);
          } else {
            setFaqs(DEFAULT_FAQS);
          }
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (err) {
        console.error("Failed to load FAQs", err);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setIsLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const handleAddFaq = () => {
    const newFaq: FAQItemData = {
      question: "New Frequently Asked Question",
      answer: "Provide the detailed answer here.",
      order: faqs.length,
    };
    const updated = [...faqs, newFaq];
    setFaqs(updated);
    setExpandedIndex(updated.length - 1);
  };

  const handleUpdateFaq = (index: number, patch: Partial<FAQItemData>) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const handleDeleteFaq = (index: number) => {
    if (confirm("Are you sure you want to delete this FAQ question?")) {
      const updated = faqs.filter((_, i) => i !== index);
      setFaqs(updated);
      if (expandedIndex === index) {
        setExpandedIndex(null);
      } else if (expandedIndex !== null && expandedIndex > index) {
        setExpandedIndex(expandedIndex - 1);
      }
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;
    const copy = [...faqs];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setFaqs(copy);
    setExpandedIndex(target);
  };

  const handleAddTableRow = (faqIndex: number) => {
    const currentTable = faqs[faqIndex].tableData || [];
    handleUpdateFaq(faqIndex, {
      tableData: [...currentTable, { category: "", fee: "" }],
    });
  };

  const handleUpdateTableRow = (
    faqIndex: number,
    rowIndex: number,
    field: "category" | "fee",
    val: string
  ) => {
    const currentTable = [...(faqs[faqIndex].tableData || [])];
    currentTable[rowIndex] = { ...currentTable[rowIndex], [field]: val };
    handleUpdateFaq(faqIndex, { tableData: currentTable });
  };

  const handleDeleteTableRow = (faqIndex: number, rowIndex: number) => {
    const currentTable = (faqs[faqIndex].tableData || []).filter(
      (_, i) => i !== rowIndex
    );
    handleUpdateFaq(faqIndex, { tableData: currentTable });
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Reset all questions back to the default original FAQs? You will need to click 'Save Changes' to apply."
      )
    ) {
      setFaqs(DEFAULT_FAQS);
      setExpandedIndex(0);
      toast.info("Questions reset to default template.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const normalized = faqs.map((item, idx) => ({
        ...item,
        order: idx,
      }));

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs: normalized }),
      });

      if (res.ok) {
        toast.success("FAQs saved successfully! Website updated.");
      } else {
        toast.error("Failed to save FAQs. Please check your connection.");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Manage Frequently Asked Questions
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, reorder, or update questions that appear on the homepage FAQ accordion.
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

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <Card
              key={index}
              className={`border transition-all duration-200 ${
                isExpanded ? "border-primary shadow-sm" : "border-border hover:border-gray-300"
              }`}
            >
              <CardHeader className="py-3 px-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : index)
                    }
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                      {faq.question || "Untitled Question"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === faqs.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFaq(index)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-5 px-4 sm:px-6 pb-6 pt-2 border-t bg-muted/5">
                  <div className="space-y-1.5">
                    <Label htmlFor={`faq-q-${index}`} className="font-medium text-xs">
                      Question Title *
                    </Label>
                    <Input
                      id={`faq-q-${index}`}
                      value={faq.question}
                      onChange={(e) =>
                        handleUpdateFaq(index, { question: e.target.value })
                      }
                      placeholder="e.g. What is DOHaD India?"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`faq-a-${index}`} className="font-medium text-xs">
                      Answer Text
                    </Label>
                    <Textarea
                      id={`faq-a-${index}`}
                      value={faq.answer || ""}
                      onChange={(e) =>
                        handleUpdateFaq(index, { answer: e.target.value })
                      }
                      rows={3}
                      placeholder="Detailed explanation..."
                      className="bg-white resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-lg border bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-primary" />
                          <Label className="text-xs font-semibold cursor-pointer">
                            Include External Link
                          </Label>
                        </div>
                        <Switch
                          checked={faq.hasLink || false}
                          onCheckedChange={(checked) =>
                            handleUpdateFaq(index, { hasLink: checked })
                          }
                        />
                      </div>

                      {faq.hasLink && (
                        <div className="space-y-2 pt-2 border-t">
                          <div>
                            <Label className="text-[11px] text-muted-foreground">
                              Link Text
                            </Label>
                            <Input
                              value={faq.linkText || ""}
                              onChange={(e) =>
                                handleUpdateFaq(index, {
                                  linkText: e.target.value,
                                })
                              }
                              placeholder="e.g. International DOHaD Society"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-muted-foreground">
                              Destination URL
                            </Label>
                            <Input
                              value={faq.linkUrl || ""}
                              onChange={(e) =>
                                handleUpdateFaq(index, {
                                  linkUrl: e.target.value,
                                })
                              }
                              placeholder="https://..."
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-lg border bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TableIcon className="w-4 h-4 text-primary" />
                          <Label className="text-xs font-semibold cursor-pointer">
                            Include Fee Table
                          </Label>
                        </div>
                        <Switch
                          checked={faq.hasTable || false}
                          onCheckedChange={(checked) =>
                            handleUpdateFaq(index, { hasTable: checked })
                          }
                        />
                      </div>

                      {faq.hasTable && (
                        <div className="space-y-3 pt-2 border-t">
                          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                            {(faq.tableData || []).map((row, rIdx) => (
                              <div
                                key={rIdx}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={row.category}
                                  onChange={(e) =>
                                    handleUpdateTableRow(
                                      index,
                                      rIdx,
                                      "category",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Category (e.g. Regular)"
                                  className="h-8 text-xs flex-1"
                                />
                                <Input
                                  value={row.fee}
                                  onChange={(e) =>
                                    handleUpdateTableRow(
                                      index,
                                      rIdx,
                                      "fee",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Fee (e.g. Rs 1,000)"
                                  className="h-8 text-xs w-28"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteTableRow(index, rIdx)
                                  }
                                  className="h-8 w-8 text-destructive shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTableRow(index)}
                            className="w-full text-xs h-7 gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Table Row
                          </Button>

                          <div>
                            <Label className="text-[11px] text-muted-foreground">
                              Table Footer Note
                            </Label>
                            <Textarea
                              value={faq.tableFooter || ""}
                              onChange={(e) =>
                                handleUpdateFaq(index, {
                                  tableFooter: e.target.value,
                                })
                              }
                              placeholder="Eligibility rules, payment terms..."
                              rows={2}
                              className="text-xs resize-y"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddFaq}
          className="w-full sm:w-auto gap-2 border-dashed border-2 hover:border-primary hover:text-primary"
        >
          <Plus className="w-4 h-4" /> Add Another Question
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-white font-medium"
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
