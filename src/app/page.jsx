import Card from "@/app/components/card";
import Header from "@/app/components/header";
import ScrollCard from "@/app/components/scrollCard";
import prisma from "@/lib/prisma";
import pg from "pg";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const { Pool } = pg;
let searchPool;
function getSearchPool() {
  if (!searchPool) {
    searchPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return searchPool;
}

const isVisibleListing = (listing) => {
  return (
    Array.isArray(listing.mediaUrls) &&
    listing.mediaUrls.length > 0 &&
    Boolean(listing.title?.trim()) &&
    listing.title !== "Untitled listing" &&
    Boolean(listing.description?.trim()) &&
    Number(listing.price) > 0
  );
};

const pickRandomListings = (listings, count) => {
  const shuffled = [...listings].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

async function searchListings(query) {
  const client = await getSearchPool().connect();
  try {
    const sanitised = query
      .replace(/[&|!<>():*\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const { rows } = await client.query(
      `
      SELECT id, title, description, price, "mediaUrls", university,
             "pickupLocation", "campusRunner", "createdAt"
      FROM "Listings"
      WHERE
        "mediaUrls" IS NOT NULL
        AND array_length("mediaUrls", 1) > 0
        AND title IS NOT NULL AND trim(title) != '' AND title != 'Untitled listing'
        AND description IS NOT NULL AND trim(description) != ''
        AND price > 0
        AND (
          to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
            @@ websearch_to_tsquery('english', $1)
          OR similarity(title, $2) > 0.15
          OR similarity(description, $2) > 0.1
        )
      ORDER BY (
        ts_rank_cd(
          to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')),
          websearch_to_tsquery('english', $1)
        ) * 2
        + GREATEST(similarity(title, $2), similarity(description, $2))
      ) DESC
      LIMIT 40;
      `,
      [sanitised, query],
    );
    return rows;
  } catch (err) {
    console.error("[searchListings] error:", err.message);
    return [];
  } finally {
    client.release();
  }
}

export default async function Page({ searchParams }) {
  const session = await auth()
  const query = (await searchParams)?.q?.trim() ?? "";
  const category = (await searchParams)?.category?.trim() ?? "";
  const university = (await searchParams)?.university?.trim() ?? "";
  const isSearching = query.length > 0;
  const isFilteringByCategory = category.length > 0;
  const isFilteringByUniversity = university.length > 0;

  let gridListings = [];
  let scrollListings = [];

  if (isSearching) {
    // Search mode — results come from the search API (ranked)
    gridListings = await searchListings(query);
  } else {
    // Browse mode — fetch all visible listings ordered by date
    let listings = [];
    try {
      listings = await prisma.listings.findMany({
        where: {
          AND: [
            isFilteringByCategory ? { category } : {},
            isFilteringByUniversity ? { university } : {},
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }

    const visibleListings = listings.filter(isVisibleListing);
    scrollListings =
      visibleListings.length >= 24
        ? pickRandomListings(visibleListings, 10)
        : [];
    const scrollIds = new Set(scrollListings.map((l) => l.id)); 
    gridListings = visibleListings.filter((l) => !scrollIds.has(l.id));
  }

  return (
    <div className="mb-15">
      {!isSearching && (
        <div>
          <Header />
        </div>
      )}

      {/* Search results header */}
      {isSearching && (
        <div className="mb-6 mt-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
            Search results
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {query}
          </h1>
          {gridListings.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {gridListings.length} listing
              {gridListings.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      {gridListings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gridListings.map((listing) => (
            <Card key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-20 text-slate-500">
          {isSearching ? (
            <>
              <p className="text-lg font-semibold text-slate-700">
                No listings found for {query};
              </p>
              <p className="mt-2 text-sm">
                Try different keywords, check your spelling, or <a href="/" className="text-blue-500 hover:underline">
                  browse 
                </a> all listings.
              </p>
            </>
          ) : (
            <p>
              No posted listings yet. Be the first to create{" "}
              <a href="/sell" className="text-blue-500 hover:underline">
                one
              </a>
              !
            </p>
          )}
        </div>
      )}

      {/* Horizontal scroll strip — browse mode only */}
      {!isSearching && scrollListings.length > 0 && (
        <div className="mt-5 mb-5 flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 items-center">
          {scrollListings.map((listing) => (
            <ScrollCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
