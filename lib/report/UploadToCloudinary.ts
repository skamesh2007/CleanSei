/**
 * Uploads a base64 data-URI to Cloudinary and returns the secure URL.
 *
 * Required env vars (add to .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   ← unsigned upload preset
 */

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export class CloudinaryUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryUploadError";
  }
}

/**
 * @param dataUri  base64 data-URI (from canvas.toDataURL)
 * @param folder   Cloudinary folder path, e.g. "reports"
 * @returns        Cloudinary secure_url
 */
export async function uploadToCloudinary(
  dataUri: string,
  folder = "reports"
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new CloudinaryUploadError(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
    );
  }

  const body = new FormData();
  body.append("file",           dataUri);
  body.append("upload_preset",  UPLOAD_PRESET);
  body.append("folder",         folder);

  const res = await fetch(UPLOAD_URL, { method: "POST", body });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new CloudinaryUploadError(
      err?.error?.message ?? `Cloudinary upload failed (${res.status})`
    );
  }

  const data = await res.json();
  return data.secure_url as string;
}