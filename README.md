## The Echoing Library

A haunted library where forgotten memories echo as ghostly whispers. Find three hidden books to reveal the librarian's story while exploring a gothic chamber with glowing effects and ambient audio.

Repository: `https://github.com/Psianturi/dcl-echoing-library`

### Features
- Gothic circular library built with SDK7 primitives
- Puzzle: locate 3 key books hidden around shelves
- Ambient audio cues and interactions on click
- Custom textures:
  - `assets/textures/stone_wall.png` for walls
  - `assets/textures/mossy_stone.png` for shelves and pedestal
  - `assets/textures/ghostly_energy.png` for glowing effects

### Project Structure
- `src/`
  - `index.ts`: entrypoint, wires environment, puzzle and audio
  - `environment-simple.ts`: constructs scene and applies textures
  - `environment.ts`: extended variant with materials and effects
  - `puzzleSystem.ts`: key-book interactions and completion logic
  - `audioManager.ts`: sound initialization and triggers
  - `ui.tsx`: in-world UI system
- `assets/`
  - `textures/`: PNG textures used by the scene
  - `asset-packs/`: GLB and composites used as props
- `scene.json`, `tsconfig.json`, `package.json`

---

## Local Development

### Prerequisites
- Node.js 18+
- Decentraland SDK 7 tooling (`@dcl/sdk` via project deps)

### Install
```bash
npm install
```

### Run in Preview
Use the Decentraland CLI (if you prefer) or run via your usual workflow. For SDK7 projects:
```bash
npm run build
npm run start
```
Then open the local preview URL printed in the terminal.

### Build
```bash
npm run build
```

---

## Using Decentraland Creator Hub

These steps outline creating, testing, and publishing via the Creator Hub UI.

1. Prepare assets according to `ASSET_SPECIFICATIONS.md` (textures placed under `assets/textures/`).
2. Ensure your scene compiles locally (`npm run build`) and previews correctly.
3. Commit and push your changes to GitHub.
4. Go to Decentraland Creator Hub and create a new project or open your existing one.
5. Connect your GitHub repository `Psianturi/dcl-echoing-library`.
6. Configure project metadata (title, description, thumbnail) as needed.
7. Run the web preview in Creator Hub to verify interactions (book clicks, audio, glow effects).
8. When ready, publish to Decentraland:
   - Select a world or a parcel deployment target
   - Review permissions (e.g., `ALLOW_TO_TRIGGER_AVATAR_EMOTE`, `ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE`)
   - Confirm and publish

> Tip: If you use Worlds, you can publish without owning land. If deploying to parcels, ensure you have rights to the target parcels.

---

## Controls & Interactions
- Click the central glowing book to hear the first whisper/riddle
- Explore shelves to find 3 key books; each click advances the puzzle
- After all books are found, the central story reveals


---