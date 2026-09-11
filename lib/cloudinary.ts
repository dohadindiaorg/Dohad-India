import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: string, folder: string = 'dohad-india') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error');
    throw error;
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error');
    throw error;
  }
}

export function publicIdFromCloudinaryUrl(url: string): string | null {
  if (!url.includes('res.cloudinary.com') && !url.includes('cloudinary.com')) {
    return null;
  }
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function deleteCloudinaryUrls(urls: Array<string | null | undefined>) {
  for (const url of urls) {
    if (!url || typeof url !== 'string') continue;
    const publicId = publicIdFromCloudinaryUrl(url);
    if (!publicId) continue;
    try {
      await deleteImage(publicId);
    } catch {
      console.error('Cloudinary cleanup skipped for an asset');
    }
  }
}

export default cloudinary;
