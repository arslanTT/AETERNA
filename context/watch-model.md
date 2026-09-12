# Watch Model Reference

## File Information

- **Path**: `/public/models/watch.glb`
- **Size**: 1.69MB
- **Format**: GLB (Binary glTF)
- **Source**: Sketchfab (free download)

## Scale & Position

- **Original Height**: 17.388 units
- **Original Width**: 10.655 units
- **Original Depth**: 16.170 units
- **Center**: (0, -0.221, -0.255)
- **Target Scale**: `0.115` (results in ~2 units height)
- **Scaled Dimensions**: 1.23 × 2.00 × 1.86 units

## Model Statistics

- **Total Nodes**: 36
- **Total Meshes**: 15
- **Total Materials**: 8
- **Total Triangles**: ~21,000 (low poly, excellent performance)

## Part Groups (8 Logical Groups)

### 1. FinalStrap1 (Upper Chain)

- **Node Name**: `FinalStrap1`
- **Contains**: strapClip, FinalStrap1_1, FinalStrap2
- **Materials**: MenMetal2, MenMetal
- **Meshes**:
  - FinalStrap1_MenMetal2_0
  - FinalStrap1_MenMetal_0
- **Disassembly Direction**: Down + Back (0, -1.5, -1.5)

### 2. FinalStrap2 (Lower Chain)

- **Node Name**: `FinalStrap2`
- **Contains**: FinalStrap2_MenMetal2_0, FinalStrap2_MenMetal_0
- **Materials**: MenMetal2, MenMetal
- **Meshes**:
  - FinalStrap2_MenMetal2_0
  - FinalStrap2_MenMetal_0
- **Disassembly Direction**: Down + Forward (0, -1.5, 1.5)

### 3. strapClip (Clasp)

- **Node Name**: `strapClip`
- **Contains**: strapClip_MenMetal2_0
- **Material**: MenMetal2
- **Meshes**:
  - strapClip_MenMetal2_0
- **Disassembly Direction**: Down (0, -2.5, 0)

### 4. Watch (Main Case)

- **Node Name**: `Watch`
- **Contains**: watchShell, WatchshellTop, watchBottom, watchGlass
- **Materials**: Multiple (see below)
- **Meshes**:
  - watchShell_MenMetal2_0
  - watchShell_MenMetal_0
  - WatchshellTop_RIS_ShaderPxrDisney2_0
  - watchBottom_Plastic_0
  - watchGlass_Glass_0
- **Disassembly Direction**: Up (0, 1.5, 0)

### 5. Men (Dial + Hands)

- **Node Name**: `Men`
- **Contains**: hrHand1, hrHand, hrHand2, Pointers, CenterPart
- **Materials**: menWatchHands, MenSec, PointerTxt
- **Meshes**:
  - hrHand1_menWatchHands_0 (hour hand)
  - hrHand_menWatchHands_0 (minute hand)
  - hrHand2_MenSec_0 (second hand - blue)
  - Pointers_PointerTxt_0 (hour markers)
  - CenterPart_menWatchHands_0 (center pin)
- **Disassembly Direction**: Forward (0, 0, 1)

### 6. watchGlass (Transparent Cover)

- **Node Name**: `watchGlass`
- **Contains**: watchGlass_Glass_0
- **Material**: Glass
- **Meshes**:
  - watchGlass_Glass_0
- **Disassembly Direction**: Up (0, 2.5, 0)

### 7. watchBottom (Back Lid)

- **Node Name**: `watchBottom`
- **Contains**: watchBottom_Plastic_0
- **Material**: Plastic
- **Meshes**:
  - watchBottom_Plastic_0
- **Disassembly Direction**: Down (0, -1, 0)

### 8. WatchshellTop (Bezel)

- **Node Name**: `WatchshellTop`
- **Contains**: WatchshellTop_RIS_ShaderPxrDisney2_0
- **Material**: RIS_ShaderPxrDisney2
- **Meshes**:
  - WatchshellTop_RIS_ShaderPxrDisney2_0
- **Disassembly Direction**: Up Slightly (0, 0.5, 0)

## Materials

### Color-Changing Materials (Metal Parts)

