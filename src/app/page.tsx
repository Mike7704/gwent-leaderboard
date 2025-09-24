"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LeaderboardTable, { Player } from "@/components/LeaderboardTable";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState("witcher");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch(`/api/players?game=${gameVersion}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch players: ${res.status}`);
        }
        const data: Player[] = await res.json();
        setPlayers(data);
        setError(null); // clear previous errors
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [gameVersion]);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-w-screen min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(/background.jpg)` }}>
      <div className="px-4 py-2 text-white">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Image
            src={`/${gameVersion}_logo.png`}
            alt={`${gameVersion} logo`}
            width={250}
            height={166}
            priority
            className="h-auto w-48 lg:w-auto"
          />

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h1 className="text-xl lg:text-3xl font-bold text-yellow-500">Leaderboard</h1>
            <select
              value={gameVersion}
              onChange={(e) => setGameVersion(e.target.value)}
              className="p-1 lg:p-2 border-2 border-yellow-500 rounded-md bg-black text-yellow-500 font-semibold cursor-pointer focus:outline-none"
            >
              <option value="witcher">Witcher</option>
              <option value="got">Game of Thrones</option>
              <option value="lotr">Lord of the Rings</option>
            </select>
          </div>
        </div>
        <LeaderboardTable players={players} gameVersion={gameVersion} />
      </div>
    </div>
  );
}
