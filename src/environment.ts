import { engine } from '@dcl/sdk/ecs'
import { Transform, MeshRenderer, Material, PBMaterial, PBMaterial_PbrMaterial, PBMaterial_UnlitMaterial } from '@dcl/sdk/ecs'
import { Vector3, Color3, Color4, Quaternion } from '@dcl/sdk/math'

// Game state interface
export interface GameState {
  currentRiddle: number
  booksFound: boolean[]
  puzzleCompleted: boolean
  activeRiddle: string
}

// Riddles and story content
export const RIDDLES = [
  "Where shadows dance with ancient light, and wisdom sleeps in endless night, seek the tome where silence screams, between the realms of waking dreams.",
  "In corners deep where fungi glow, the forgotten words continue to grow, where green meets stone and time stands still, a secret waits against your will.",
  "Above the ground where mortals tread, the highest shelf guards words long dead, climb with eyes toward heaven's door, where dust remembers evermore."
]

export const LIBRARIAN_STORY = "I was Elara, keeper of this sanctuary of stories. For forty years, I catalogued every whisper, every tale, every secret these walls would hold. On the night of the great fire, I refused to leave—how could I abandon my life's work? I stayed, sheltering three precious volumes: the Book of Forgotten Names, the Codex of Eternal Twilight, and the Chronicle of Silent Voices. The flames took my mortal form, but my devotion bound me here. Now I am the library, and the library is me. These three books hold fragments of my soul, scattered to protect them from oblivion. Find them, dear visitor, and you shall know my truth. Read my story, remember my name, and perhaps... I can finally rest."

// Initialize game state
export const gameState: GameState = {
  currentRiddle: 0,
  booksFound: [false, false, false],
  puzzleCompleted: false,
  activeRiddle: RIDDLES[0]
}

// Material definitions
export function createMaterials() {
  // Create material entities
  const stoneMaterialEntity = engine.addEntity()
  const mossyStoneMaterialEntity = engine.addEntity()
  const glowingMaterialEntity = engine.addEntity()
  const floorMaterialEntity = engine.addEntity()

  // Dark stone material for walls
  Material.createOrReplace(stoneMaterialEntity, {
    material: {
      $case: 'pbr',
      pbr: {
        albedoColor: Color4.create(0.2, 0.2, 0.25, 1.0),
        metallic: 0.1,
        roughness: 0.8,
        emissiveColor: Color3.create(0.0, 0.0, 0.0),
        emissiveIntensity: 0.0
      }
    }
  })

  // Mossy stone material
  Material.createOrReplace(mossyStoneMaterialEntity, {
    material: {
      $case: 'pbr',
      pbr: {
        albedoColor: Color4.create(0.15, 0.2, 0.1, 1.0),
        metallic: 0.05,
        roughness: 0.9,
        emissiveColor: Color3.create(0.0, 0.1, 0.0),
        emissiveIntensity: 0.1
      }
    }
  })

  // Glowing material for central book and mushrooms
  Material.createOrReplace(glowingMaterialEntity, {
    material: {
      $case: 'unlit',
      unlit: {
        diffuseColor: Color4.create(0.8, 0.6, 1.0, 1.0)
      }
    }
  })

  // Floor material
  Material.createOrReplace(floorMaterialEntity, {
    material: {
      $case: 'pbr',
      pbr: {
        albedoColor: Color4.create(0.1, 0.1, 0.12, 1.0),
        metallic: 0.0,
        roughness: 0.9,
        emissiveColor: Color3.create(0.0, 0.0, 0.0),
        emissiveIntensity: 0.0
      }
    }
  })

  return {
    stoneMaterial: stoneMaterialEntity,
    mossyStoneMaterial: mossyStoneMaterialEntity,
    glowingMaterial: glowingMaterialEntity,
    floorMaterial: floorMaterialEntity
  }
}

