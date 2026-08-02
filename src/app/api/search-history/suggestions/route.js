import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

    let keywords = [];

    if (q) {
      // Fetch keywords that match the search prefix, sorted by count (most popular first)
      keywords = await prisma.searchHistory.findMany({
        where: {
          keyword: {
            startsWith: q,
          },
        },
        orderBy: { count: "desc" },
        take: 8,
      });
    } else {
      // If no query, return top keywords by count
      keywords = await prisma.searchHistory.findMany({
        orderBy: { count: "desc" },
        take: 8,
      });
    }

    return new Response(JSON.stringify({ keywords }), { status: 200 });
  } catch (error) {
    console.error("[/api/search-history/suggestions] error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch suggestions" }),
      { status: 500 },
    );
  }
}
