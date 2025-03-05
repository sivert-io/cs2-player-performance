const LeetifyStatsURL =
  "https://api.cs-prod.leetify.com/api/profile/id/" as const;

const steamAPI =
  "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002" as const;

const vanityAPI =
  "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001" as const;

export async function getSteamIDsFromURL(urls: string[]) {
  const steam64IDs: string[] = [];
  const IDsToFetch: string[] = [];

  urls.forEach(async (url) => {
    if (url.includes("steamcommunity.com/id/")) {
      IDsToFetch.push(url.split("/id/")[1]);
    } else if (url.includes("steamcommunity.com/profiles/")) {
      steam64IDs.push(url.split("/profiles/")[1]);
    } else if (!isNaN(Number(url)) && url.length === 17) {
      steam64IDs.push(url);
    } else {
      IDsToFetch.push(url);
    }
  });

  // Fetch vanity URLs and wait 1 second between each
  for (let i = 0; i < IDsToFetch.length; i++) {
    const response = await fetch(
      vanityAPI + `?key=${process.env.STEAM_API_KEY}&vanityurl=${IDsToFetch[i]}`
    );

    if (response.status === 200) {
      const data = await response.json();

      steam64IDs.push(data.response.steamid);
    }
  }

  return steam64IDs;
}

export async function fetchPlayerStats(steamID: string) {
  const response = await fetch(LeetifyStatsURL + steamID);

  if (response.status !== 200) {
    return undefined;
  }

  const data = await response.json();

  return data;
}

export async function fetchPlayerProfiles(steamID: string[]) {
  const response = await fetch(
    steamAPI + `?key=${process.env.STEAM_API_KEY}&steamids=${steamID.join(",")}`
  );

  if (response.status !== 200) {
    return undefined;
  }

  const data = await response.json();

  return data;
}
