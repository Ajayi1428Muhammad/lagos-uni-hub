import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { keyword } = await req.json();

    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return new Response(JSON.stringify({ error: "Invalid keyword" }), {
        status: 400,
      });
    }

    const trimmedKeyword = keyword.trim().toLowerCase();

    // Upsert: if keyword exists, increment count; otherwise create with count 1
    const searchEntry = await prisma.searchHistory.upsert({
      where: { keyword: trimmedKeyword },
      update: { count: { increment: 1 }, updatedAt: new Date() },
      create: { keyword: trimmedKeyword, count: 1 },
    });

    return new Response(JSON.stringify(searchEntry), { status: 200 });
  } catch (error) {
    console.error("[/api/search-history/save] error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save search history" }),
      { status: 500 },
    );
  }
}
