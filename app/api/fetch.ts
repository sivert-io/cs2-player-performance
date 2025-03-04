import steamIdResolver from "steamid-resolver";

const LeetifyStatsURL =
  "https://api.cs-prod.leetify.com/api/profile/id/" as const;
const LeetifyAvatarUrl =
  "https://api.cs-prod.leetify.com/api/avatar-metadata/" as const;

export async function getSteamIDFromURL(url: string) {
  var steam = "";
  if (url.includes("steamcommunity.com/id/")) {
    steam = await steamIdResolver.customUrlToSteamID64(url);
  } else {
    steam = url.split("/profiles/")[1];
  }

  return steam;
}

export async function fetchPlayerStats(steamID: string) {
  const response = await fetch(LeetifyStatsURL + steamID);
  const data = await response.json();
  return data;
}
