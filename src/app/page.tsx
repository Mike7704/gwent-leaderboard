"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LeaderboardTable, { Player } from "@/components/LeaderboardTable";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState("witcher");
  const [timeRange, setTimeRange] = useState("all_time");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch(`/api/players?game=${gameVersion}&range=${timeRange}`);
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
  }, [gameVersion, timeRange]);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/background.jpg)` }}
    >
      <div className="flex flex-col gap-2 px-4 py-2 w-full h-full text-white">
        <div className="flex flex-col md:flex-row items-center justify-start md:self-start gap-2 md:gap-4">
          <Image
            src={`/${gameVersion}_logo.png`}
            alt={`${gameVersion} logo`}
            width={100}
            height={100}
            priority
            className="h-auto w-auto"
          />
          <h1 className="text-xl md:text-2xl font-bold text-yellow-500">Leaderboard</h1>
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            <select
              value={gameVersion}
              onChange={(e) => setGameVersion(e.target.value)}
              className="w-40 p-1 border-2 border-yellow-500 rounded-md bg-black text-yellow-500 text-sm md:text-base font-semibold cursor-pointer focus:outline-none"
            >
              <option value="witcher">Witcher</option>
              <option value="got">Game of Thrones</option>
              <option value="lotr">Lord of the Rings</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40 p-1 border-2 border-yellow-500 rounded-md bg-black text-yellow-500 text-sm md:text-base font-semibold cursor-pointer focus:outline-none"
            >
              <option value="all_time">All Time</option>
              <option value="today">Today</option>
              <option value="past_week">Past Week</option>
              <option value="past_month">Past Month</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-yellow-500 text-center">Loading leaderboard...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {!loading && !error && <LeaderboardTable players={players} gameVersion={gameVersion} />}
      </div>
    </div>
  );
}
