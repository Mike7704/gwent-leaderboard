"use client";

import React from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getFactionHeader, getTotalCards } from "@/utils/gameVersionFaction";

export type Player = {
  id: string;
  username: string;
  wins: number;
  draws: number;
  losses: number;
  highest_scored_round: number;
  challenges_completed: number;
  total_cards_unlocked: number;
  neutral_cards_unlocked: number;
  special_cards_unlocked: number;
  faction1_cards_unlocked: number;
  faction2_cards_unlocked: number;
  faction3_cards_unlocked: number;
  faction4_cards_unlocked: number;
  faction5_cards_unlocked: number;
};

export default function LeaderboardTable({ players, gameVersion }: { players: Player[]; gameVersion: string }) {
  // Define table columns with dynamic headers based on game version
  const columns: ColumnDef<Player>[] = [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "wins", header: "Wins" },
    { accessorKey: "draws", header: "Draws" },
    { accessorKey: "losses", header: "Losses" },
    { accessorKey: "highest_scored_round", header: "High Score" },
    { accessorKey: "challenges_completed", header: "Challenges Completed" },
    { accessorKey: "total_cards_unlocked", header: `Total Cards (${getTotalCards(gameVersion)})` },
    { accessorKey: "neutral_cards_unlocked", header: getFactionHeader(gameVersion, "neutral") },
    { accessorKey: "special_cards_unlocked", header: getFactionHeader(gameVersion, "special") },
    { accessorKey: "faction1_cards_unlocked", header: getFactionHeader(gameVersion, "faction1") },
    { accessorKey: "faction2_cards_unlocked", header: getFactionHeader(gameVersion, "faction2") },
    { accessorKey: "faction3_cards_unlocked", header: getFactionHeader(gameVersion, "faction3") },
    { accessorKey: "faction4_cards_unlocked", header: getFactionHeader(gameVersion, "faction4") },
    { accessorKey: "faction5_cards_unlocked", header: getFactionHeader(gameVersion, "faction5") },
  ];

  // Initialise the table
  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse border border-gray-300 w-full text-center">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-3 py-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
