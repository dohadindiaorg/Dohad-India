"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    featuredImage: '',
    startDate: '',
    endDate: '',
    location: '',
    registrationLink: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', 'events');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setFormData((prev) => ({ ...prev, featuredImage: data.secure_url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      toast.error('End date cannot be earlier than start date');
      return;
    }

    setIsLoading(true);

    try {
      const payload: Record<string, any> = {
        ...formData,
        eventType: 'conference',
        published: true,
      };

      if (!payload.endDate) {
        delete payload.endDate;
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Event created');
        router.push('/admin/events');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create event');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground p-0 gap-2"
          onClick={() => router.push('/admin/events')}
        >
          <ArrowLeft size={16} />
          Back to Events
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Add Upcoming Event</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create an event with a single date or date range. It appears as a card on your events page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event name*</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Annual DOHaD Conference 2026"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (optional)</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || undefined}
              />
              <p className="text-xs text-muted-foreground">
                For multi-day events (e.g. Oct 10 to 12). Leave blank for single-day.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Bangalore, India (or Online / Hybrid)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Description*</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              rows={3}
              value={formData.shortDescription}
              onChange={handleInputChange}
              required
              placeholder="A short summary shown on the event card..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationLink">Registration link (optional)</Label>
            <Input
              id="registrationLink"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleInputChange}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Leave blank if no online registration.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <Label>Cover image (optional)</Label>
          <div className="relative aspect-video bg-muted rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden">
            {formData.featuredImage ? (
              <>
                <Image src={formData.featuredImage} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '' }))}
                  className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full shadow-lg"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="animate-spin text-secondary" />
                  ) : (
                    <Upload className="text-secondary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">Click to upload</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => router.push('/admin/events')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full bg-secondary hover:bg-secondary/90 px-8"
            disabled={isLoading || isUploading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
}
