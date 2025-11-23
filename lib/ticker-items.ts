// News ticker item generation for farm atmosphere

import { CROP_DATA, LIVESTOCK_DATA, SEASON_EFFECTS } from './constants';

// Local news items
const LOCAL_NEWS = [
  '📰 County fair scheduled for next month',
  '📰 Harvest festival dates announced',
  '📰 New general store opening in town',
  '📰 Town hall meeting this Thursday',
  '📰 Local farmers market expanding hours',
  '📰 Community barn raising this weekend',
  '📰 4-H club hosting bake sale',
  '📰 Annual pie contest accepting entries',
  '📰 Town celebrating 150th anniversary',
  '📰 New irrigation system approved by council',
  '📰 Library hosting seed swap event',
  '📰 Veterinary clinic opens satellite office',
  '📰 Local dairy wins state award',
  '📰 Farm equipment auction this Saturday',
  '📰 County extension office offers free workshops',
  '📰 Historical society preserving old barn',
  '📰 School fieldtrip visits working farms',
  '📰 Grange hall hosting potluck dinner',
  '📰 Rodeo coming to fairgrounds',
  '📰 Community garden plots available',
];

// Weather-related messages by season
const WEATHER_MESSAGES = {
  SPRING: [
    '🌤️ Spring showers expected this week',
    '🌤️ Perfect planting weather ahead',
    '🌤️ Mild temperatures forecasted',
    '🌤️ Sunny skies continue',
    '🌤️ Light frost warning for tonight',
    '🌤️ Rain chances increasing',
    '🌤️ Warming trend this week',
  ],
  SUMMER: [
    '☀️ Hot and dry conditions continue',
    '☀️ Heatwave warning in effect',
    '☀️ Afternoon thunderstorms possible',
    '☀️ Perfect weather for harvesting',
    '☀️ Drought conditions developing',
    '☀️ Sunny and warm all week',
    '☀️ High pressure system settled in',
  ],
  FALL: [
    '🍂 Cooler temperatures arriving',
    '🍂 First frost expected soon',
    '🍂 Harvest weather looking ideal',
    '🍂 Windy conditions this afternoon',
    '🍂 Extended dry spell continues',
    '🍂 Crisp autumn air settles in',
    '🍂 Morning fog expected',
  ],
  WINTER: [
    '❄️ Snow flurries possible tonight',
    '❄️ Cold snap continues',
    '❄️ Freezing temperatures persist',
    '❄️ Light snow accumulation expected',
    '❄️ Windchill advisory in effect',
    '❄️ Clear and cold this week',
    '❄️ Ice warning for roads',
  ],
};

// Farm gossip and local happenings
const FARM_GOSSIP = [
  '🗣️ Johnson farm reports prize-winning pumpkin',
  '🗣️ Miller\'s chickens laying double yolks',
  '🗣️ Thompson family welcomes new calf',
  '🗣️ Mayor spotted shopping at feed store',
  '🗣️ Henderson\'s corn maze opens this weekend',
  '🗣️ Old MacDonald retiring after 50 years',
  '🗣️ Smith farm installing solar panels',
  '🗣️ Anderson\'s cow Bessie turns 15',
  '🗣️ Local boy scouts helping with harvest',
  '🗣️ Rodriguez farm hosting barn dance',
  '🗣️ Wilson family expanding orchard',
  '🗣️ Greene\'s tractors seen working late',
  '🗣️ Parker\'s sheep win county ribbon',
  '🗣️ Davis family adopting rescue horses',
  '🗣️ Martinez farm adds beehives',
  '🗣️ Carter\'s produce stand opens early',
  '🗣️ Foster farm celebrates 100 years',
  '🗣️ Brooks family starts farmers market',
  '🗣️ Morgan\'s roosters waking neighbors',
  '🗣️ Taylor farm experimenting with new crops',
];

// Seasonal farming tips
const SEASONAL_TIPS = {
  SPRING: [
    '💡 Perfect time to plant strawberries',
    '💡 Start your seedlings indoors now',
    '💡 Prepare soil for summer crops',
    '💡 Check irrigation systems before season',
    '💡 Time to prune fruit trees',
    '💡 Plant early spring vegetables',
  ],
  SUMMER: [
    '💡 Water crops early morning for best results',
    '💡 Watch for pest activity in hot weather',
    '💡 Mulch to retain soil moisture',
    '💡 Harvest regularly for best yields',
    '💡 Provide shade for livestock',
    '💡 Check plants daily in heat',
  ],
  FALL: [
    '💡 Harvest before first frost',
    '💡 Plant winter cover crops',
    '💡 Prepare equipment for storage',
    '💡 Stock up on winter feed',
    '💡 Time to plant garlic',
    '💡 Clean and organize barn for winter',
  ],
  WINTER: [
    '💡 Check livestock water doesn\'t freeze',
    '💡 Plan next season\'s garden layout',
    '💡 Maintain equipment during downtime',
    '💡 Review seed catalogs',
    '💡 Ensure animals have warm shelter',
    '💡 Order seeds for spring planting',
  ],
};

