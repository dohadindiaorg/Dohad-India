"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    featuredImage: '',
    galleryImages: [] as string[],
    startDate: '',
    endDate: '',
    location: '',
    registrationLink: '',
    eventType: 'conference',
    published: true,
  });

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();

      if (data) {
        if (data.startDate) data.startDate = data.startDate.split('T')[0];
        if (data.endDate) data.endDate = data.endDate.split('T')[0];
        setFormData({
          title: data.title ?? '',
          slug: data.slug ?? '',
          shortDescription: data.shortDescription ?? '',
          featuredImage: data.featuredImage ?? '',
          galleryImages: data.galleryImages ?? [],
          startDate: data.startDate ?? '',
          endDate: data.endDate ?? '',
          location: data.location ?? '',
          registrationLink: data.registrationLink ?? '',
          eventType: data.eventType ?? 'conference',
          published: data.published ?? true,
        });
      }
    } catch {
      toast.error('Failed to fetch event details');
    } finally {
      setIsLoading(false);
    }
  };

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

    setIsSaving(true);

    try {
      const payload: Record<string, any> = { ...formData, published: true };
      if (!payload.endDate) {
        payload.endDate = null;
      }

      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Event updated');
        router.push('/admin/events');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update event');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-foreground">Edit Upcoming Event</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update details for an upcoming event card on your events page.
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
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full bg-secondary hover:bg-secondary/90 px-8"
            disabled={isSaving || isUploading}
          >
            {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
