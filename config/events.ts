import type { FarmEvent, GameState } from '@/types/core';
import { MAX_LEVEL } from '@/config/progression';

export const RANDOM_EVENTS: FarmEvent[] = [
  {
    title: "Local 4-H Club Donation",
    description: "The local 4-H club is raising money for their upcoming county fair showcase. They ask for a small contribution.",
    options: [
      {
        label: "Donate $50",
        logMessage: "Donated to the 4-H club. The community appreciates your support.",
        action: (state: GameState) => ({
          money: state.money - 50,
          horses: state.horses.map(h => ({ ...h, happiness: Math.min(100, h.happiness + 10) }))
        })
      },
      {
        label: "Politely Decline",
        logMessage: "Declined the donation request.",
        action: (state: GameState) => ({})
      }
    ]
  },
  {
    title: "Town Council Vote: Zoning",
    description: "The council is voting on a new zoning law that would increase property taxes but improve road maintenance (Infrastructure).",
    options: [
      {
        label: "Support (+Infra, -$$)",
        logMessage: "Supported the new zoning laws. Taxes increased, but fences are sturdier.",
        action: (state: GameState) => ({
          money: state.money - 100,
          infrastructure: Math.min(100, state.infrastructure + 20)
        })
      },
      {
        label: "Oppose",
        logMessage: "Opposed the zoning laws. Things stay the same.",
        action: (state: GameState) => ({})
      }
    ]
  },
  {
    title: "Storm Damage",
    description: "A heavy storm rolled through last night. A section of the stable roof is leaking.",
    options: [
      {
        label: "Repair Immediately ($100)",
        logMessage: "Fixed the roof immediately.",
        action: (state: GameState) => ({
          money: state.money - 100,
          cleanliness: Math.min(100, state.cleanliness + 10)
        })
      },
      {
        label: "Patch it yourself (-50 Energy)",
        logMessage: "Spent the morning patching the roof.",
        action: (state: GameState) => ({
          energy: Math.max(0, state.energy - 50)
        })
      },
      {
        label: "Ignore it",
        logMessage: "Ignored the leak. The stables are a mess.",
        action: (state: GameState) => ({
          cleanliness: Math.max(0, state.cleanliness - 30)
        })
      }
    ]
  },
  {
    title: "Bumper Crop",
    description: "A neighbor has an excess of hay and offers to sell it cheap.",
    options: [
      {
        label: "Buy 50 bales ($100)",
        logMessage: "Bought cheap hay from neighbor.",
        action: (state: GameState) => ({
          money: state.money - 100,
          feed: state.feed + 50
        })
      },
      {
        label: "No thanks",
        logMessage: "Passed on the cheap hay.",
        action: (state: GameState) => ({})
      }
    ]
  },
  {
    title: "Traveling Vet",
    description: "A specialist veterinarian is passing through town and offers a discount checkup for the herd.",
    options: [
      {
        label: "Full Checkup ($150)",
        logMessage: "The vet treated the herd. All horses fully restored and gained a Level!",
        action: (state: GameState) => ({
          money: state.money - 150,
          horses: state.horses.map(h => ({
            ...h,
            health: 100,
            hunger: 0,
            happiness: 100,
            stamina: 100,
            level: Math.min(MAX_LEVEL, h.level + 1),
            value: h.value + 500 // Immediate value boost for leveling up
          }))
        })
      },
      {
        label: "Pass",
        logMessage: "Skipped the vet visit.",
        action: (state: GameState) => ({})
      }
    ]
  }
];