// Fun farm facts
const FUN_FACTS = [
  '🐔 Fun fact: Chickens can recognize over 100 faces',
  '🐄 Fun fact: Cows have best friends',
  '🐑 Fun fact: Sheep have excellent memories',
  '🐷 Fun fact: Pigs are smarter than dogs',
  '🐐 Fun fact: Goats have rectangular pupils',
  '🌾 Fun fact: Wheat has been cultivated for 10,000 years',
  '🥕 Fun fact: Carrots were originally purple',
  '🍅 Fun fact: Tomatoes are technically berries',
  '🥔 Fun fact: Potatoes were first domesticated in Peru',
  '🌽 Fun fact: One corn plant produces 600-1000 kernels',
  '🐝 Fun fact: Bees visit 5,000 flowers per day',
  '🌻 Fun fact: Sunflowers track the sun',
  '🥚 Fun fact: Hens don\'t need roosters to lay eggs',
  '🐓 Fun fact: Roosters crow at dawn due to circadian rhythm',
  '🌱 Fun fact: Plants can communicate through roots',
];

/**
 * Generate dynamic market price messages
 */
function generateMarketPrices(): string[] {
  const messages: string[] = [];

  // Random crop prices (with slight variation)
  const crops = Object.keys(CROP_DATA) as Array<keyof typeof CROP_DATA>;
  const randomCrop = crops[Math.floor(Math.random() * crops.length)];
  const cropData = CROP_DATA[randomCrop];
  const priceVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5

  if (priceVariation >= 0) {
    messages.push(`💰 ${cropData.name} prices up ${Math.abs(priceVariation)}% this week`);
  } else {
    messages.push(`💰 ${cropData.name} prices down ${Math.abs(priceVariation)}% this week`);
  }

  // Livestock market
  const animals = Object.keys(LIVESTOCK_DATA) as Array<keyof typeof LIVESTOCK_DATA>;
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const animalData = LIVESTOCK_DATA[randomAnimal];

  messages.push(`💰 ${animalData.name}s selling for ${animalData.cost} coins`);

  // General market conditions
  const marketConditions = [
    '📈 Market outlook: Strong demand for produce',
    '📊 Commodity prices holding steady',
    '💵 Feed costs remain affordable',
    '📉 Oversupply driving prices down',
    '📈 Export demand boosting prices',
    '💰 Hay prices at seasonal average',
  ];
  messages.push(marketConditions[Math.floor(Math.random() * marketConditions.length)]);

  return messages;
}

/**
 * Generate dynamic weather forecast based on season
 */
function generateWeatherForecast(season: string): string {
  const seasonKey = season.toUpperCase() as keyof typeof WEATHER_MESSAGES;
  const messages = WEATHER_MESSAGES[seasonKey] || WEATHER_MESSAGES.SPRING;
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate seasonal tip
 */
function generateSeasonalTip(season: string): string {
  const seasonKey = season.toUpperCase() as keyof typeof SEASONAL_TIPS;
  const tips = SEASONAL_TIPS[seasonKey] || SEASONAL_TIPS.SPRING;
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a set of ticker items for the day
 * Returns 8-10 random items mixing different categories
 */
export function generateTickerItems(gameState: { day: number; season: string; year: number }): string[] {
  const items: string[] = [];

  // Always include date
  items.push(`📅 Day ${gameState.day} of ${gameState.season}, Year ${gameState.year}`);

  // Weather (1 item)
  items.push(generateWeatherForecast(gameState.season));

  // Seasonal tip (1 item)
  items.push(generateSeasonalTip(gameState.season));

  // Market prices (2-3 items)
  items.push(...generateMarketPrices());

  // Local news (1-2 items)
  items.push(getRandomItem(LOCAL_NEWS));
  if (Math.random() > 0.5) {
    items.push(getRandomItem(LOCAL_NEWS));
  }

  // Farm gossip (1-2 items)
  items.push(getRandomItem(FARM_GOSSIP));
  if (Math.random() > 0.5) {
    items.push(getRandomItem(FARM_GOSSIP));
  }

  // Fun fact (occasional)
  if (Math.random() > 0.6) {
    items.push(getRandomItem(FUN_FACTS));
  }

  // Shuffle items to mix categories
  return items.sort(() => Math.random() - 0.5);
}
