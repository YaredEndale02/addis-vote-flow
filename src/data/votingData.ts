export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Nominee {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  categoryId: string;
}

export const categories: Category[] = [
  {
    id: "game-for-change",
    name: "Best Game for Change",
    description: "Games that drive social impact and meaningful change in communities",
    icon: "🌍",
  },
  {
    id: "game-for-entertainment",
    name: "Best Game for Entertainment",
    description: "The most entertaining and engaging gaming experience",
    icon: "🎮",
  },
  {
    id: "community-builder",
    name: "Best Community Builder",
    description: "Outstanding contribution to building and nurturing gaming communities",
    icon: "👥",
  },
  {
    id: "esports-team",
    name: "Best Esports Team",
    description: "The top competitive esports team showcasing excellence",
    icon: "🏆",
  },
  {
    id: "game-streamer",
    name: "Best Game Streamer",
    description: "The most engaging and influential game streamer",
    icon: "📺",
  },
  {
    id: "enabler",
    name: "Best Enabler",
    description: "Outstanding support for the Ethiopian gaming ecosystem",
    icon: "⚡",
  },
  {
    id: "funny-content",
    name: "Best Funny Gaming Content",
    description: "The funniest and most entertaining gaming content creator",
    icon: "😂",
  },
  {
    id: "chewata-awaqi",
    name: "Chewata Awaqi of the Year",
    description: "The ultimate gaming icon of the year",
    icon: "👑",
  },
];

export const nominees: Nominee[] = [
  // Best Game for Change
  { id: "n1", name: "EcoQuest Ethiopia", description: "An educational game promoting environmental awareness", categoryId: "game-for-change" },
  { id: "n2", name: "Heritage Heroes", description: "Preserving Ethiopian culture through interactive storytelling", categoryId: "game-for-change" },
  { id: "n3", name: "Unity Bridge", description: "A multiplayer game fostering cultural understanding", categoryId: "game-for-change" },
  
  // Best Game for Entertainment
  { id: "n4", name: "Abyssinia Legends", description: "Epic RPG adventure set in ancient Ethiopia", categoryId: "game-for-entertainment" },
  { id: "n5", name: "Speed Rush Addis", description: "High-octane racing through Ethiopian streets", categoryId: "game-for-entertainment" },
  { id: "n6", name: "Puzzle Masters ET", description: "Mind-bending puzzles with Ethiopian themes", categoryId: "game-for-entertainment" },
  
  // Best Community Builder
  { id: "n7", name: "GamersHub Ethiopia", description: "Building the largest gaming community in East Africa", categoryId: "community-builder" },
  { id: "n8", name: "Addis Esports League", description: "Organizing competitive tournaments nationwide", categoryId: "community-builder" },
  { id: "n9", name: "Gaming Sisters ET", description: "Empowering women in Ethiopian gaming", categoryId: "community-builder" },
  
  // Best Esports Team
  { id: "n10", name: "Team Habesha", description: "Dominating regional FIFA competitions", categoryId: "esports-team" },
  { id: "n11", name: "Addis Legends", description: "Top performers in mobile esports", categoryId: "esports-team" },
  { id: "n12", name: "Ethiopian Thunder", description: "Rising stars in competitive gaming", categoryId: "esports-team" },
  
  // Best Game Streamer
  { id: "n13", name: "GameMaster Yonas", description: "Entertaining thousands with daily streams", categoryId: "game-streamer" },
  { id: "n14", name: "Sara Plays", description: "Inspiring a new generation of gamers", categoryId: "game-streamer" },
  { id: "n15", name: "ET Gaming Pro", description: "Professional gameplay and tutorials", categoryId: "game-streamer" },
  
  // Best Enabler
  { id: "n16", name: "Ethio Game Studios", description: "Supporting indie developers across Ethiopia", categoryId: "enabler" },
  { id: "n17", name: "Gaming Café Network", description: "Providing accessible gaming spaces nationwide", categoryId: "enabler" },
  { id: "n18", name: "Youth Gaming Initiative", description: "Training the next generation of game developers", categoryId: "enabler" },
  
  // Best Funny Gaming Content
  { id: "n19", name: "Habesha Fails", description: "The funniest gaming moments compilation", categoryId: "funny-content" },
  { id: "n20", name: "Comedy Gamer ET", description: "Making gaming hilarious one video at a time", categoryId: "funny-content" },
  { id: "n21", name: "Laugh & Play", description: "Comedy sketches meet gaming culture", categoryId: "funny-content" },
  
  // Chewata Awaqi of the Year
  { id: "n22", name: "Legend Dawit", description: "Iconic presence in Ethiopian gaming", categoryId: "chewata-awaqi" },
  { id: "n23", name: "Queen Meron", description: "Breaking barriers in competitive gaming", categoryId: "chewata-awaqi" },
  { id: "n24", name: "Champion Beki", description: "Inspiring millions through gaming excellence", categoryId: "chewata-awaqi" },
];
