/* Bramblehaven: Frontier edition. All rates are per 60 simulation seconds. */
(function(root){
'use strict';
const D={
  "VERSION": "2.0.0",
  "SAVE_VERSION": 2,
  "SIZE": 18,
  "DAY": 120,
  "resources": {
    "gold": {
      "name": "Crowns",
      "short": "Crowns",
      "color": "#e5b655"
    },
    "wood": {
      "name": "Timber",
      "short": "Wood",
      "color": "#bf8957"
    },
    "stone": {
      "name": "Stone",
      "short": "Stone",
      "color": "#a9b6bc"
    },
    "food": {
      "name": "Provisions",
      "short": "Food",
      "color": "#eb9a68"
    },
    "ore": {
      "name": "Iron ore",
      "short": "Ore",
      "color": "#acb5c5"
    },
    "tools": {
      "name": "Equipment",
      "short": "Gear",
      "color": "#76b9b2"
    },
    "knowledge": {
      "name": "Insight",
      "short": "Insight",
      "color": "#b6a0d8"
    },
    "essence": {
      "name": "Stardust",
      "short": "Dust",
      "color": "#8bcec4"
    }
  },
  "ranks": [
    {
      "name": "A clearing",
      "fame": 0
    },
    {
      "name": "Outpost",
      "fame": 35
    },
    {
      "name": "Hamlet",
      "fame": 115
    },
    {
      "name": "Crossroads",
      "fame": 245
    },
    {
      "name": "Guild town",
      "fame": 430
    },
    {
      "name": "Sanctuary",
      "fame": 730
    },
    {
      "name": "Free city",
      "fame": 1100
    },
    {
      "name": "Frontier capital",
      "fame": 1600
    },
    {
      "name": "City of wonders",
      "fame": 2250
    },
    {
      "name": "A place in legend",
      "fame": 3100
    }
  ],
  "buildings": {
    "hall": {
      "name": "Guild hearth",
      "cat": "Civic",
      "rank": 1,
      "cost": {},
      "workers": 0,
      "out": {
        "gold": 8,
        "wood": 2,
        "stone": 1,
        "food": 4
      },
      "appeal": 5,
      "desc": "The last-resort town supply. Its small grant never grows with level: a safety net, not a money printer.",
      "unique": true
    },
    "path": {
      "name": "Stone path",
      "cat": "Paths",
      "rank": 1,
      "cost": {},
      "workers": 0,
      "desc": "Free to lay and remove. Workplaces and neighbourhood bonuses need an unbroken path to the hearth. No road means no production."
    },
    "cottage": {
      "name": "Cottage",
      "cat": "Homes",
      "rank": 1,
      "cost": {
        "gold": 65,
        "wood": 22,
        "stone": 8
      },
      "workers": 0,
      "housing": 4,
      "out": {
        "gold": 3
      },
      "appeal": 2,
      "desc": "Four residents at level one; one more per upgrade. Residents eat and homes need timber. Housing is not free labour.",
      "input": {
        "wood": 0.5
      }
    },
    "lumber": {
      "name": "Lumber camp",
      "cat": "Production",
      "rank": 1,
      "cost": {
        "gold": 75,
        "wood": 10
      },
      "workers": 2,
      "out": {
        "wood": 14
      },
      "terrain": "forest",
      "desc": "Timber for construction and workshop fuel. A forest site yields 35% more with the same workers and wages.",
      "input": {
        "gold": 2
      }
    },
    "quarry": {
      "name": "Quarry",
      "cat": "Production",
      "rank": 1,
      "cost": {
        "gold": 85,
        "wood": 18
      },
      "workers": 2,
      "out": {
        "stone": 11
      },
      "terrain": "stone",
      "desc": "Stone for housing, upgrades and land claims. Rocky ground yields 35% more for the same labour.",
      "input": {
        "gold": 2.5
      }
    },
    "farm": {
      "name": "Smallholding",
      "cat": "Production",
      "rank": 1,
      "cost": {
        "gold": 60,
        "wood": 12
      },
      "workers": 2,
      "out": {
        "food": 25
      },
      "terrain": "fertile",
      "appeal": 1,
      "desc": "Feeds residents and expedition parties. Fertile soil yields 35% more; winter cuts outdoor harvests by 40%.",
      "input": {
        "gold": 1.5
      }
    },
    "garden": {
      "name": "Pocket garden",
      "cat": "Culture",
      "rank": 1,
      "cost": {
        "gold": 55,
        "wood": 8,
        "stone": 10
      },
      "workers": 0,
      "appeal": 8,
      "desc": "A staffed town needs morale as well as housing. Gardens improve nearby homes and relieve crowding."
    },
    "market": {
      "name": "Market stall",
      "cat": "Trade",
      "rank": 2,
      "cost": {
        "gold": 110,
        "wood": 20,
        "stone": 12
      },
      "workers": 2,
      "input": {
        "food": 10,
        "gold": 1
      },
      "out": {
        "gold": 29
      },
      "appeal": 3,
      "desc": "Sells food to finance wages and projects. Every market competes with the guild and residents for provisions."
    },
    "warehouse": {
      "name": "Storehouse",
      "cat": "Civic",
      "rank": 2,
      "cost": {
        "gold": 125,
        "wood": 35,
        "stone": 20
      },
      "workers": 1,
      "storage": 180,
      "desc": "Adds 180 material capacity at level one, then 60 per upgrade. Requires one worker; inactive depots do not add capacity.",
      "input": {
        "gold": 1
      }
    },
    "inn": {
      "name": "Wayfarer inn",
      "cat": "Homes",
      "rank": 2,
      "cost": {
        "gold": 155,
        "wood": 35,
        "stone": 24
      },
      "workers": 0,
      "housing": 6,
      "input": {
        "wood": 1
      },
      "out": {
        "gold": 5
      },
      "appeal": 6,
      "desc": "Six residents, then one per upgrade. Road access and food help guild members recover. More residents also eat more."
    },
    "mine": {
      "name": "Iron mine",
      "cat": "Production",
      "rank": 3,
      "cost": {
        "gold": 160,
        "wood": 25,
        "stone": 32
      },
      "workers": 3,
      "input": {
        "gold": 3,
        "food": 4
      },
      "out": {
        "ore": 10
      },
      "terrain": "stone",
      "desc": "Iron for tools, equipment and repairs. Needs three workers and provisions. Rocky ground adds 35% yield."
    },
    "smith": {
      "name": "Forge",
      "cat": "Production",
      "rank": 3,
      "cost": {
        "gold": 190,
        "wood": 25,
        "stone": 38
      },
      "workers": 3,
      "input": {
        "gold": 3,
        "ore": 10,
        "wood": 7
      },
      "out": {
        "tools": 4
      },
      "desc": "Turns iron and timber into equipment. An adjacent working mine improves yield, not material consumption."
    },
    "library": {
      "name": "Reading room",
      "cat": "Culture",
      "rank": 3,
      "cost": {
        "gold": 160,
        "wood": 32,
        "stone": 25
      },
      "workers": 2,
      "input": {
        "gold": 6
      },
      "out": {
        "knowledge": 6
      },
      "appeal": 4,
      "desc": "Insight for new methods and expedition briefings. Researchers draw wages and compete with the rest of town for workers."
    },
    "bakery": {
      "name": "Hearth bakery",
      "cat": "Trade",
      "rank": 3,
      "cost": {
        "gold": 175,
        "wood": 25,
        "stone": 25
      },
      "workers": 3,
      "input": {
        "food": 18,
        "gold": 2
      },
      "out": {
        "gold": 52
      },
      "appeal": 4,
      "desc": "A stronger food-to-crowns trade. A nearby windmill and market improve yield without burning extra provisions."
    },
    "windmill": {
      "name": "Windmill",
      "cat": "Production",
      "rank": 4,
      "cost": {
        "gold": 230,
        "wood": 40,
        "stone": 30,
        "tools": 8
      },
      "workers": 1,
      "out": {},
      "appeal": 4,
      "desc": "An efficiency investment: boosts nearby farms and bakeries without increasing their input costs. Must be staffed and connected.",
      "input": {
        "gold": 1
      }
    },
    "training": {
      "name": "Training yard",
      "cat": "Guild",
      "rank": 3,
      "cost": {
        "gold": 210,
        "wood": 30,
        "stone": 25,
        "tools": 6
      },
      "workers": 2,
      "input": {
        "gold": 4,
        "food": 4
      },
      "out": {},
      "xp": 3,
      "desc": "Enables focused training and shares 3 XP per minute among idle adventurers. Guild experience caps rise after guardian victories."
    },
    "tavern": {
      "name": "Copper Kettle",
      "cat": "Guild",
      "rank": 4,
      "cost": {
        "gold": 250,
        "wood": 35,
        "stone": 30
      },
      "workers": 2,
      "input": {
        "food": 9,
        "gold": 2
      },
      "out": {
        "gold": 22
      },
      "appeal": 12,
      "desc": "A morale and recovery investment, not the best money-maker. Works especially well with an inn or museum."
    },
    "museum": {
      "name": "Cabinet of wonders",
      "cat": "Culture",
      "rank": 4,
      "cost": {
        "gold": 280,
        "wood": 35,
        "stone": 40,
        "tools": 6
      },
      "workers": 2,
      "out": {
        "gold": 6
      },
      "appeal": 8,
      "desc": "Each distinct relic adds 1.5 crowns per minute. Enables targeted surveys for any missing relic in a cleared region.",
      "input": {
        "gold": 2
      },
      "unique": true
    },
    "fountain": {
      "name": "Moonwell fountain",
      "cat": "Culture",
      "rank": 5,
      "cost": {
        "gold": 350,
        "stone": 60,
        "tools": 12
      },
      "workers": 0,
      "appeal": 18,
      "desc": "Relieves crowding and improves the adjacent inn. Landscaping supports a bigger workforce, but costs resources to maintain.",
      "input": {
        "gold": 1
      }
    },
    "greenhouse": {
      "name": "Glasshouse",
      "cat": "Production",
      "rank": 5,
      "cost": {
        "gold": 420,
        "wood": 40,
        "stone": 40,
        "tools": 22
      },
      "workers": 4,
      "input": {
        "gold": 5,
        "wood": 3
      },
      "out": {
        "food": 52
      },
      "appeal": 5,
      "desc": "Stable food through winter at a cost in fuel, wages and four workers. Requires the Copperhollow guardian.",
      "gate": 1
    },
    "alchemist": {
      "name": "Alchemist’s nook",
      "cat": "Production",
      "rank": 6,
      "cost": {
        "gold": 520,
        "wood": 45,
        "stone": 50,
        "tools": 25
      },
      "workers": 3,
      "input": {
        "gold": 5,
        "food": 10,
        "ore": 6
      },
      "out": {
        "knowledge": 13
      },
      "appeal": 5,
      "desc": "More insight from iron and food. A nearby working glasshouse improves yield. Requires the Moonfen guardian.",
      "gate": 2
    },
    "observatory": {
      "name": "Star observatory",
      "cat": "Culture",
      "rank": 7,
      "cost": {
        "gold": 750,
        "stone": 80,
        "tools": 35
      },
      "workers": 3,
      "input": {
        "gold": 4,
        "knowledge": 10
      },
      "out": {
        "essence": 3.5
      },
      "appeal": 10,
      "desc": "Converts insight into stardust for wards and advanced equipment. Requires the Sunken Archive guardian.",
      "gate": 3
    },
    "beacon": {
      "name": "The Wayhome beacon",
      "cat": "Wonders",
      "rank": 8,
      "cost": {
        "gold": 1400,
        "wood": 160,
        "stone": 180,
        "tools": 70,
        "essence": 35
      },
      "workers": 2,
      "out": {},
      "appeal": 30,
      "unique": true,
      "desc": "A working light for the last expedition. Requires the Cinder Crown guardian; must be connected, staffed and fueled to face the final keeper.",
      "input": {
        "gold": 3,
        "essence": 0.2
      },
      "gate": 5
    }
  },
  "combos": [
    {
      "id": "goodneighbors",
      "name": "Good neighbours",
      "a": "cottage",
      "b": "garden",
      "bonus": 0.35,
      "text": "Cottage + pocket garden"
    },
    {
      "id": "marketstreet",
      "name": "Market street",
      "a": "market",
      "b": "cottage",
      "bonus": 0.35,
      "text": "Market stall + cottage"
    },
    {
      "id": "breadbasket",
      "name": "Breadbasket",
      "a": "farm",
      "b": "windmill",
      "bonus": 0.45,
      "text": "Smallholding + windmill"
    },
    {
      "id": "freshbread",
      "name": "Fresh from the oven",
      "a": "bakery",
      "b": "windmill",
      "bonus": 0.4,
      "text": "Bakery + windmill"
    },
    {
      "id": "breakfast",
      "name": "Morning trade",
      "a": "bakery",
      "b": "market",
      "bonus": 0.35,
      "text": "Bakery + market stall"
    },
    {
      "id": "ironworks",
      "name": "Ironworks",
      "a": "smith",
      "b": "mine",
      "bonus": 0.35,
      "text": "Forge + iron mine"
    },
    {
      "id": "fieldtested",
      "name": "Field-tested",
      "a": "training",
      "b": "smith",
      "bonus": 0.4,
      "text": "Training yard + forge"
    },
    {
      "id": "tallstories",
      "name": "Tall stories",
      "a": "tavern",
      "b": "museum",
      "bonus": 0.4,
      "text": "Copper Kettle + cabinet of wonders"
    },
    {
      "id": "lastorders",
      "name": "Room at the inn",
      "a": "tavern",
      "b": "inn",
      "bonus": 0.35,
      "text": "Copper Kettle + wayfarer inn"
    },
    {
      "id": "starreaders",
      "name": "Star readers",
      "a": "observatory",
      "b": "library",
      "bonus": 0.45,
      "text": "Star observatory + reading room"
    },
    {
      "id": "waterside",
      "name": "A better address",
      "a": "inn",
      "b": "fountain",
      "bonus": 0.4,
      "text": "Wayfarer inn + moonwell fountain"
    },
    {
      "id": "botany",
      "name": "Practical botany",
      "a": "alchemist",
      "b": "greenhouse",
      "bonus": 0.4,
      "text": "Alchemist’s nook + glasshouse"
    }
  ],
  "research": [
    {
      "id": "axes",
      "name": "Tempered axes",
      "rank": 3,
      "cost": {
        "knowledge": 40,
        "gold": 85,
        "tools": 3
      },
      "desc": "+20% timber production.",
      "effect": "wood",
      "amount": 0.2
    },
    {
      "id": "granaries",
      "name": "Crop rotation",
      "rank": 3,
      "cost": {
        "knowledge": 40,
        "gold": 80
      },
      "desc": "+20% food production.",
      "effect": "food",
      "amount": 0.2
    },
    {
      "id": "masonry",
      "name": "Mason’s craft",
      "rank": 3,
      "cost": {
        "knowledge": 65,
        "gold": 140,
        "stone": 25
      },
      "desc": "+20% stone output. Unlocks level-three buildings.",
      "effect": "stone",
      "amount": 0.2,
      "gate": 0
    },
    {
      "id": "logistics",
      "name": "Work smarter",
      "rank": 3,
      "cost": {
        "knowledge": 70,
        "gold": 170
      },
      "desc": "Workplaces require 20% fewer hands. Upgrade levels still increase staffing.",
      "effect": "labor",
      "amount": 0.2
    },
    {
      "id": "survey",
      "name": "Surveyor’s tools",
      "rank": 4,
      "cost": {
        "knowledge": 70,
        "gold": 170,
        "tools": 6
      },
      "desc": "Land expansions cost 25% less.",
      "effect": "land",
      "amount": 0.25,
      "gate": 0
    },
    {
      "id": "trade",
      "name": "Letters of credit",
      "rank": 4,
      "cost": {
        "knowledge": 85,
        "gold": 190
      },
      "desc": "+20% crown production.",
      "effect": "gold",
      "amount": 0.2,
      "gate": 1
    },
    {
      "id": "maps",
      "name": "Two roads out",
      "rank": 4,
      "cost": {
        "knowledge": 85,
        "gold": 220,
        "wood": 30
      },
      "desc": "Send two expeditions at once.",
      "effect": "parties",
      "amount": 1,
      "gate": 0
    },
    {
      "id": "metallurgy",
      "name": "Clean-burning forge",
      "rank": 4,
      "cost": {
        "knowledge": 110,
        "gold": 220,
        "tools": 10,
        "ore": 20
      },
      "desc": "+25% ore and gear yield. Unlocks tier-two equipment.",
      "effect": "metal",
      "amount": 0.25,
      "gate": 1
    },
    {
      "id": "mentors",
      "name": "Pass it on",
      "rank": 4,
      "cost": {
        "knowledge": 95,
        "gold": 200,
        "food": 25
      },
      "desc": "+35% adventurer XP from every source.",
      "effect": "xp",
      "amount": 0.35,
      "gate": 1
    },
    {
      "id": "paving",
      "name": "The king’s road",
      "rank": 5,
      "cost": {
        "knowledge": 120,
        "gold": 280,
        "stone": 50
      },
      "desc": "+20% output for connected workplaces, with unchanged inputs.",
      "effect": "roads",
      "amount": 0.2,
      "gate": 2
    },
    {
      "id": "scholarship",
      "name": "Shared discoveries",
      "rank": 6,
      "cost": {
        "knowledge": 160,
        "gold": 360,
        "tools": 12
      },
      "desc": "+25% insight output. Unlocks tier-three equipment and level-four buildings.",
      "effect": "knowledge",
      "amount": 0.25,
      "gate": 3
    },
    {
      "id": "cartography",
      "name": "A wider world",
      "rank": 6,
      "requires": "maps",
      "cost": {
        "knowledge": 160,
        "gold": 400,
        "tools": 15
      },
      "desc": "Send three expeditions at once.",
      "effect": "parties",
      "amount": 1,
      "gate": 2
    },
    {
      "id": "resonance",
      "name": "Starlight resonance",
      "rank": 7,
      "cost": {
        "knowledge": 200,
        "essence": 12,
        "gold": 450
      },
      "desc": "+30% stardust output and +8% party power. Unlocks tier-four equipment.",
      "effect": "resonance",
      "amount": 0.3,
      "gate": 4
    },
    {
      "id": "masterwork",
      "name": "Built to last",
      "rank": 8,
      "cost": {
        "knowledge": 260,
        "tools": 40,
        "essence": 20,
        "gold": 700
      },
      "desc": "Unlocks tier-five equipment and buildings. +10% production yield, not input consumption.",
      "effect": "all",
      "amount": 0.15,
      "gate": 5
    }
  ],
  "heroes": [
    {
      "id": "rowan",
      "name": "Rowan",
      "role": "Trail scout",
      "color": "#6caa78",
      "hair": "#543e34",
      "skin": "#d7a478",
      "power": 22,
      "rank": 1,
      "cost": {},
      "talent": "Trailwise",
      "desc": "+20% party power in Whisperwood and Moonfen.",
      "regions": [
        0,
        2
      ],
      "skills": [
        "scout"
      ]
    },
    {
      "id": "ada",
      "name": "Ada",
      "role": "Shield bearer",
      "color": "#b16f56",
      "hair": "#453c3d",
      "skin": "#bd815d",
      "power": 24,
      "rank": 2,
      "cost": {
        "gold": 130,
        "food": 15
      },
      "talent": "Hold the line",
      "desc": "+8% power for the whole party, everywhere.",
      "party": 0.08,
      "skills": [
        "guard"
      ]
    },
    {
      "id": "ivo",
      "name": "Ivo",
      "role": "Artificer",
      "color": "#d2b456",
      "hair": "#babcbd",
      "skin": "#e9bc96",
      "power": 21,
      "rank": 3,
      "cost": {
        "gold": 210,
        "tools": 6
      },
      "talent": "Salvager",
      "desc": "+30% crown and material rewards from expeditions.",
      "loot": 0.3,
      "skills": [
        "engineer"
      ],
      "gate": 0
    },
    {
      "id": "nera",
      "name": "Nera",
      "role": "Hedge witch",
      "color": "#a48bbc",
      "hair": "#292f41",
      "skin": "#bb907c",
      "power": 24,
      "rank": 3,
      "cost": {
        "gold": 230,
        "knowledge": 18
      },
      "talent": "Old ways",
      "desc": "+20% party power in Moonfen and the Sunken Archive.",
      "regions": [
        2,
        3
      ],
      "skills": [
        "scholar"
      ],
      "gate": 0
    },
    {
      "id": "flint",
      "name": "Flint",
      "role": "Deep delver",
      "color": "#c58f59",
      "hair": "#ad653b",
      "skin": "#edbc92",
      "power": 27,
      "rank": 4,
      "cost": {
        "gold": 260,
        "ore": 15
      },
      "talent": "Stoneblood",
      "desc": "+20% party power in Copperhollow and Frostglass Pass.",
      "regions": [
        1,
        4
      ],
      "skills": [
        "engineer"
      ],
      "gate": 0
    },
    {
      "id": "lark",
      "name": "Lark",
      "role": "Road singer",
      "color": "#79b8bc",
      "hair": "#623e35",
      "skin": "#b77c58",
      "power": 22,
      "rank": 5,
      "cost": {
        "gold": 350,
        "food": 25
      },
      "talent": "One more verse",
      "desc": "All party members gain 35% extra expedition XP.",
      "xp": 0.35,
      "skills": [
        "scout",
        "scholar"
      ],
      "gate": 1
    },
    {
      "id": "sable",
      "name": "Sable",
      "role": "Ash duelist",
      "color": "#b77385",
      "hair": "#e2d7ba",
      "skin": "#8a6356",
      "power": 30,
      "rank": 6,
      "cost": {
        "gold": 500,
        "tools": 18
      },
      "talent": "Into the fire",
      "desc": "+20% party power at Cinder Crown and Starlit Reach.",
      "regions": [
        5,
        6
      ],
      "skills": [
        "guard"
      ],
      "gate": 3
    },
    {
      "id": "orin",
      "name": "Orin",
      "role": "Star keeper",
      "color": "#848dc8",
      "hair": "#c4cbcc",
      "skin": "#dfb09b",
      "power": 32,
      "rank": 7,
      "cost": {
        "gold": 650,
        "essence": 8
      },
      "talent": "Constellation",
      "desc": "+10% party power everywhere. Scholarly expertise counters ancient wards.",
      "party": 0.1,
      "skills": [
        "scholar"
      ],
      "gate": 4
    }
  ],
  "regions": [
    {
      "id": "wood",
      "name": "Whisperwood",
      "sub": "Where the old road disappears",
      "rank": 1,
      "power": 30,
      "time": 48,
      "cost": {
        "food": 10
      },
      "color": "#6aa675",
      "icon": "tree",
      "loot": {
        "gold": 36,
        "wood": 10,
        "food": 4
      },
      "stages": [
        "The overgrown mile",
        "Foxglove crossing",
        "The hollow oak",
        "The antlered sentinel"
      ],
      "relics": [
        "acorn",
        "bell",
        "antler"
      ],
      "choice": {
        "title": "A light between the trees",
        "text": "A lantern swings where there is no path. Follow it, or keep to the old trail?",
        "a": "Follow the light",
        "b": "Stay on the trail",
        "kind": "loot"
      },
      "skills": [
        "scout"
      ],
      "hazard": "Lost trails",
      "minGear": 0,
      "requires": [],
      "guardianGear": 1
    },
    {
      "id": "copper",
      "name": "Copperhollow",
      "sub": "An echo under the mountain",
      "rank": 3,
      "power": 72,
      "time": 60,
      "cost": {
        "food": 16,
        "wood": 6
      },
      "color": "#b38a5d",
      "icon": "ore",
      "loot": {
        "gold": 55,
        "stone": 15,
        "ore": 12
      },
      "stages": [
        "The abandoned lift",
        "The singing seam",
        "Emberrail station",
        "The clockwork warden"
      ],
      "relics": [
        "coin",
        "geode",
        "heart"
      ],
      "choice": {
        "title": "The last ore cart",
        "text": "Its wheels still turn. There might be something useful beyond the collapsed tunnel.",
        "a": "Take the detour",
        "b": "Mark it for later",
        "kind": "loot"
      },
      "skills": [
        "engineer"
      ],
      "hazard": "Unstable tunnels",
      "minGear": 0,
      "requires": [],
      "guardianGear": 1
    },
    {
      "id": "fen",
      "name": "Moonfen",
      "sub": "Even the water keeps secrets",
      "rank": 4,
      "power": 115,
      "time": 75,
      "cost": {
        "food": 24,
        "tools": 1
      },
      "color": "#889aa9",
      "icon": "moon",
      "loot": {
        "gold": 75,
        "food": 12,
        "knowledge": 10
      },
      "stages": [
        "Lantern marsh",
        "The reed cathedral",
        "A bridge of roots",
        "The mirror heron"
      ],
      "relics": [
        "lily",
        "mask",
        "feather"
      ],
      "choice": {
        "title": "A bargain with the marsh",
        "text": "A figure offers a shortcut. The price is a memory of somewhere warm.",
        "a": "Trust the shortcut",
        "b": "Walk the long way",
        "kind": "power"
      },
      "skills": [
        "scholar"
      ],
      "hazard": "Marsh hexes",
      "minGear": 1,
      "requires": [
        "maps"
      ],
      "guardianGear": 2
    },
    {
      "id": "archive",
      "name": "Sunken Archive",
      "sub": "A library beneath the tide",
      "rank": 5,
      "power": 162,
      "time": 90,
      "cost": {
        "food": 30,
        "tools": 2,
        "knowledge": 8
      },
      "color": "#669eaa",
      "icon": "book",
      "loot": {
        "gold": 100,
        "knowledge": 18,
        "tools": 5
      },
      "stages": [
        "The drowned steps",
        "The paper reef",
        "The sealed stacks",
        "The last librarian"
      ],
      "relics": [
        "page",
        "compass",
        "ink"
      ],
      "choice": {
        "title": "A book with blank pages",
        "text": "The writing appears only when someone speaks. Read aloud, or leave it closed?",
        "a": "Read the first line",
        "b": "Leave it closed",
        "kind": "loot"
      },
      "skills": [
        "scholar"
      ],
      "hazard": "Sealed writings",
      "minGear": 2,
      "requires": [
        "metallurgy"
      ],
      "guardianGear": 2
    },
    {
      "id": "frost",
      "name": "Frostglass Pass",
      "sub": "The world, held in a breath",
      "rank": 6,
      "power": 205,
      "time": 105,
      "cost": {
        "food": 38,
        "wood": 15,
        "tools": 3
      },
      "color": "#98b9c0",
      "icon": "snow",
      "loot": {
        "gold": 130,
        "stone": 25,
        "ore": 20,
        "essence": 3
      },
      "stages": [
        "The blue ascent",
        "Windbreak refuge",
        "The frozen hour",
        "The glass stag"
      ],
      "relics": [
        "crystal",
        "hourglass",
        "crown"
      ],
      "choice": {
        "title": "Footprints in fresh snow",
        "text": "Someone passed this way minutes ago. Their trail climbs above the cloud line.",
        "a": "Follow the tracks",
        "b": "Keep below the ridge",
        "kind": "power"
      },
      "skills": [
        "engineer"
      ],
      "hazard": "Exposed ridges",
      "minGear": 2,
      "requires": [
        "scholarship"
      ],
      "guardianGear": 3
    },
    {
      "id": "cinder",
      "name": "Cinder Crown",
      "sub": "The mountain remembers fire",
      "rank": 7,
      "power": 255,
      "time": 120,
      "cost": {
        "food": 45,
        "tools": 5,
        "essence": 2
      },
      "color": "#bd796a",
      "icon": "fire",
      "loot": {
        "gold": 160,
        "tools": 10,
        "essence": 5
      },
      "stages": [
        "Blackstone road",
        "The ember garden",
        "Anvil of the first smith",
        "The cinder sovereign"
      ],
      "relics": [
        "rose",
        "hammer",
        "ember"
      ],
      "choice": {
        "title": "The forge is still warm",
        "text": "No one has worked it for a century. One piece of equipment could be tempered here.",
        "a": "Stoke the old forge",
        "b": "Save our strength",
        "kind": "power"
      },
      "skills": [
        "guard"
      ],
      "hazard": "Blazing embers",
      "minGear": 3,
      "requires": [
        "resonance"
      ],
      "guardianGear": 4
    },
    {
      "id": "stars",
      "name": "Starlit Reach",
      "sub": "There is a road beyond the sky",
      "rank": 8,
      "power": 315,
      "time": 140,
      "cost": {
        "food": 55,
        "tools": 7,
        "essence": 5
      },
      "color": "#9a91bd",
      "icon": "star",
      "loot": {
        "gold": 210,
        "knowledge": 30,
        "essence": 8
      },
      "stages": [
        "The silver causeway",
        "The quiet constellation",
        "The door without a wall",
        "The keeper of the wayhome"
      ],
      "relics": [
        "map",
        "seed",
        "waystone"
      ],
      "choice": {
        "title": "A town in the distance",
        "text": "Through the mist: a light in a window. It looks very much like home.",
        "a": "Carry the light onward",
        "b": "Remember the way back",
        "kind": "loot"
      },
      "skills": [
        "scholar"
      ],
      "hazard": "Celestial wards",
      "minGear": 4,
      "requires": [
        "masterwork"
      ],
      "guardianGear": 5
    }
  ],
  "relics": [
    {
      "id": "acorn",
      "name": "Silver acorn",
      "rarity": "Uncommon",
      "desc": "It is warm, even in winter. Something inside is waiting.",
      "icon": "seed"
    },
    {
      "id": "bell",
      "name": "Foxglove bell",
      "rarity": "Rare",
      "desc": "It rings only when a lost traveller finds the road.",
      "icon": "bell"
    },
    {
      "id": "antler",
      "name": "Sentinel’s antler",
      "rarity": "Legendary",
      "desc": "Given, not taken. The wood remembers the difference.",
      "icon": "crown"
    },
    {
      "id": "coin",
      "name": "A coin from tomorrow",
      "rarity": "Uncommon",
      "desc": "The date is a little worrying. The value is excellent.",
      "icon": "gold"
    },
    {
      "id": "geode",
      "name": "Humming geode",
      "rarity": "Rare",
      "desc": "Hold it to your ear. That is not the sea.",
      "icon": "ore"
    },
    {
      "id": "heart",
      "name": "Clockwork heart",
      "rarity": "Legendary",
      "desc": "Still beating. No one can find the winding key.",
      "icon": "gear"
    },
    {
      "id": "lily",
      "name": "Moonwater lily",
      "rarity": "Uncommon",
      "desc": "A pressed flower that opens after sundown.",
      "icon": "flower"
    },
    {
      "id": "mask",
      "name": "Reed mask",
      "rarity": "Rare",
      "desc": "The face looks different to everyone who wears it.",
      "icon": "shield"
    },
    {
      "id": "feather",
      "name": "Mirror feather",
      "rarity": "Legendary",
      "desc": "Its reflection is always a moment ahead.",
      "icon": "feather"
    },
    {
      "id": "page",
      "name": "An unwritten page",
      "rarity": "Uncommon",
      "desc": "A story has already happened here. It has not been told yet.",
      "icon": "book"
    },
    {
      "id": "compass",
      "name": "Tideglass compass",
      "rarity": "Rare",
      "desc": "It points toward the thing you miss most.",
      "icon": "compass"
    },
    {
      "id": "ink",
      "name": "The last ink",
      "rarity": "Legendary",
      "desc": "Enough to write one sentence that will never be forgotten.",
      "icon": "flask"
    },
    {
      "id": "crystal",
      "name": "Winterglass",
      "rarity": "Uncommon",
      "desc": "There is a tiny snowstorm inside. It has never stopped.",
      "icon": "snow"
    },
    {
      "id": "hourglass",
      "name": "The borrowed hour",
      "rarity": "Rare",
      "desc": "The sand falls upward when no one is looking.",
      "icon": "time"
    },
    {
      "id": "crown",
      "name": "Crown of the thaw",
      "rarity": "Legendary",
      "desc": "Too cold to wear. Too beautiful to leave behind.",
      "icon": "crown"
    },
    {
      "id": "rose",
      "name": "Ash rose",
      "rarity": "Uncommon",
      "desc": "The first thing that grew after the fire.",
      "icon": "flower"
    },
    {
      "id": "hammer",
      "name": "Firstsmith’s hammer",
      "rarity": "Rare",
      "desc": "A modest tool. Everything else was made with it.",
      "icon": "hammer"
    },
    {
      "id": "ember",
      "name": "Undying ember",
      "rarity": "Legendary",
      "desc": "It asks for nothing. It keeps everyone warm.",
      "icon": "fire"
    },
    {
      "id": "map",
      "name": "Map of the silence",
      "rarity": "Uncommon",
      "desc": "You can hear all the places not marked on it.",
      "icon": "map"
    },
    {
      "id": "seed",
      "name": "Seed of a new sky",
      "rarity": "Rare",
      "desc": "Plant it somewhere with plenty of room.",
      "icon": "seed"
    },
    {
      "id": "waystone",
      "name": "The wayhome stone",
      "rarity": "Legendary",
      "desc": "Wherever you carry it, the road home is never far.",
      "icon": "star"
    }
  ],
  "chapters": [
    {
      "id": "timber",
      "title": "A place to begin",
      "text": "Every town starts with a few good beams. Build a lumber camp.",
      "kind": "build",
      "target": "lumber",
      "n": 1,
      "reward": {
        "gold": 25,
        "wood": 8,
        "fame": 20
      },
      "tab": "build"
    },
    {
      "id": "table",
      "title": "A seat at the table",
      "text": "Build a smallholding to keep the town and its expeditions fed.",
      "kind": "build",
      "target": "farm",
      "n": 1,
      "reward": {
        "gold": 25,
        "food": 12,
        "fame": 22
      },
      "tab": "build"
    },
    {
      "id": "road",
      "title": "Roads bring people",
      "text": "Lay four stone paths. Paths are free; connect workplaces back to the hearth.",
      "kind": "build",
      "target": "path",
      "n": 4,
      "reward": {
        "gold": 25,
        "stone": 8,
        "fame": 25
      },
      "tab": "build"
    },
    {
      "id": "beyond",
      "title": "Beyond the treeline",
      "text": "Win an expedition in Whisperwood. Rowan is ready to go.",
      "kind": "wins",
      "n": 1,
      "reward": {
        "gold": 64,
        "knowledge": 4,
        "fame": 40
      },
      "tab": "explore"
    },
    {
      "id": "homes",
      "title": "Somewhere to stay",
      "text": "Have two cottages in town. Workplaces need residents.",
      "kind": "build",
      "target": "cottage",
      "n": 2,
      "reward": {
        "gold": 60,
        "wood": 12,
        "fame": 35
      },
      "tab": "build"
    },
    {
      "id": "trade",
      "title": "Open for business",
      "text": "Build a market stall. Food becomes trade; trade becomes possibility.",
      "kind": "build",
      "target": "market",
      "n": 1,
      "reward": {
        "gold": 80,
        "stone": 10,
        "fame": 40
      },
      "tab": "build"
    },
    {
      "id": "company",
      "title": "Good company",
      "text": "Recruit a second adventurer. A balanced party can go much further.",
      "kind": "heroes",
      "n": 2,
      "reward": {
        "gold": 72,
        "food": 12,
        "fame": 40
      },
      "tab": "guild"
    },
    {
      "id": "iron",
      "title": "Iron in the fire",
      "text": "Build a forge. It needs iron ore from an iron mine or expeditions.",
      "kind": "build",
      "target": "smith",
      "n": 1,
      "reward": {
        "gold": 100,
        "ore": 14,
        "fame": 55
      },
      "tab": "build"
    },
    {
      "id": "ideas",
      "title": "More than bricks",
      "text": "Complete your first research in the Guild’s research desk.",
      "kind": "research",
      "n": 1,
      "reward": {
        "gold": 100,
        "knowledge": 12,
        "fame": 70
      },
      "tab": "guild"
    },
    {
      "id": "sentinel",
      "title": "The wood remembers",
      "text": "Clear all four Whisperwood landmarks, including its sentinel.",
      "kind": "region",
      "target": 0,
      "n": 4,
      "reward": {
        "gold": 140,
        "tools": 6,
        "fame": 100
      },
      "tab": "explore"
    },
    {
      "id": "collection",
      "title": "Worth coming back for",
      "text": "Find five distinct relics. Each one has a place in the cabinet of wonders.",
      "kind": "relics",
      "n": 5,
      "reward": {
        "gold": 180,
        "essence": 2,
        "fame": 120
      },
      "tab": "journal"
    },
    {
      "id": "district",
      "title": "A town, not a camp",
      "text": "Discover four neighbourhood combinations by placing complementary buildings side by side.",
      "kind": "combos",
      "n": 4,
      "reward": {
        "gold": 200,
        "knowledge": 24,
        "fame": 150
      },
      "tab": "build"
    },
    {
      "id": "sky",
      "title": "Look up",
      "text": "Build a star observatory. Insight can become something brighter.",
      "kind": "build",
      "target": "observatory",
      "n": 1,
      "reward": {
        "gold": 260,
        "essence": 6,
        "fame": 220
      },
      "tab": "build"
    },
    {
      "id": "beacon",
      "title": "Leave a light on",
      "text": "Build the Wayhome beacon. Give the frontier a landmark it cannot lose.",
      "kind": "build",
      "target": "beacon",
      "n": 1,
      "reward": {
        "gold": 400,
        "tools": 14,
        "fame": 350
      },
      "tab": "build"
    },
    {
      "id": "home",
      "title": "The long way home",
      "text": "Clear all four landmarks in Starlit Reach. The story ends where the road began.",
      "kind": "region",
      "target": 6,
      "n": 4,
      "reward": {
        "gold": 1000,
        "essence": 16,
        "fame": 750
      },
      "tab": "explore"
    }
  ],
  "achievements": [
    {
      "id": "foundations",
      "name": "Foundations",
      "desc": "Place 5 buildings.",
      "kind": "built",
      "n": 5,
      "reward": {
        "gold": 35,
        "fame": 9
      }
    },
    {
      "id": "roofline",
      "name": "A changing skyline",
      "desc": "Place 15 buildings.",
      "kind": "built",
      "n": 15,
      "reward": {
        "gold": 88,
        "fame": 24
      }
    },
    {
      "id": "city",
      "name": "The town that grew",
      "desc": "Place 35 buildings.",
      "kind": "built",
      "n": 35,
      "reward": {
        "gold": 210,
        "fame": 60
      }
    },
    {
      "id": "crowns",
      "name": "A little prosperity",
      "desc": "Earn 1,000 crowns in total.",
      "kind": "earned",
      "n": 1000,
      "reward": {
        "gold": 52,
        "fame": 12
      }
    },
    {
      "id": "fortune",
      "name": "A proper treasury",
      "desc": "Earn 10,000 crowns in total.",
      "kind": "earned",
      "n": 10000,
      "reward": {
        "gold": 175,
        "fame": 36
      }
    },
    {
      "id": "tycoon",
      "name": "Frontier tycoon",
      "desc": "Earn 50,000 crowns in total.",
      "kind": "earned",
      "n": 50000,
      "reward": {
        "gold": 525,
        "fame": 90
      }
    },
    {
      "id": "firsttrail",
      "name": "Boots on the trail",
      "desc": "Win your first expedition.",
      "kind": "wins",
      "n": 1,
      "reward": {
        "gold": 28,
        "fame": 12
      }
    },
    {
      "id": "regular",
      "name": "There and back again",
      "desc": "Win 10 expeditions.",
      "kind": "wins",
      "n": 10,
      "reward": {
        "gold": 105,
        "fame": 36
      }
    },
    {
      "id": "veteran",
      "name": "Old roads, new stories",
      "desc": "Win 30 expeditions.",
      "kind": "wins",
      "n": 30,
      "reward": {
        "gold": 245,
        "fame": 72
      }
    },
    {
      "id": "collector",
      "name": "Small wonders",
      "desc": "Collect 3 distinct relics.",
      "kind": "relics",
      "n": 3,
      "reward": {
        "gold": 63,
        "fame": 18
      }
    },
    {
      "id": "curator",
      "name": "A world in a room",
      "desc": "Collect 10 distinct relics.",
      "kind": "relics",
      "n": 10,
      "reward": {
        "gold": 175,
        "fame": 60
      }
    },
    {
      "id": "allrelics",
      "name": "Nothing left behind",
      "desc": "Collect all 21 relics.",
      "kind": "relics",
      "n": 21,
      "reward": {
        "gold": 700,
        "fame": 240
      }
    },
    {
      "id": "duo",
      "name": "Room for one more",
      "desc": "Recruit 3 adventurers.",
      "kind": "heroes",
      "n": 3,
      "reward": {
        "food": 18,
        "fame": 24
      }
    },
    {
      "id": "roster",
      "name": "The whole company",
      "desc": "Recruit all 8 adventurers.",
      "kind": "heroes",
      "n": 8,
      "reward": {
        "gold": 315,
        "fame": 108
      }
    },
    {
      "id": "neighbor",
      "name": "Better together",
      "desc": "Discover your first neighbourhood combination.",
      "kind": "combos",
      "n": 1,
      "reward": {
        "gold": 35,
        "fame": 15
      }
    },
    {
      "id": "planner",
      "name": "A thoughtful planner",
      "desc": "Discover 6 neighbourhood combinations.",
      "kind": "combos",
      "n": 6,
      "reward": {
        "gold": 158,
        "fame": 60
      }
    },
    {
      "id": "masterplan",
      "name": "Everything in its place",
      "desc": "Discover all 12 neighbourhood combinations.",
      "kind": "combos",
      "n": 12,
      "reward": {
        "gold": 490,
        "fame": 150
      }
    },
    {
      "id": "reader",
      "name": "A good question",
      "desc": "Complete 3 research projects.",
      "kind": "research",
      "n": 3,
      "reward": {
        "knowledge": 14,
        "fame": 24
      }
    },
    {
      "id": "scholar",
      "name": "An answer worth sharing",
      "desc": "Complete 10 research projects.",
      "kind": "research",
      "n": 10,
      "reward": {
        "gold": 280,
        "fame": 90
      }
    },
    {
      "id": "land",
      "name": "Room to grow",
      "desc": "Expand your land twice.",
      "kind": "expansions",
      "n": 2,
      "reward": {
        "wood": 28,
        "stone": 21,
        "fame": 30
      }
    },
    {
      "id": "frontier",
      "name": "The whole frontier",
      "desc": "Claim all six land expansions.",
      "kind": "expansions",
      "n": 6,
      "reward": {
        "gold": 280,
        "fame": 90
      }
    },
    {
      "id": "artisan",
      "name": "Made to last",
      "desc": "Upgrade buildings 5 times.",
      "kind": "upgrades",
      "n": 5,
      "reward": {
        "tools": 7,
        "fame": 30
      }
    },
    {
      "id": "craft",
      "name": "Master builder",
      "desc": "Upgrade buildings 20 times.",
      "kind": "upgrades",
      "n": 20,
      "reward": {
        "gold": 210,
        "fame": 72
      }
    },
    {
      "id": "contracts",
      "name": "A fair exchange",
      "desc": "Complete 5 trading contracts.",
      "kind": "contracts",
      "n": 5,
      "reward": {
        "gold": 122,
        "fame": 36
      }
    },
    {
      "id": "hamlet",
      "name": "A name on the map",
      "desc": "Reach town rank 4.",
      "kind": "rank",
      "n": 4,
      "reward": {
        "gold": 105,
        "fame": 24
      }
    },
    {
      "id": "capital",
      "name": "All roads lead here",
      "desc": "Reach town rank 8.",
      "kind": "rank",
      "n": 8,
      "reward": {
        "gold": 420,
        "fame": 108
      }
    },
    {
      "id": "legend",
      "name": "Somewhere worth remembering",
      "desc": "Reach town rank 10.",
      "kind": "rank",
      "n": 10,
      "reward": {
        "gold": 875,
        "fame": 240
      }
    },
    {
      "id": "seasons",
      "name": "A year in Bramblehaven",
      "desc": "Reach day 21.",
      "kind": "day",
      "n": 21,
      "reward": {
        "gold": 140,
        "fame": 42
      }
    },
    {
      "id": "wayhome",
      "name": "The way home",
      "desc": "Complete all 15 charter chapters.",
      "kind": "chapter",
      "n": 15,
      "reward": {
        "gold": 1050,
        "fame": 300
      }
    }
  ],
  "events": [
    {
      "title": "The travelling orchard",
      "text": "A wagon arrives carrying saplings in old tea tins. Its driver has been planting a little of the road behind her.",
      "choices": [
        {
          "text": "Buy saplings",
          "cost": {
            "gold": 70
          },
          "reward": {
            "food": 24,
            "fame": 11
          }
        },
        {
          "text": "Offer a meal instead",
          "cost": {
            "food": 12
          },
          "reward": {
            "fame": 6
          }
        },
        {
          "text": "Wish her a safe journey",
          "reward": {
            "gold": 5
          }
        }
      ]
    },
    {
      "title": "The bridge fund",
      "text": "A letter from the next valley: the spring floods took their bridge. They ask for timber, not promises.",
      "choices": [
        {
          "text": "Send building timber",
          "cost": {
            "wood": 35
          },
          "reward": {
            "gold": 68,
            "fame": 15
          }
        },
        {
          "text": "Send a smaller cart",
          "cost": {
            "wood": 12
          },
          "reward": {
            "gold": 20,
            "fame": 6
          }
        },
        {
          "text": "Not this time",
          "reward": {}
        }
      ]
    },
    {
      "title": "A night of lanterns",
      "text": "Someone strings a lantern above the market. By evening, there are dozens. It seems the town has decided to celebrate.",
      "choices": [
        {
          "text": "Put on a feast",
          "cost": {
            "food": 35,
            "gold": 60
          },
          "reward": {
            "fame": 33,
            "knowledge": 5
          }
        },
        {
          "text": "Sponsor the lanterns",
          "cost": {
            "gold": 35
          },
          "reward": {
            "fame": 11
          }
        },
        {
          "text": "Enjoy the evening",
          "reward": {
            "fame": 3
          }
        }
      ]
    },
    {
      "title": "The mapmaker’s mistake",
      "text": "A visitor apologises: your town is missing from his maps. He offers to fix this rather publicly.",
      "choices": [
        {
          "text": "Commission a new atlas",
          "cost": {
            "gold": 120
          },
          "reward": {
            "fame": 30,
            "knowledge": 8
          }
        },
        {
          "text": "Draw him the main road",
          "cost": {
            "wood": 5
          },
          "reward": {
            "fame": 7
          }
        },
        {
          "text": "Let the roads speak for us",
          "reward": {
            "knowledge": 2
          }
        }
      ]
    },
    {
      "title": "Unexpected craftsmanship",
      "text": "An apprentice has stayed late in the forge. On the bench is a tool better than anything her master has made.",
      "choices": [
        {
          "text": "Buy the first set",
          "cost": {
            "gold": 130
          },
          "reward": {
            "tools": 7,
            "fame": 7
          }
        },
        {
          "text": "Fund her studies",
          "cost": {
            "gold": 65
          },
          "reward": {
            "knowledge": 10,
            "fame": 6
          }
        },
        {
          "text": "Offer encouragement",
          "reward": {
            "fame": 2
          }
        }
      ]
    }
  ],
  "supplyPolicies": {
    "light": {
      "name": "Travel light",
      "cost": 0.75,
      "odds": -0.1,
      "wear": 1.3,
      "desc": "25% less food · −10 points success · more equipment wear"
    },
    "standard": {
      "name": "Standard",
      "cost": 1,
      "odds": 0,
      "wear": 1,
      "desc": "Normal provisions, protection and equipment wear"
    },
    "stocked": {
      "name": "Well supplied",
      "cost": 1.55,
      "odds": 0.1,
      "wear": 0.65,
      "desc": "55% more food, spare gear · +10 points success · less wear"
    }
  },
  "gearPower": [
    0,
    8,
    19,
    33,
    49,
    68
  ],
  "gearNames": [
    "Travel clothes",
    "Ironbound",
    "Tempered",
    "Runic",
    "Starforged",
    "Masterwork"
  ],
  "levelGates": {
    "3": "masonry",
    "4": "scholarship",
    "5": "masterwork"
  },
  "gearGates": {
    "2": "metallurgy",
    "3": "scholarship",
    "4": "resonance",
    "5": "masterwork"
  },
  "skillNames": {
    "scout": "Scouting",
    "guard": "Protection",
    "engineer": "Engineering",
    "scholar": "Lore"
  }
};
if(typeof module!=="undefined"&&module.exports)module.exports=D;else root.BHData=D;
})(typeof globalThis!=="undefined"?globalThis:this);
