export interface PastWinner {
  categoryId: string;
  categoryName: string;
  icon: string;
  winnerName: string;
  winnerDescription: string;
  votePercentage: number;
  highlight: string;
  runnerUps: { name: string; rank: number }[];
}

export interface PastEdition {
  year: number;
  theme: string;
  ceremonyDate: string;
  venue: string;
  totalVotesCast: number;
  participatingGamers: number;
  categoriesCount: number;
  winners: PastWinner[];
}

export const pastEditionsData: PastEdition[] = [
  {
    year: 2024,
    theme: "Leveling Up Ethiopian Gaming Excellence",
    ceremonyDate: "February 2025",
    venue: "Skylight Hotel, Addis Ababa",
    totalVotesCast: 34820,
    participatingGamers: 12450,
    categoriesCount: 8,
    winners: [
      {
        categoryId: "game-for-change",
        categoryName: "Best Game for Change",
        icon: "🌍",
        winnerName: "Heritage Heroes",
        winnerDescription: "Preserving Ethiopian culture and history through interactive storytelling.",
        votePercentage: 48,
        highlight: "Praised for integrating ancient Ethiopian architecture and multilingual narration.",
        runnerUps: [
          { name: "EcoQuest Ethiopia", rank: 2 },
          { name: "Unity Bridge", rank: 3 },
        ],
      },
      {
        categoryId: "game-for-entertainment",
        categoryName: "Best Game for Entertainment",
        icon: "🎮",
        winnerName: "Abyssinia Legends",
        winnerDescription: "Epic RPG adventure set in ancient Ethiopian kingdoms with high replayability.",
        votePercentage: 54,
        highlight: "Surpassed 100k+ downloads and set a benchmark for indie 3D RPGs in East Africa.",
        runnerUps: [
          { name: "Speed Rush Addis", rank: 2 },
          { name: "Puzzle Masters ET", rank: 3 },
        ],
      },
      {
        categoryId: "community-builder",
        categoryName: "Best Community Builder",
        icon: "👥",
        winnerName: "GamersHub Ethiopia",
        winnerDescription: "Building and fostering the largest inclusive gaming network in East Africa.",
        votePercentage: 42,
        highlight: "Hosted 24 community tournaments and onboarded over 5,000 collegiate players.",
        runnerUps: [
          { name: "Addis Esports League", rank: 2 },
          { name: "Gaming Sisters ET", rank: 3 },
        ],
      },
      {
        categoryId: "esports-team",
        categoryName: "Best Esports Team",
        icon: "🏆",
        winnerName: "Team Habesha",
        winnerDescription: "Dominating regional FIFA & mobile esports competitions with exceptional consistency.",
        votePercentage: 59,
        highlight: "Crowned East Africa Regional Champions in 2024 with a record clean sweep.",
        runnerUps: [
          { name: "Addis Legends", rank: 2 },
          { name: "Ethiopian Thunder", rank: 3 },
        ],
      },
      {
        categoryId: "game-streamer",
        categoryName: "Best Game Streamer",
        icon: "📺",
        winnerName: "GameMaster Yonas",
        winnerDescription: "Entertaining thousands with daily high-energy live streams and community matches.",
        votePercentage: 46,
        highlight: "Reached over 50,000 concurrent streaming hours and inspired amateur creators nationwide.",
        runnerUps: [
          { name: "Sara Plays", rank: 2 },
          { name: "ET Gaming Pro", rank: 3 },
        ],
      },
      {
        categoryId: "enabler",
        categoryName: "Best Enabler",
        icon: "⚡",
        winnerName: "Ethio Game Studios",
        winnerDescription: "Supporting independent developers and providing mentorship across Ethiopia.",
        votePercentage: 51,
        highlight: "Incubated 8 student game studios and provided free workstation access.",
        runnerUps: [
          { name: "Gaming Café Network", rank: 2 },
          { name: "Youth Gaming Initiative", rank: 3 },
        ],
      },
      {
        categoryId: "funny-content",
        categoryName: "Best Funny Gaming Content",
        icon: "😂",
        winnerName: "Habesha Fails",
        winnerDescription: "The funniest and most relatable Ethiopian gaming moments compilation.",
        votePercentage: 62,
        highlight: "Viral clip compilation reached over 1.2M views across social platforms.",
        runnerUps: [
          { name: "Comedy Gamer ET", rank: 2 },
          { name: "Laugh & Play", rank: 3 },
        ],
      },
      {
        categoryId: "chewata-awaqi",
        categoryName: "Chewata Awaqi of the Year",
        icon: "👑",
        winnerName: "Legend Dawit",
        winnerDescription: "The undisputed icon and visionary ambassador of Ethiopian gaming culture.",
        votePercentage: 67,
        highlight: "Honored for over a decade of pioneering dedication to elevating local gaming talent.",
        runnerUps: [
          { name: "Queen Meron", rank: 2 },
          { name: "Champion Beki", rank: 3 },
        ],
      },
    ],
  },
];
