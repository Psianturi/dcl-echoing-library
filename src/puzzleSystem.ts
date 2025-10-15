import { engine } from '@dcl/sdk/ecs'
import { Transform, MeshRenderer, Material, PBMaterial, PBMaterial_UnlitMaterial } from '@dcl/sdk/ecs'
import { Vector3, Color3, Color4 } from '@dcl/sdk/math'
import { BoxShape } from '@dcl/sdk/ecs'
import { PointerEvents, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { gameState, RIDDLES, LIBRARIAN_STORY } from './environment-simple'

// Key book positions (answers to riddles)
const KEY_BOOK_POSITIONS = [
  { x: -5, z: -2, y: 2.5 }, // Mid-height shelf, left side (riddle 1)
  { x: 6, z: -6, y: 1.0 },  // Near glowing mushrooms, low shelf (riddle 2)
  { x: 2, z: 5, y: 4.5 }    // Top shelf, requires looking up (riddle 3)
]

let keyBooks: any[] = []
let centralBook: any = null

export function createPuzzleSystem(centralBookEntity: any) {
  centralBook = centralBookEntity
  
  // Create the three key books
  keyBooks = KEY_BOOK_POSITIONS.map((pos, index) => {
    return createKeyBook(pos, index)
  })

  // Setup central book interaction
  setupCentralBookInteraction()
}

function createKeyBook(position: Vector3, index: number) {
  const book = engine.addEntity()
  
  Transform.create(book, {
    position: Vector3.create(position.x, position.y, position.z),
    scale: Vector3.create(0.4, 0.05, 0.3)
  })
  
  MeshRenderer.create(book, {
    mesh: { $case: 'box', box: { uvs: [] } }
  })
  
  // Create a subtle glowing material for key books
  const bookMaterial = Material.createOrReplace(engine, {
    material: {
      $case: 'unlit',
      unlit: {
        color: Color4.create(0.6, 0.4, 0.8, 1.0),
        emissiveColor: Color3.create(0.1, 0.05, 0.2),
        emissiveIntensity: 0.3
      }
    }
  })
  
  Material.set(book, bookMaterial)
  
  // Add pointer events for interaction
  PointerEvents.create(book, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_PRIMARY,
          hoverText: `Examine the mysterious book...`
        }
      }
    ]
  })
  
  // Store book index for reference
  ;(book as any).bookIndex = index
  
  return book
}

function setupCentralBookInteraction() {
  if (!centralBook) return
  
  PointerEvents.create(centralBook, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_PRIMARY,
          hoverText: `Touch the glowing book to hear its whisper...`
        }
      }
    ]
  })
}

// Handle book click events
export function handleBookClick(entity: any) {
  if (!entity || entity.bookIndex === undefined) return
  
  const bookIndex = entity.bookIndex
  
  // Check if this book hasn't been found yet
  if (gameState.booksFound[bookIndex]) return
  
  // Mark book as found
  gameState.booksFound[bookIndex] = true
  
  // Play book opening effect
  playBookOpeningEffect(entity)
  
  // Check if all books are found
  const allBooksFound = gameState.booksFound.every(found => found)
  
  if (allBooksFound) {
    // Complete the puzzle
    completePuzzle()
  } else {
    // Move to next riddle
    advanceToNextRiddle()
  }
}

