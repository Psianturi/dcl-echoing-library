import ReactEcs, { UiEntity, Label, Button, Input } from "@dcl/sdk/react-ecs"
import { Color4 } from "@dcl/sdk/math"
import { getGameState, getLibrarianStory } from "./puzzleSystem"

// UI state
let showRiddle = false
let showStory = false
let currentGameState = getGameState()

// Update game state
export function updateUIState() {
  currentGameState = getGameState()
  showRiddle = currentGameState.activeRiddle !== ""
  showStory = currentGameState.puzzleCompleted
}

// Riddle display component
const RiddleDisplay = () => {
  if (!showRiddle) return null
  
  return (
    <UiEntity
      uiTransform={{
        width: '80%',
        height: '200px',
        positionType: 'absolute',
        position: { top: '10%', left: '10%' },
        justifyContent: 'center',
        alignItems: 'center'
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.8)
      }}
    >
      <Label
        value={currentGameState.activeRiddle}
        fontSize={24}
        color={Color4.create(0.8, 0.6, 1.0, 1.0)}
        uiTransform={{
          width: '90%',
          height: '80%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </UiEntity>
  )
}

// Progress indicator
const ProgressIndicator = () => {
  return (
    <UiEntity
      uiTransform={{
        width: '300px',
        height: '60px',
        positionType: 'absolute',
        position: { top: '20px', right: '20px' },
        justifyContent: 'center',
        alignItems: 'center'
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.6)
      }}
    >
      <Label
        value={`Books Found: ${currentGameState.foundCount}/${currentGameState.totalBooks}`}
        fontSize={18}
        color={Color4.create(1.0, 1.0, 1.0, 1.0)}
        uiTransform={{
          width: '90%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </UiEntity>
  )
}

// Instruction text
const InstructionText = () => {
  if (showRiddle || showStory) return null
  
  return (
    <UiEntity
      uiTransform={{
        width: '60%',
        height: '100px',
        positionType: 'absolute',
        position: { top: '70%', left: '20%' },
        justifyContent: 'center',
        alignItems: 'center'
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.5)
      }}
    >
      <Label
        value="Approach the glowing book in the center to hear its whisper..."
        fontSize={20}
        color={Color4.create(0.9, 0.9, 0.9, 1.0)}
        uiTransform={{
          width: '90%',
          height: '80%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </UiEntity>
  )
}

// Story modal
const StoryModal = () => {
  if (!showStory) return null
  
  return (
    <UiEntity
      uiTransform={{
        width: '90%',
        height: '80%',
        positionType: 'absolute',
        position: { top: '10%', left: '5%' },
        justifyContent: 'center',
        alignItems: 'center'
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.9)
      }}
    >
      <UiEntity
        uiTransform={{
          width: '95%',
          height: '90%',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Label
          value="The Librarian's Story"
          fontSize={28}
          color={Color4.create(0.8, 0.6, 1.0, 1.0)}
          uiTransform={{
            width: '100%',
            height: '60px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
        <Label
          value={getLibrarianStory()}
          fontSize={16}
          color={Color4.create(0.9, 0.9, 0.9, 1.0)}
          uiTransform={{
            width: '100%',
            height: '400px',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}
        />
        <Button
          value="Close"
          fontSize={18}
          color={Color4.create(0.6, 0.4, 0.8, 1.0)}
          uiTransform={{
            width: '120px',
            height: '40px'
          }}
          onMouseDown={() => {
            showStory = false
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

// Main UI component
export const ui = () => {
  updateUIState()
  
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        positionType: 'absolute',
        position: { top: 0, left: 0 }
      }}
    >
      <RiddleDisplay />
      <ProgressIndicator />
      <InstructionText />
      <StoryModal />
    </UiEntity>
  )
}
