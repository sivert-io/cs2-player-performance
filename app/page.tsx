"use client";
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
import toast from "react-hot-toast";

import { Team, createBalancedTeams, getCurrentRating } from "./api/profile";

import { Player } from "@/types";

export default function Page() {
  const [textAreaValue, setTextAreaValue] = useState("Cloudsleep");
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<{ [id: string]: Player }>({});
  const [teams, setTeams] = useState<Team[]>([]);

  function fetchData() {
    setIsLoading(true);

    const steamIds = textAreaValue.replace(",", "").trim().split("\n");

    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players: steamIds,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch player data");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (Object.keys(players).length === 0) return;
    try {
      const arrayPlayers = Object.values(players);
      const newTeams = createBalancedTeams(arrayPlayers);

      setTeams(newTeams);
    } catch (error) {
      console.error(error);
    }
  }, [players]);

  return (
    <main className="fixed overflow-auto inset-0 flex flex-col gap-12 items-center justify-start p-12">
      <div className="grid grid-cols-2 gap-12 w-full max-w-[1200px]">
        {teams
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((team, i) => {
            return (
              <Card key={team.totalScore + i} className="w-full">
                <CardHeader className="flex flex-col gap-2">
                  <h1>Team {i + 1}</h1>
                  <div className="flex gap-4">
                    {team.players.map((player) => (
                      <Avatar
                        key={player.steam.steamid}
                        alt="avatar"
                        src={player.steam.avatarfull}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    {team.players.map((player) => (
                      <div key={player.steam.steamid}>
                        <p>
                          {player.steam.personaname}{" "}
                          <span className="text-xs">
                            ({player.profile.totalScore.toLocaleString()})
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xl font-bold text-right">
                    Team Score: {team.totalScore.toLocaleString()}
                  </p>
                </CardBody>
              </Card>
            );
          })}
      </div>
      <div className="grid grid-cols-3 gap-12">
        {Object.values(players)
          .sort((a, b) => b.profile.totalScore - a.profile.totalScore)
          .map((player, index) => {
            return (
              <a
                key={index}
                className="active:scale-95 transition duration-75"
                href={`https://steamcommunity.com/profiles/${player.steam.steamid}`}
                rel="noreferrer"
                target="_blank"
              >
                <Card className="flex gap-4 items-center justify-center">
                  <CardHeader className="flex gap-2">
                    <Avatar alt="avatar" src={player.steam.avatarfull} />
                    <div className="flex flex-col text-start">
                      <h1>{player.steam.personaname}</h1>
                      <h2>{player.steam.steamid}</h2>
                    </div>
                  </CardHeader>
                  {player.stats && (
                    <CardBody className="text-xs">
                      <p>
                        Current Rating:{" "}
                        {Number(getCurrentRating(player)).toLocaleString()}
                      </p>
                      <p>
                        Aim: {Math.round(player.stats.recentGameRatings.aim)}
                      </p>
                      <p>
                        Clutch:{" "}
                        {Math.round(
                          player.stats.recentGameRatings.clutch * 1000
                        )}
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
                  )}
                  <CardFooter className="flex flex-col">
                    <p className="font-bold text-lg">
                      Player Score: {player.profile.totalScore.toLocaleString()}
                    </p>
                    <p className="text-xs">
                      Roles: {player.profile.roles.join(", ")}
                    </p>
                  </CardFooter>
                </Card>
              </a>
            );
          })}
      </div>
      <div className="flex flex-col gap-4">
        <Textarea
          className="w-[512px]"
          disabled={isLoading}
          maxRows={32}
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
