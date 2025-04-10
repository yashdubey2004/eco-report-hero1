import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { imageBase64 } = req.body;
    // Upload base64 string
    const uploadRes = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${imageBase64}`,
      { folder: "reports" }
    );
    return res.status(200).json({ imageUrl: uploadRes.secure_url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