function playBookOpeningEffect(bookEntity: any) {
  // Create floating animation
  const transform = Transform.getMutable(bookEntity)
  const originalY = transform.position.y
  
  // Float up
  transform.position.y = originalY + 0.5
  
  // Create multiple ghostly particle effects
  for (let i = 0; i < 5; i++) {
    const effect = engine.addEntity()
    const offsetX = (Math.random() - 0.5) * 2
    const offsetZ = (Math.random() - 0.5) * 2
    const offsetY = Math.random() * 1 + 0.5
    
    Transform.create(effect, {
      position: Vector3.create(
        transform.position.x + offsetX, 
        transform.position.y + offsetY, 
        transform.position.z + offsetZ
      ),
      scale: Vector3.create(0.2, 0.2, 0.2)
    })
    
    MeshRenderer.create(effect, {
      mesh: { $case: 'sphere', sphere: {} }
    })
    
    const effectMaterial = Material.createOrReplace(engine, {
      material: {
        $case: 'unlit',
        unlit: {
          color: Color4.create(0.8, 0.6, 1.0, 0.6),
          emissiveColor: Color3.create(0.4, 0.2, 0.6),
          emissiveIntensity: 1.0
        }
      }
    })
    
    Material.set(effect, effectMaterial)
    
    // Remove effect after 3 seconds
    setTimeout(() => {
      engine.removeEntity(effect)
    }, 3000)
  }
  
  // Create swirling letters effect
  createSwirlingLetters(transform.position)
}

function advanceToNextRiddle() {
  if (gameState.currentRiddle < RIDDLES.length - 1) {
    gameState.currentRiddle++
    gameState.activeRiddle = RIDDLES[gameState.currentRiddle]
  }
}

function createSwirlingLetters(position: Vector3) {
  // Create swirling letter effects around the book
  for (let i = 0; i < 8; i++) {
    const letter = engine.addEntity()
    const angle = (i / 8) * Math.PI * 2
    const radius = 1.5
    
    Transform.create(letter, {
      position: Vector3.create(
        position.x + Math.cos(angle) * radius,
        position.y + 0.5,
        position.z + Math.sin(angle) * radius
      ),
      scale: Vector3.create(0.1, 0.1, 0.1)
    })
    
    MeshRenderer.create(letter, {
      mesh: { $case: 'box', box: { uvs: [] } }
    })
    
    const letterMaterial = Material.createOrReplace(engine, {
      material: {
        $case: 'unlit',
        unlit: {
          color: Color4.create(0.9, 0.7, 1.0, 0.8),
          emissiveColor: Color3.create(0.5, 0.3, 0.7),
          emissiveIntensity: 1.2
        }
      }
    })
    
    Material.set(letter, letterMaterial)
    
    // Remove letter after 4 seconds
    setTimeout(() => {
      engine.removeEntity(letter)
    }, 4000)
  }
}

function completePuzzle() {
  gameState.puzzleCompleted = true
  
  // Open the central book to reveal the story
  if (centralBook) {
    const transform = Transform.getMutable(centralBook)
    transform.scale.y = 0.3 // Make it appear "open"
    
    // Create a more dramatic effect
    const storyEffect = engine.addEntity()
    Transform.create(storyEffect, {
      position: Vector3.create(0, 2, 0),
      scale: Vector3.create(2, 2, 2)
    })
    
    MeshRenderer.create(storyEffect, {
      mesh: { $case: 'sphere', sphere: {} }
    })
    
    const storyMaterial = Material.createOrReplace(engine, {
      material: {
        $case: 'unlit',
        unlit: {
          color: Color4.create(1.0, 0.8, 1.0, 0.6),
          emissiveColor: Color3.create(0.6, 0.3, 0.8),
          emissiveIntensity: 1.2
        }
      }
    })
    
    Material.set(storyEffect, storyMaterial)
    
    // Remove effect after 5 seconds
    setTimeout(() => {
      engine.removeEntity(storyEffect)
    }, 5000)
  }
}

// Get current game state for UI
export function getGameState() {
  return {
    currentRiddle: gameState.currentRiddle,
    booksFound: gameState.booksFound,
    puzzleCompleted: gameState.puzzleCompleted,
    activeRiddle: gameState.activeRiddle,
    totalBooks: gameState.booksFound.length,
    foundCount: gameState.booksFound.filter(found => found).length
  }
}

// Get the librarian's story
export function getLibrarianStory() {
  return LIBRARIAN_STORY
}
