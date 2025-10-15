import { engine } from '@dcl/sdk/ecs'
import { PointerEvents, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { ui } from './ui'
import { createLibraryEnvironment } from './environment-simple'
import { createPuzzleSystem, handleBookClick } from './puzzleSystem'
import { initializeAudio, playRiddleWhisper, playBookOpenSound, playCompletionSound, updatePageTurnSounds } from './audioManager'

export function main() {
  // Initialize the gothic library environment
  const { centralBook, pedestal } = createLibraryEnvironment()
  
  // Initialize the puzzle system
  createPuzzleSystem(centralBook)
  
  // Initialize audio system
  initializeAudio()
  
  // Setup central book interaction for riddle display
  if (centralBook) {
    PointerEvents.create(centralBook, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            hoverText: "Touch the glowing book to hear its whisper..."
          }
        }
      ]
    })
  }
  
  // Setup click handlers for all entities
  engine.addSystem(() => {
    // This system will handle all pointer events
    for (const [entity] of engine.getEntitiesWith(PointerEvents)) {
      const pointerEvents = PointerEvents.get(entity)
      
      if (pointerEvents.pointerEvents) {
        for (const event of pointerEvents.pointerEvents) {
          if (event.eventType === PointerEventType.PET_DOWN) {
            // Handle central book click (show riddle)
            if (entity === centralBook) {
              playRiddleWhisper(0) // Play first riddle whisper
            } else {
              // Handle key book clicks
              handleBookClick(entity)
              playBookOpenSound()
            }
          }
        }
      }
    }
  })
  
  // Register UI system
  engine.addSystem(ui)
  
  // Add page turn sound system
  engine.addSystem(() => {
    updatePageTurnSounds()
  })
  
  console.log("The Echoing Library has been initialized. Find the three hidden books to uncover the librarian's story!")
}
