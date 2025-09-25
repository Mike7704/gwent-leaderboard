import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { randomUUID } from "crypto";

type Player = {
  id?: string;
  game?: string;
  username?: string;
  wins?: number;
  draws?: number;
  losses?: number;
  highest_scored_round?: number;
  challenges_completed?: number;
  total_cards_unlocked?: number;
  neutral_cards_unlocked?: number;
  special_cards_unlocked?: number;
  faction1_cards_unlocked?: number;
  faction2_cards_unlocked?: number;
  faction3_cards_unlocked?: number;
  faction4_cards_unlocked?: number;
  faction5_cards_unlocked?: number;
};

// GET: fetch all players (from a specific version of the game)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get("game") || "witcher";
    const timeRange = searchParams.get("range") || "all_time";

    let result;
    if (timeRange === "today") {
      result = await sql`
        SELECT *
        FROM gwent_leaderboard
        WHERE game = ${game}
          AND updated_at >= NOW()::date
        ORDER BY wins DESC, win_percentage DESC, highest_scored_round DESC, username ASC
      `;
    } else if (timeRange === "past_week") {
      result = await sql`
        SELECT *
        FROM gwent_leaderboard
        WHERE game = ${game}
          AND updated_at >= NOW() - INTERVAL '7 days'
        ORDER BY wins DESC, win_percentage DESC, highest_scored_round DESC, username ASC
      `;
    } else if (timeRange === "past_month") {
      result = await sql`
        SELECT *
        FROM gwent_leaderboard
        WHERE game = ${game}
          AND updated_at >= NOW() - INTERVAL '30 days'
        ORDER BY wins DESC, win_percentage DESC, highest_scored_round DESC, username ASC
      `;
    } else {
      result = await sql`
        SELECT *
        FROM gwent_leaderboard
        WHERE game = ${game}
        ORDER BY wins DESC, win_percentage DESC, highest_scored_round DESC, username ASC
      `;
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

// PUT: add or update a player
export async function PUT(req: Request) {
  try {
    const data: Player = await req.json();

    if (!data.username || !data.game) {
      return NextResponse.json({ error: "username and game are required" }, { status: 400 });
    }

    const idValue = data.id || randomUUID();

    const result = await sql`
      INSERT INTO gwent_leaderboard (
        id, game, username, wins, draws, losses, highest_scored_round,
        challenges_completed, total_cards_unlocked, neutral_cards_unlocked, special_cards_unlocked,
        faction1_cards_unlocked, faction2_cards_unlocked, faction3_cards_unlocked,
        faction4_cards_unlocked, faction5_cards_unlocked
      ) VALUES (
        ${idValue}, ${data.game}, ${data.username}, ${data.wins || 0}, ${data.draws || 0}, ${data.losses || 0},
        ${data.highest_scored_round || 0}, ${data.challenges_completed || 0}, ${data.total_cards_unlocked || 0},
        ${data.neutral_cards_unlocked || 0}, ${data.special_cards_unlocked || 0}, ${data.faction1_cards_unlocked || 0},
        ${data.faction2_cards_unlocked || 0}, ${data.faction3_cards_unlocked || 0},
        ${data.faction4_cards_unlocked || 0}, ${data.faction5_cards_unlocked || 0}
      )
      ON CONFLICT (id) DO UPDATE SET
        game = EXCLUDED.game,
        username = EXCLUDED.username,
        wins = EXCLUDED.wins,
        draws = EXCLUDED.draws,
        losses = EXCLUDED.losses,
        highest_scored_round = EXCLUDED.highest_scored_round,
        challenges_completed = EXCLUDED.challenges_completed,
        total_cards_unlocked = EXCLUDED.total_cards_unlocked,
        neutral_cards_unlocked = EXCLUDED.neutral_cards_unlocked,
        special_cards_unlocked = EXCLUDED.special_cards_unlocked,
        faction1_cards_unlocked = EXCLUDED.faction1_cards_unlocked,
        faction2_cards_unlocked = EXCLUDED.faction2_cards_unlocked,
        faction3_cards_unlocked = EXCLUDED.faction3_cards_unlocked,
        faction4_cards_unlocked = EXCLUDED.faction4_cards_unlocked,
        faction5_cards_unlocked = EXCLUDED.faction5_cards_unlocked
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to upsert player" }, { status: 500 });
  }
}

// DELETE: delete a player by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM gwent_leaderboard
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
