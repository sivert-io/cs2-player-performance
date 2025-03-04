import { fetchPlayerStats, getSteamIDFromURL } from "./fetch";
import { determinePlayerProfile } from "./profile";

export async function POST(req: Request) {
  const { players } = await req.json();

  // Use an array to store player data
  const playerData = await Promise.all(
    players.map(async (url: string) => {
      const steamID64 = await getSteamIDFromURL(url);
      const stats = await fetchPlayerStats(steamID64);

      // Delay for 1 second (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const profile = determinePlayerProfile({
        aim: stats.recentGameRatings.aim,
        clutch: stats.recentGameRatings.clutch,
        opening: stats.recentGameRatings.opening,
        positioning: stats.recentGameRatings.positioning,
        utility: stats.recentGameRatings.utility,
        currentRating: Number(stats.games[0].skillLevel),
      });

      return { steamID64, stats, profile, url };
    })
  );

  // Convert array into an object
  const response = playerData.reduce((acc, { steamID64, stats, profile }) => {
    acc[steamID64] = {
      stats,
      totalScore: profile.totalScore,
      roles: profile.roles,
    };
    return acc;
  }, {});

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
