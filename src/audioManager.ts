import { engine } from '@dcl/sdk/ecs'
import { AudioSource, AudioStream } from '@dcl/sdk/ecs'
import { Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { gameState, RIDDLES } from './environment-simple'

// Audio file placeholders - YOU will add these files
const AUDIO_FILES = {
  ambient: 'assets/sounds/ambient_library.mp3',
  whisper1: 'assets/sounds/whisper_riddle1.mp3',
  whisper2: 'assets/sounds/whisper_riddle2.mp3',
  whisper3: 'assets/sounds/whisper_riddle3.mp3',
  pageTurn: 'assets/sounds/page_turn.mp3',   
  bookOpen: 'assets/sounds/book_open.mp3',
  completion: 'assets/sounds/completion.mp3'
}

let ambientAudio: any = null
let whisperAudio: any = null
let pageTurnTimer: number = 0
let lastPageTurnTime: number = 0

export function initializeAudio() {
  // Create ambient background audio
  ambientAudio = engine.addEntity()
  AudioSource.create(ambientAudio, {
    audioClipUrl: AUDIO_FILES.ambient,
    loop: true,
    volume: 0.3,
    playing: true
  })

  // Create whisper audio entity (positional)
  whisperAudio = engine.addEntity()
  Transform.create(whisperAudio, {
    position: Vector3.create(0, 1.2, 0) // Central book position
  })
  AudioSource.create(whisperAudio, {
    audioClipUrl: AUDIO_FILES.whisper1,
    loop: false,
    volume: 0.6,
    playing: false
  })

  // Initialize page turn timer
  lastPageTurnTime = Date.now()
}

// Page turn system - called from main game loop
export function updatePageTurnSounds() {
  const currentTime = Date.now()
  const timeSinceLastPageTurn = currentTime - lastPageTurnTime
  
  // Play page turn sound every 15-30 seconds
  if (timeSinceLastPageTurn > (15000 + Math.random() * 15000)) {
    playPageTurnSound()
    lastPageTurnTime = currentTime
  }
}

function playPageTurnSound() {
  const pageTurnEntity = engine.addEntity()
  AudioSource.create(pageTurnEntity, {
    audioClipUrl: AUDIO_FILES.pageTurn,
    loop: false,
    volume: 0.4,
    playing: true
  })
  
  // Remove entity after sound plays (3 seconds)
  pageTurnTimer = 3000
}

export function playRiddleWhisper(riddleIndex: number) {
  if (!whisperAudio) return
  
  const whisperFiles = [AUDIO_FILES.whisper1, AUDIO_FILES.whisper2, AUDIO_FILES.whisper3]
  const audioSource = AudioSource.getMutable(whisperAudio)
  
  if (riddleIndex >= 0 && riddleIndex < whisperFiles.length) {
    audioSource.audioClipUrl = whisperFiles[riddleIndex]
    audioSource.playing = true
  }
}

export function playBookOpenSound() {
  const bookOpenEntity = engine.addEntity()
  AudioSource.create(bookOpenEntity, {
    audioClipUrl: AUDIO_FILES.bookOpen,
    loop: false,
    volume: 0.7,
    playing: true
  })
  
  // Remove entity after sound plays (2 seconds)
  // Note: In a real implementation, you'd track this entity for cleanup
  // For now, we'll let it play and the engine will handle cleanup
}

export function playCompletionSound() {
  const completionEntity = engine.addEntity()
  AudioSource.create(completionEntity, {
    audioClipUrl: AUDIO_FILES.completion,
    loop: false,
    volume: 0.8,
    playing: true
  })
  
  // Remove entity after sound plays (5 seconds)
  // Note: In a real implementation, you'd track this entity for cleanup
  // For now, we'll let it play and the engine will handle cleanup
}

export function stopAmbientAudio() {
  if (ambientAudio) {
    const audioSource = AudioSource.getMutable(ambientAudio)
    audioSource.playing = false
  }
  
  // Reset page turn timer
  lastPageTurnTime = 0
}

// Audio file specifications for AI generation
export const AUDIO_SPECIFICATIONS = {
  ambient_library: {
    description: "Looping background ambient sound for gothic library",
    duration: "2-3 minutes (seamless loop)",
    style: "Low humming, distant echoes, subtle wind, very quiet",
    volume: "Very low (background level)",
    format: "MP3, 44.1kHz, 128kbps"
  },
  whisper_riddle1: {
    description: "Ghostly whisper for first riddle",
    duration: "8-12 seconds",
    style: "Ethereal female voice, echoing, mysterious",
    volume: "Medium",
    format: "MP3, 44.1kHz, 128kbps"
  },
  whisper_riddle2: {
    description: "Ghostly whisper for second riddle", 
    duration: "8-12 seconds",
    style: "Ethereal female voice, echoing, mysterious",
    volume: "Medium",
    format: "MP3, 44.1kHz, 128kbps"
  },
  whisper_riddle3: {
    description: "Ghostly whisper for third riddle",
    duration: "8-12 seconds", 
    style: "Ethereal female voice, echoing, mysterious",
    volume: "Medium",
    format: "MP3, 44.1kHz, 128kbps"
  },
  page_turn: {
    description: "Occasional ambient page turning sound",
    duration: "1-2 seconds",
    style: "Paper rustling, page turning, subtle",
    volume: "Low",
    format: "MP3, 44.1kHz, 128kbps"
  },
  book_open: {
    description: "Sound when key book is opened",
    duration: "2-3 seconds",
    style: "Mystical book opening, magical chime, ethereal",
    volume: "Medium",
    format: "MP3, 44.1kHz, 128kbps"
  },
  completion: {
    description: "Final completion sound when all books found",
    duration: "4-6 seconds",
    style: "Triumphant mystical chime, ethereal choir, magical",
    volume: "Medium-High",
    format: "MP3, 44.1kHz, 128kbps"
  }
}
