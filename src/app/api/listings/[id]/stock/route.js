import prisma from "@/lib/prisma";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    const listing = await prisma.listings.findUnique({
      where: { id },
      select: { stock: true },
    });

    return Response.json({
      stock: listing?.stock ?? 0,
    });
  } catch (error) {
    console.error("Failed to fetch listing stock:", error);
    return Response.json({ stock: 0 }, { status: 500 });
  }
}