| Material             | Original Color | Metalness | Roughness | Notes                                        |
| -------------------- | -------------- | --------- | --------- | -------------------------------------------- |
| MenMetal2            | #171717        | 1.0       | 0.2       | Main metal (straps, case)                    |
| MenMetal             | #000000        | 0.62      | 0.32      | Dark metal (straps, case) - HAS TEXTURE MAPS |
| RIS_ShaderPxrDisney2 | #31343f        | 0.39      | 0.2       | Bezel top                                    |

### Non-Changing Materials

| Material      | Color   | Metalness | Roughness | Notes                            |
| ------------- | ------- | --------- | --------- | -------------------------------- |
| Plastic       | #505050 | 0.09      | 1.0       | Back lid                         |
| Glass         | #ffffff | 1.0       | 0.11      | Transparent (opacity 0.27)       |
| menWatchHands | #ffffff | 0         | 0.2       | Hour/min hands (opacity 0.9)     |
| MenSec        | #007eff | 0         | 0.2       | Second hand - BLUE (opacity 0.9) |
| PointerTxt    | #000000 | 0         | 0         | Hour markers (opacity 0.36)      |

## Color Customization Options

### Strap/Chain Colors (Materials: MenMetal2, MenMetal)

- **Gold**: #D4AF37
- **Silver**: #C0C0C0
- **Rose Gold**: #B76E79
- **Black** (original): #171717 / #000000

### Bezel Colors (Material: RIS_ShaderPxrDisney2)

- **Gold**: #D4AF37
- **Silver**: #C0C0C0
- **Rose Gold**: #B76E79
- **Dark Grey** (original): #31343f

### Dial/Hands (NOT customizable)

- Dial stays original
- Hands stay original (white + blue second hand)
- Back lid stays original (dark grey)

## Texture Map Notes

- **MenMetal** material HAS texture maps (color, roughness, metalness)
- **MenMetal2** material HAS roughness and metalness maps
- When changing colors, texture maps may need to be temporarily disabled or blended
- Alternative: Set `mat.map = null` before changing color, restore after

## Animation Notes

### Disassembly

- All 8 groups animate from assembled to exploded positions
- Use smooth easing (cubic in-out, 500ms duration)
- All parts move simultaneously
- Reverse animation when reassembling

### Color Changes

- Smooth color interpolation over 500ms
- Use `color.lerpColors()` for smooth transitions
- Metalness/roughness can change instantly (less noticeable)

### Part Selection

- Hover: Slight scale up (1.05) or emissive highlight
- Selected: Move to center, scale up (1.2)
- Background parts: Blur (post-processing)

## Performance Notes

- **21,000 triangles** - very lightweight
- **15 meshes** - can easily render at 60fps
- **Texture maps** - increase memory slightly but acceptable
- **Post-processing** (blur, bloom) - should work fine on this model
- **Mobile** - may need to reduce texture resolution

## Known Issues

1. **Texture maps on MenMetal** - May interfere with color changes. Solution: Temporarily disable texture maps when changing colors.
2. **Hands are flat** (6 vertices each) - Not 3D hands, but acceptable for our use case.
3. **Dark original colors** - May not pop against dark background. Solution: Use lighter colors (gold, silver) or adjust lighting.
4. **Center offset** - Model center is slightly off (y: -0.22, z: -0.25). Need to center before scaling.

## Usage Example

```tsx
// Loading the model
const { scene, materials } = useGLTF("/models/watch.glb");

// Cloning for manipulation
const clonedScene = scene.clone(true);

// Scaling to target size
clonedScene.scale.set(0.115, 0.115, 0.115);

// Centering
clonedScene.position.set(0, 0.22, 0.25);

// Accessing parts
const strap1 = clonedScene.getObjectByName("FinalStrap1");
const strap2 = clonedScene.getObjectByName("FinalStrap2");
const watchBody = clonedScene.getObjectByName("Watch");
const dial = clonedScene.getObjectByName("Men");
const glass = clonedScene.getObjectByName("watchGlass");

// Changing colors
materials.MenMetal2.color.set("#D4AF37");
materials.MenMetal.color.set("#D4AF37");
materials.RIS_ShaderPxrDisney2.color.set("#D4AF37");
```
