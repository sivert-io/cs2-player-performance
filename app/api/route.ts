import {
  fetchPlayerProfiles,
  fetchPlayerStats,
  getSteamIDsFromURL,
} from "./fetch";
import { determinePlayerProfile } from "./profile";

import { Stats } from "@/types";

export async function POST(req: Request) {
  const { players } = await req.json();

  const SteamID64s = await getSteamIDsFromURL(players);

  const steam = await fetchPlayerProfiles(SteamID64s);

  // Use an array to store player data
  const playerData = await Promise.all(
    steam.response.players.map(async (steamProfile: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const stats: Stats | undefined = await fetchPlayerStats(
        steamProfile.steamid
      );

      if (stats) {
        const profile = determinePlayerProfile({
          aim: stats.recentGameRatings.aim,
          clutch: stats.recentGameRatings.clutch,
          opening: stats.recentGameRatings.opening,
          positioning: stats.recentGameRatings.positioning,
          utility: stats.recentGameRatings.utility,
          currentRating: Number(stats.games[0].skillLevel),
        });

        return {
          stats,
          profile,
          steam: steamProfile,
        };
      } else {
        return {
          stats,
          profile: { totalScore: 2000, roles: [] },
          steam: steamProfile,
        };
      }
    })
  );

  return new Response(JSON.stringify(playerData), {
    headers: { "Content-Type": "application/json" },
  });
}
