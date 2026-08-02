export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "A file is required." }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return Response.json(
        { error: "Cloudinary environment variables are missing." },
        { status: 500 },
      );
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      },
    );

    const payload = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      return Response.json(
        {
          error:
            payload?.error?.message ||
            "Cloudinary upload failed. Please try again.",
        },
        { status: 500 },
      );
    }

    return Response.json({
      url: payload.secure_url,
      publicId: payload.public_id,
      resourceType: payload.resource_type,
      width: payload.width,
      height: payload.height,
      format: payload.format,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 },
    );
  }
}
