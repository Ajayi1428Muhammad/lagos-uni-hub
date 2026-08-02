import { NextResponse } from "next/server";
import pg from "pg";

const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

// Only return listings that have all required fields
const VISIBILITY_FILTER = `
  "mediaUrls" IS NOT NULL
  AND array_length("mediaUrls", 1) > 0
  AND title IS NOT NULL
  AND trim(title) != ''
  AND title != 'Untitled listing'
  AND description IS NOT NULL
  AND trim(description) != ''
  AND price > 0
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q")?.trim() ?? "";

  if (!raw) {
    return NextResponse.json({ results: [], query: "" });
  }

  const client = await getPool().connect();
  try {
    // Sanitise: strip characters that break tsquery (:, &, |, !, <, >)
    const sanitised = raw.replace(/[&|!<>():*\\]/g, " ").replace(/\s+/g, " ").trim();

    // plainto_tsquery converts free text to a tsquery safely (no special chars needed)
    // We use websearch_to_tsquery which also handles quoted phrases and minus-exclusion
    // ts_rank_cd ranks by cover density (how close matched terms are)
    //
    // The query does two things:
    //   1. Full-text search via tsvector — fast, stemmed (e.g. "run" matches "running")
    //   2. Trigram similarity fallback — catches typos ("lapto" → "laptop")
    //
    // Results are UNIONed and de-duped, then sorted by relevance score DESC.

    const { rows } = await client.query(
      `
      SELECT
        id, title, description, price, "mediaUrls", university,
        "pickupLocation", "campusRunner", "createdAt",
        ts_rank_cd(
          to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')),
          websearch_to_tsquery('english', $1)
        ) AS fts_rank,
        GREATEST(
          similarity(title, $2),
          similarity(description, $2)
        ) AS trgm_rank
      FROM "Listings"
      WHERE (
        ${VISIBILITY_FILTER}
      )
      AND (
        -- Full-text match
        to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
          @@ websearch_to_tsquery('english', $1)
        OR
        -- Trigram fuzzy match on title (catches typos, partial matches)
        similarity(title, $2) > 0.15
        OR
        -- Trigram fuzzy match on description
        similarity(description, $2) > 0.1
      )
      ORDER BY (fts_rank * 2 + trgm_rank) DESC
      LIMIT 40;
      `,
      [sanitised, raw]
    );

    return NextResponse.json({ results: rows, query: raw });
  } catch (err) {
    console.error("[/api/search] error:", err.message);
    return NextResponse.json(
      { error: "Search failed", results: [], query: raw },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
