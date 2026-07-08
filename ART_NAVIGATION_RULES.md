# Art as Navigation Rules

In the Infinite Encyclopedia, the user interface (UI) is mostly invisible. The environment itself—the lighting, architecture, physics, and artistic representation—serves as the navigation system.

## 1. Visual Affordances for Zooming

Users need to know *where* they can zoom in to find deeper knowledge.
- **The Glow of Depth:** Objects that contain child nodes emit a subtle, pulsating volumetric glow. The intensity of the glow correlates to the depth or density of the information within.
- **Micro-Detailing:** As a user approaches an object, macro textures fade into micro-geometry (e.g., a smooth stone reveals crystalline structures on close inspection), signaling that deeper layers exist.

## 2. Portals for Analogies and Concept Leaps

How do we represent relationships that aren't strictly parent/child?
- **Analogy Portals:** A shimmering, mirror-like surface embedded in the environment. Looking into it reveals a completely different biome/node. For example, within the "Human Heart" node, a portal might show a pumping "Steam Engine." Stepping through it acts as a hyper-link.
- **Bridges:** Physical bridges or pathways connecting two adjacent islands of knowledge (Lateral relationships).
- **Rivers / Energy Flows:** Flowing particles that trace cause-and-effect paths. Following a river of light from the "Sun" node leads directly to the "Earth's Atmosphere" node.

## 3. Gaussian Splat Integration

We utilize 3D Gaussian Splatting to bring real-world complexity into the engine without massive polygon overhead.
- **Authenticity:** Splats are used strictly for real-world artifacts (e.g., scanned museum sculptures, historical ruins, biological specimens).
- **Stylization Filter:** Because pure photorealism can clash with abstract data visualization, splats can be passed through a post-processing shader to stylize them (e.g., giving a classical sculpture a subtle wireframe overlay or a point-cloud dispersion effect on zoom).
- **Performance:** Splats must be cropped tightly to their bounding box. Background artifacts from the capture process must be cleaned up to prevent visual noise.

## 4. Visual Readability & Typography

Text is a necessary fallback, but it must not look like a traditional 2D web overlay.
- **Diegetic Text:** Text is embedded in the environment—carved into stone, written on floating parchment, or rendered as holographic light projections next to the object.
- **The "Inspector Lens":** For dense text (like a deep article), the user summons an "Inspector Lens"—a localized, readable UI plane that dynamically darkens the background behind it to ensure high contrast, regardless of the 3D environment's lighting.
- **Scale-Invariant Text:** As the user zooms, text does not scale linearly. It fades out and is replaced by child-node text to prevent overwhelming visual clutter.

## 5. Transitions and Scale Shifts

When zooming from a macro-node to a micro-node (e.g., Earth to a Forest), a hard cut is jarring.
- **The Dive (Continuous Zoom):** The camera rapidly accelerates toward the target.
- **Alpha Crossfade / LOD Swap:** The parent model dissolves into particle dust or wireframe, while the child environment materializes from the center outwards.
- **Focal Blur:** Heavy Depth of Field (DOF) is applied during the transition to mask LOD popping and simulate the physical feeling of a lens changing focus.

## 6. Color Theory and Semantic Meaning

Color is used systematically across the encyclopedia to categorize knowledge:
- **Warm colors (Reds/Oranges):** Physical sciences, thermodynamics, action, causality.
- **Cool colors (Blues/Teals):** Abstract mathematics, logic, structural systems.
- **Greens/Earthy tones:** Biology, ecology, organic systems.
- **Monochrome/Gold:** History, philosophy, human artifacts.
Users will subliminally learn to identify the "genre" of a node based on its ambient lighting.