// Create the gothic library environment
export function createLibraryEnvironment() {
  const materials = createMaterials()
  
  // Create floor (circular)
  const floor = engine.addEntity()
  Transform.create(floor, {
    position: Vector3.create(0, 0, 0),
    scale: Vector3.create(14, 0.2, 14)
  })
  MeshRenderer.create(floor, {
    mesh: { $case: 'cylinder', cylinder: {} }
  })
  Material.createOrReplace(floor, {
    material: {
      $case: 'pbr',
      pbr: {
        albedoColor: Color4.create(0.1, 0.1, 0.12, 1.0),
        metallic: 0.0,
        roughness: 0.9,
        emissiveColor: Color3.create(0.0, 0.0, 0.0),
        emissiveIntensity: 0.0
      }
    }
  })

  // Create walls (circular arrangement of boxes)
  const wallHeight = 6
  const wallThickness = 0.5
  const radius = 7
  const numWalls = 16

  for (let i = 0; i < numWalls; i++) {
    const angle = (i / numWalls) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    
    const wall = engine.addEntity()
    Transform.create(wall, {
      position: Vector3.create(x, wallHeight / 2, z),
      scale: Vector3.create(wallThickness, wallHeight, 1.5),
      rotation: Quaternion.fromEulerDegrees(0, angle * 180 / Math.PI, 0)
    })
    MeshRenderer.create(wall, {
      mesh: { $case: 'box', box: { uvs: [] } }
    })
    Material.createOrReplace(wall, {
      material: {
        $case: 'pbr',
        pbr: {
          albedoColor: Color4.create(0.2, 0.2, 0.25, 1.0),
          metallic: 0.1,
          roughness: 0.8,
          emissiveColor: Color3.create(0.0, 0.0, 0.0),
          emissiveIntensity: 0.0
        }
      }
    })
  }

  // Create ceiling (dome-like structure)
  const ceiling = engine.addEntity()
  Transform.create(ceiling, {
    position: Vector3.create(0, wallHeight + 1, 0),
    scale: Vector3.create(15, 2, 15)
  })
  MeshRenderer.create(ceiling, {
    mesh: { $case: 'cylinder', cylinder: {} }
  })
  Material.createOrReplace(ceiling, {
    material: {
      $case: 'pbr',
      pbr: {
        albedoColor: Color4.create(0.2, 0.2, 0.25, 1.0),
        metallic: 0.1,
        roughness: 0.8,
        emissiveColor: Color3.create(0.0, 0.0, 0.0),
        emissiveIntensity: 0.0
      }
    }
  })

  // Create bookshelves (8 units around the walls)
  createBookshelves(materials)

  // Create central pedestal
  const pedestal = engine.addEntity()
  Transform.create(pedestal, {
    position: Vector3.create(0, 0.5, 0),
    scale: Vector3.create(1.5, 1, 1.5)
  })
  MeshRenderer.create(pedestal, {
    mesh: { $case: 'cylinder', cylinder: {} }
  })
  Material.createOrReplace(pedestal, {
    material: {
      $case: 'pbr',
      pbr: {
        albedoColor: Color4.create(0.15, 0.2, 0.1, 1.0),
        metallic: 0.05,
        roughness: 0.9,
        emissiveColor: Color3.create(0.0, 0.1, 0.0),
        emissiveIntensity: 0.1
      }
    }
  })

  // Create central glowing book
  const centralBook = engine.addEntity()
  Transform.create(centralBook, {
    position: Vector3.create(0, 1.2, 0),
    scale: Vector3.create(0.8, 0.1, 1.2)
  })
  MeshRenderer.create(centralBook, {
    mesh: { $case: 'box', box: { uvs: [] } }
  })
  Material.createOrReplace(centralBook, {
    material: {
      $case: 'unlit',
      unlit: {
        diffuseColor: Color4.create(0.8, 0.6, 1.0, 1.0)
      }
    }
  })

  // Create candelabras with flickering lights
  createCandelabras(materials)

  // Create glowing mushrooms in corners
  createGlowingMushrooms(materials)

  // Create scattered books on floor
  createScatteredBooks(materials)

  // Create dust particle effects
  createDustParticles()

  return {
    centralBook,
    pedestal,
    materials
  }
}

function createBookshelves(materials: any) {
  const shelfPositions = [
    { x: -5, z: -2, rotation: 0 },
    { x: -2, z: -5, rotation: Math.PI / 2 },
    { x: 2, z: -5, rotation: Math.PI / 2 },
    { x: 5, z: -2, rotation: 0 },
    { x: 5, z: 2, rotation: 0 },
    { x: 2, z: 5, rotation: Math.PI / 2 },
    { x: -2, z: 5, rotation: Math.PI / 2 },
    { x: -5, z: 2, rotation: 0 }
  ]

  shelfPositions.forEach((pos, index) => {
    const shelf = engine.addEntity()
    Transform.create(shelf, {
      position: Vector3.create(pos.x, 3, pos.z),
      scale: Vector3.create(2, 4, 0.3),
      rotation: Quaternion.fromEulerDegrees(0, pos.rotation * 180 / Math.PI, 0)
    })
    MeshRenderer.create(shelf, {
      mesh: { $case: 'box', box: { uvs: [] } }
    })
    Material.createOrReplace(shelf, {
      material: {
        $case: 'pbr',
        pbr: {
          albedoColor: Color4.create(0.15, 0.2, 0.1, 1.0),
          metallic: 0.05,
          roughness: 0.9,
          emissiveColor: Color3.create(0.0, 0.1, 0.0),
          emissiveIntensity: 0.1
        }
      }
    })
  })
}

