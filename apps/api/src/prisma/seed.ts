import { db } from "./db.js";

type Game = {
  name: string;
  logoURL: string;
  active: boolean;
};

const games: Game[] = [
  {
    name: "BigWalk",
    logoURL:
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/Big_Walk-logo-dark-no-alpha.png?utm_source=fr.wikipedia.org&utm_campaign=index&utm_content=original",
    active: true,
  },
];

for (const game of games) {
  await db.orm.public.Game.upsert({
    create: game,
    update: game,
    conflictOn: { id: game.name },
  });
  console.log(`Game ${game.name} seeded successfully`);
}

console.log("Seeding completed");
await db.close();
