"use client";
import { Player } from "@/types";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Team, createBalancedTeams, getCurrentRating } from "./api/profile";

function StringToNumberRounded(value: string) {
  return Math.round(Number(value));
}

export default function Page() {
  const [textAreaValue, setTextAreaValue] = useState(
    "https://steamcommunity.com/id/Cloudsleep/"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<{ [id: string]: Player }>({});
  const [teams, setTeams] = useState<Team[]>([]);

  function fetchData() {
    setIsLoading(true);

    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players: textAreaValue.replace(",", "").trim().split("\n"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (Object.keys(players).length === 0) return;
    try {
      const arrayPlayers = Object.values(players);
      const newTeams = createBalancedTeams(arrayPlayers);
      console.log(newTeams);
      setTeams(newTeams);
    } catch (error) {
      console.error(error);
    }
  }, [players]);

  return (
    <main className="fixed overflow-auto inset-0 flex flex-col gap-12 items-center justify-start p-12">
      <div className="grid grid-cols-3 gap-4">
        {teams
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((team, i) => {
            return (
              <Card key={team.totalScore + i}>
                <CardHeader className="flex flex-col gap-2">
                  <h1>Team {i + 1}</h1>
                  <div className="flex gap-1">
                    {team.players.map((player) => (
                      <Avatar
                        key={player.stats.meta.steam64Id}
                        src={player.stats.meta.steamAvatarUrl}
                        alt="avatar"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardBody>
                  {team.players.map((player) => (
                    <div key={player.stats.meta.steam64Id}>
                      <p>
                        {player.stats.meta.name}{" "}
                        <span className="text-xs">
                          ({player.totalScore.toLocaleString()})
                        </span>
                      </p>
                    </div>
                  ))}
                </CardBody>
                <CardFooter>
                  <p>Team Score: {team.totalScore.toLocaleString()}</p>
                </CardFooter>
              </Card>
            );
          })}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(players)
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((player, index) => {
            return (
              <a
                className="active:scale-95 transition duration-75"
                target="_blank"
                rel="noreferrer"
                href={`https://steamcommunity.com/profiles/${player.stats.meta.steam64Id}`}
                key={index}
              >
                <Card className="flex gap-4 items-center justify-center">
                  <CardHeader className="flex gap-2">
                    <Avatar
                      src={player.stats.meta.steamAvatarUrl}
                      alt="avatar"
                    />
                    <div className="flex flex-col text-start">
                      <h1>{player.stats.meta.name}</h1>
                      <h2>{player.stats.meta.steam64Id}</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="text-xs">
                    <p>
                      Current Rating:{" "}
                      {Number(getCurrentRating(player)).toLocaleString()}
                    </p>
                    <p>Aim: {Math.round(player.stats.recentGameRatings.aim)}</p>
                    <p>
                      Clutch:{" "}
                      {Math.round(player.stats.recentGameRatings.clutch * 1000)}
                    </p>
                    <p>
                      Opening:{" "}
                      {Math.round(
                        player.stats.recentGameRatings.opening * 1000
                      )}
                    </p>
                    <p>
                      Positioning:{" "}
                      {Math.round(player.stats.recentGameRatings.positioning)}
                    </p>
                    <p>
                      Utility:{" "}
                      {Math.round(player.stats.recentGameRatings.utility)}
                    </p>
                  </CardBody>
                  <CardFooter className="flex flex-col">
                    <p className="font-bold text-lg">
                      Player Score: {player.totalScore.toLocaleString()}
                    </p>
                    <p className="text-xs">Roles: {player.roles.toString()}</p>
                  </CardFooter>
                </Card>
              </a>
            );
          })}
      </div>
      <div className="flex flex-col gap-4">
        <Textarea
          maxRows={32}
          className="w-[512px]"
          disabled={isLoading}
          placeholder="Insert steam-urls here"
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
        />
        <Button isLoading={isLoading} onPress={fetchData}>
          Fetch Player Stats
        </Button>
      </div>
    </main>
  );
}