function createCandelabras(materials: any) {
  const candelabraPositions = [
    { x: -3, z: -3 },
    { x: 3, z: -3 },
    { x: 3, z: 3 },
    { x: -3, z: 3 }
  ]

  candelabraPositions.forEach(pos => {
    const candelabra = engine.addEntity()
    Transform.create(candelabra, {
      position: Vector3.create(pos.x, 0.5, pos.z),
      scale: Vector3.create(0.3, 1, 0.3)
    })
    MeshRenderer.create(candelabra, {
      mesh: { $case: 'cylinder', cylinder: {} }
    })
    Material.createOrReplace(candelabra, {
      material: {
        $case: 'pbr',
        pbr: {
          albedoColor: Color4.create(0.2, 0.2, 0.25, 1.0),
          metallic: 0.1,
          roughness: 0.8,
          emissiveColor: Color3.create(0.0, 0.0, 0.0),
          emissiveIntensity: 0.0
        }
      }
    })
  })
}

function createGlowingMushrooms(materials: any) {
  const mushroomPositions = [
    { x: -6, z: -6 },
    { x: 6, z: -6 },
    { x: 0, z: 6 }
  ]

  mushroomPositions.forEach(pos => {
    const mushroom = engine.addEntity()
    Transform.create(mushroom, {
      position: Vector3.create(pos.x, 0.3, pos.z),
      scale: Vector3.create(0.8, 0.6, 0.8)
    })
    MeshRenderer.create(mushroom, {
      mesh: { $case: 'sphere', sphere: {} }
    })
    Material.createOrReplace(mushroom, {
      material: {
        $case: 'unlit',
        unlit: {
          diffuseColor: Color4.create(0.8, 0.6, 1.0, 1.0)
        }
      }
    })
  })
}

function createScatteredBooks(materials: any) {
  const bookPositions = [
    { x: -4, z: -1, rotation: 0.3 },
    { x: 2, z: -4, rotation: -0.2 },
    { x: 4, z: 1, rotation: 0.5 },
    { x: -1, z: 4, rotation: -0.4 },
    { x: 0, z: -2, rotation: 0.1 },
    { x: -3, z: 3, rotation: -0.3 }
  ]

  bookPositions.forEach(pos => {
    const book = engine.addEntity()
    Transform.create(book, {
      position: Vector3.create(pos.x, 0.05, pos.z),
      scale: Vector3.create(0.3, 0.05, 0.2),
      rotation: Quaternion.fromEulerDegrees(0, pos.rotation * 180 / Math.PI, 0)
    })
    MeshRenderer.create(book, {
      mesh: { $case: 'box', box: { uvs: [] } }
    })
    Material.createOrReplace(book, {
      material: {
        $case: 'pbr',
        pbr: {
          albedoColor: Color4.create(0.2, 0.2, 0.25, 1.0),
          metallic: 0.1,
          roughness: 0.8,
          emissiveColor: Color3.create(0.0, 0.0, 0.0),
          emissiveIntensity: 0.0
        }
      }
    })
  })
}

// Lighting will be handled by Decentraland's default lighting system

function createDustParticles() {
  // Create floating dust particles for atmosphere
  const dustCount = 20
  
  for (let i = 0; i < dustCount; i++) {
    const dust = engine.addEntity()
    const x = (Math.random() - 0.5) * 12
    const z = (Math.random() - 0.5) * 12
    const y = Math.random() * 4 + 1
    
    Transform.create(dust, {
      position: Vector3.create(x, y, z),
      scale: Vector3.create(0.1, 0.1, 0.1)
    })
    
    MeshRenderer.create(dust, {
      mesh: { $case: 'sphere', sphere: {} }
    })
    
    // Create subtle glowing dust material
    const dustMaterialEntity = engine.addEntity()
    Material.createOrReplace(dustMaterialEntity, {
      material: {
        $case: 'unlit',
      unlit: {
        diffuseColor: Color4.create(0.8, 0.8, 0.9, 0.3)
      }
      }
    })
    
    Material.createOrReplace(dust, {
      material: {
        $case: 'unlit',
      unlit: {
        diffuseColor: Color4.create(0.8, 0.8, 0.9, 0.3)
      }
      }
    })
  }
}
