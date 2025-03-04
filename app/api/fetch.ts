import steamIdResolver from "steamid-resolver";

const LeetifyStatsURL =
  "https://api.cs-prod.leetify.com/api/profile/id/" as const;
const LeetifyAvatarUrl =
  "https://api.cs-prod.leetify.com/api/avatar-metadata/" as const;

export async function getSteamIDFromURL(url: string) {
  var steam = "";
  if (url.includes("steamcommunity.com/id/")) {
    steam = await steamIdResolver.customUrlToSteamID64(url);
  } else if (url.includes("steamcommunity.com/profiles/")) {
    steam = url.split("/profiles/")[1];
  } else if (!isNaN(Number(url)) && url.length === 17) {
    steam = url;
  } else {
    steam = await steamIdResolver.customUrlToSteamID64(url);
  }

  return steam;
}

export async function fetchPlayerStats(steamID: string) {
  const response = await fetch(LeetifyStatsURL + steamID);
  const data = await response.json();
  return data;
}
