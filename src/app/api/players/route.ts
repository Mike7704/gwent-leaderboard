import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

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
    const game = searchParams.get("game") || "classic";

    const result = await sql`
      SELECT *
      FROM gwent_leaderboard
      WHERE game = ${game}
      ORDER BY wins DESC, challenges_completed DESC, highest_scored_round DESC, username ASC;
    `;

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

// POST: add a new player
export async function POST(req: Request) {
  try {
    const data: Player = await req.json();

    if (!data.username || !data.game) {
      return NextResponse.json({ error: "username and game are required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO gwent_leaderboard (
        game, username, wins, draws, losses, highest_scored_round,
        challenges_completed, total_cards_unlocked, neutral_cards_unlocked, special_cards_unlocked,
        faction1_cards_unlocked, faction2_cards_unlocked, faction3_cards_unlocked,
        faction4_cards_unlocked, faction5_cards_unlocked
      ) VALUES (
        ${data.game}, ${data.username}, ${data.wins || 0}, ${data.draws || 0}, ${data.losses || 0},
        ${data.highest_scored_round || 0}, ${data.challenges_completed || 0}, ${data.total_cards_unlocked || 0},
        ${data.neutral_cards_unlocked || 0}, ${data.special_cards_unlocked || 0}, ${data.faction1_cards_unlocked || 0},
        ${data.faction2_cards_unlocked || 0}, ${data.faction3_cards_unlocked || 0},
        ${data.faction4_cards_unlocked || 0}, ${data.faction5_cards_unlocked || 0}
      )
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }
}

// PUT: update a player by ID
export async function PUT(req: Request) {
  try {
    const data: Player = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE gwent_leaderboard
      SET username = ${data.username},
          wins = ${data.wins || 0},
          draws = ${data.draws || 0},
          losses = ${data.losses || 0},
          highest_scored_round = ${data.highest_scored_round || 0},
          challenges_completed = ${data.challenges_completed || 0},
          total_cards_unlocked = ${data.total_cards_unlocked || 0},
          neutral_cards_unlocked = ${data.neutral_cards_unlocked || 0},
          special_cards_unlocked = ${data.special_cards_unlocked || 0},
          faction1_cards_unlocked = ${data.faction1_cards_unlocked || 0},
          faction2_cards_unlocked = ${data.faction2_cards_unlocked || 0},
          faction3_cards_unlocked = ${data.faction3_cards_unlocked || 0},
          faction4_cards_unlocked = ${data.faction4_cards_unlocked || 0},
          faction5_cards_unlocked = ${data.faction5_cards_unlocked || 0}
      WHERE id = ${data.id}
      RETURNING *;
    `;

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
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
