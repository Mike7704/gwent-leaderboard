"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { theme, getFactionHeader, getTotalCards, getTotalChallenges } from "@/utils/gameVersion";

export type Player = {
  id: string;
  username: string;
  wins: number;
  draws: number;
  losses: number;
  win_percentage: number;
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
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "wins", desc: true }]);

  const colourTheme = theme[gameVersion] || "#f5c022";

  // Define table columns with dynamic headers based on game version
  const columns: ColumnDef<Player>[] = [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "wins", header: "Wins" },
    { accessorKey: "draws", header: "Draws" },
    { accessorKey: "losses", header: "Losses" },
    { accessorKey: "win_percentage", header: "Win %" },
    { accessorKey: "highest_scored_round", header: "Highest Round" },
    { accessorKey: "challenges_completed", header: `Challenges (${getTotalChallenges(gameVersion)})` },
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className="h-full overflow-auto scrollbar-thin scrollbar-track-gray-800"
      style={{ scrollbarColor: `${colourTheme} #1f2937` }}
    >
      <table className="w-full text-center text-xs table-auto">
        <thead className="text-black font-semibold" style={{ backgroundColor: colourTheme }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-1 py-1 min-w-[115px] cursor-pointer select-none"
                  style={{ borderColor: colourTheme }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && <ArrowUp className="inline w-3 h-3 ml-1" />}
                  {header.column.getIsSorted() === "desc" && <ArrowDown className="inline w-3 h-3 ml-1" />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${colourTheme}33`)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border px-1 py-1 min-w-[115px]"
                  style={{ borderColor: `${colourTheme}BF` }}
                >
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
