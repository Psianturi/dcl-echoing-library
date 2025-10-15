# The Echoing Library - Asset Specifications

This document lists all the custom assets you need to create and add to the project for the complete experience.

## Directory Structure
Create these folders in your project:
```
assets/
├── sounds/          (Audio files - YOU will add these)
└── textures/        (Image files - YOU will add these)
```

## Audio Files Required

### 1. Ambient Background Sound
**File:** `assets/sounds/ambient_library.mp3`
- **Description:** Looping background ambient sound for gothic library
- **Duration:** 2-3 minutes (seamless loop)
- **Style:** Low humming, distant echoes, subtle wind, very quiet
- **Volume:** Very low (background level)
- **Format:** MP3, 44.1kHz, 128kbps
- **Usage:** Plays continuously throughout the experience

### 2. Riddle Whispers (3 files)
**Files:** 
- `assets/sounds/whisper_riddle1.mp3`
- `assets/sounds/whisper_riddle2.mp3` 
- `assets/sounds/whisper_riddle3.mp3`

- **Description:** Ghostly whispers for each riddle
- **Duration:** 8-12 seconds each
- **Style:** Ethereal female voice, echoing, mysterious
- **Volume:** Medium
- **Format:** MP3, 44.1kHz, 128kbps
- **Usage:** Played when central book is clicked

### 3. Ambient Page Turn
**File:** `assets/sounds/page_turn.mp3`
- **Description:** Occasional ambient page turning sound
- **Duration:** 1-2 seconds
- **Style:** Paper rustling, page turning, subtle
- **Volume:** Low
- **Format:** MP3, 44.1kHz, 128kbps
- **Usage:** Plays randomly every 15-30 seconds

### 4. Book Opening Sound
**File:** `assets/sounds/book_open.mp3`
- **Description:** Sound when key book is opened
- **Duration:** 2-3 seconds
- **Style:** Mystical book opening, magical chime, ethereal
- **Volume:** Medium
- **Format:** MP3, 44.1kHz, 128kbps
- **Usage:** Played when any key book is clicked

### 5. Completion Sound
**File:** `assets/sounds/completion.mp3`
- **Description:** Final completion sound when all books found
- **Duration:** 4-6 seconds
- **Style:** Triumphant mystical chime, ethereal choir, magical
- **Volume:** Medium-High
- **Format:** MP3, 44.1kHz, 128kbps
- **Usage:** Played when all three books are found

## Texture Files Required

### 1. Gothic Stone Wall
**File:** `assets/textures/stone_wall.png`
- **Description:** Gothic stone wall texture for library walls
- **Style:** Dark, aged stone with subtle cracks and weathering
- **Colors:** Dark grays, browns, with mossy green hints
- **Size:** 512x512 or 1024x1024 pixels
- **Format:** PNG with transparency support
- **Usage:** Applied to library walls

### 2. Mossy Stone
**File:** `assets/textures/mossy_stone.png`
- **Description:** Aged stone with moss growth for bookshelves
- **Style:** Weathered stone with green moss patches
- **Colors:** Dark stone base with vibrant green moss
- **Size:** 512x512 or 1024x1024 pixels
- **Format:** PNG with transparency support
- **Usage:** Applied to bookshelves and pedestal

### 3. Ghostly Energy
**File:** `assets/textures/ghostly_energy.png`
- **Description:** Swirling ethereal effect for visual effects
- **Style:** Swirling, translucent energy with purple/blue tones
- **Colors:** Purple, blue, white with transparency
- **Size:** 256x256 or 512x512 pixels
- **Format:** PNG with transparency (alpha channel)
- **Usage:** Particle effects and glowing elements

## AI Generation Suggestions

### For Audio:
- Use AI voice generators for the ghostly whispers (female voice, ethereal tone)
- Generate ambient library sounds with AI music tools
- Create mystical sound effects for book interactions

### For Textures:
- Use AI image generators with prompts like:
  - "Gothic stone wall texture, dark aged stone, cracks, weathered"
  - "Mossy stone texture, ancient weathered stone with green moss"
  - "Ghostly energy texture, swirling purple ethereal particles, transparent"

## Implementation Notes

1. **Audio Integration:** All audio files are already referenced in the code with proper volume and loop settings
2. **Texture Integration:** Textures will need to be applied to materials in the environment.ts file
3. **Performance:** Keep file sizes reasonable (audio < 2MB each, textures < 1MB each)
4. **Testing:** Test all audio files in the Decentraland environment to ensure proper playback

## File Placement
Once you create these assets, place them in the correct directories as specified above. The code is already set up to load them from these locations.

## Quality Guidelines
- **Audio:** Clear, atmospheric, not too loud or jarring
- **Textures:** High enough resolution to look good up close, but optimized for web
- **Style:** Consistent gothic/mystical theme throughout
- **Performance:** Optimized for smooth playback in Decentraland
