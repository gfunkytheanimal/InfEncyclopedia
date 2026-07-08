# The Infinite Encyclopedia Design Bible

## Core Vision
This is a living, educational exploration system where art, environment, zooming, spatial navigation, simulations, and semantic relationships are the fabric of learning. The artwork is not mere decoration; it is the fundamental navigation layer. The goal is to preserve curiosity, facilitating flow as users travel seamlessly across concepts from cosmic to microscopic scale—science, history, art, and philosophy—without hard boundaries or pages.

The system feels like *exploring a universe of knowledge*, rather than reading a website. It teaches by building immersive mental models. It reveals relationships visually, spatially, interactively, and emotionally. It is built for a 100-year horizon, designed as a fractal knowledge explorer for civilization.

---

## 1. Guiding Principles
- **Curiosity over Completion**: The goal is not to "finish" reading, but to inspire endless exploration.
- **Show, Don't Tell**: If a concept can be simulated, visualised, or experienced, it should be, instead of just described in text.
- **Art is Navigation**: Every scene, object, and transition carries semantic meaning. Finding the next node is an act of discovery, not clicking a hyperlink.
- **Fractal Depth**: No matter how deep you zoom, there is always more to discover.
- **Durability**: Architecture and data must be built to outlast current UI trends, preserving knowledge across generations.

## 2. What the Infinite Encyclopedia Is and Is Not
**It IS:**
- A spatial, 3D/2D zooming map of human knowledge.
- An interactive museum without walls.
- A semantic graph made visible and explorable.
- A procedural, AI-assisted living simulation.

**It is NOT:**
- A flat wiki or collection of disconnected web pages.
- A gamified trivia app.
- A linear textbook or course syllabus.
- A traditional search engine.

## 3. Core User Experience
The user is a traveler, an explorer in a vast, connected macrocosm. Navigation is intuitive: scrolling to zoom, dragging to pan, and rotating to inspect. There are no "loading screens" or "page jumps" in the traditional sense; transitions are smooth continuous zooms or portals. As a user investigates a topic (e.g., the Solar System), they might notice a glowing point of interest (e.g., Earth). Zooming into Earth reveals continents, a forest, a tree, a leaf, a cell, a chloroplast, down to the molecular level of photosynthesis, and finally the quantum behavior of a photon.

## 4. Fractal Knowledge Architecture
For deep dive, see [KNOWLEDGE_GRAPH_SCHEMA.md](./KNOWLEDGE_GRAPH_SCHEMA.md)

Knowledge is organized fractally, meaning concepts contain sub-concepts infinitely, mimicking reality. The architecture maps macro-topics as vast environments, and micro-topics as intricate details within them.
- **Macro**: The Universe, The Flow of Time, The Tree of Life.
- **Meso**: A 19th-century industrial city, a specific biome, a historical event.
- **Micro**: A steam engine, a specific species of fern, the structure of an atom.

## 5. Art-as-Navigation Rules
For deep dive, see [ART_NAVIGATION_RULES.md](./ART_NAVIGATION_RULES.md)

Artistic representation drives discovery. The visual design provides affordances for interaction. A glowing aura might indicate a deeper zoom is possible. A physical bridge between two islands of knowledge represents an analogy or causal link. The user learns the "grammar" of the visual world naturally.

## 6. Gaussian Splats / 3D Environment Usage
Volumetric rendering, particularly Gaussian Splatting, provides photorealistic, highly detailed 3D scenes without traditional polygon constraints. Splats are used for real-world artifacts (scanned historical sites, museum objects). By blending 3D models with splats, we create environments that feel grounded and tactile. Splats load progressively based on the zoom level, keeping performance high.

## 7. Node / Theme / World Structure
- **Worlds**: The highest level (e.g., "The Physical Universe", "Human History", "Abstract Mathematics").
- **Themes**: Regions within worlds (e.g., "The Renaissance", "Fluid Dynamics").
- **Nodes**: Specific concepts, artifacts, or ideas (e.g., "Leonardo da Vinci's Flying Machine", "Bernoulli's Principle").

## 8. Curiosity Paths and Natural Learning Trails
Trails are curated or emergent journeys through the graph.
*Example Path:*
Why are sunsets red? → Light scattering (Rayleigh scattering) → Earth's Atmosphere → Wavelengths of light → Electromagnetic waves → Quantum behavior of photons.
Users can leave "breadcrumbs" or "trail markers" for others to follow.

## 9. Zooming, Portals, Transitions, and Scale Shifts
Zooming is the primary verb. When zooming passes a threshold, a seamless transition—a "scale shift"—occurs, replacing the parent model with the child model through alpha blending, level-of-detail (LOD) swapping, or passing through a visual portal (like diving into a drop of water to enter the microscopic realm).

## 10. Concept Relationships
Relationships are not just lines on a graph; they are spatial and environmental.
- **Parent/Child**: Contained within (Cell -> Nucleus). Zoom in/out.
- **Lateral**: Located adjacent (France -> Germany). Pan left/right.
- **Cause/Effect**: Flowing particles, rivers, or time-lapses connecting nodes.
- **Analogy**: Portals or mirrors reflecting similar concepts in different domains (e.g., Tree branches <-> Blood vessels).

## 11. Simulations within Nodes
Nodes can contain active, running simulations rather than static text. A node on "Gravity" features a sandbox where the user can change mass and watch planetary orbits shift in real-time. A node on "Evolution" shows a simple genetic algorithm running.

## 12. Educational Psychology & "Show, Don't Tell"
The system applies principles of Constructivism—learners construct knowledge by experiencing it. By forcing the user to physically navigate from the "Atmosphere" to "Light Wavelengths," the brain spatializes the relationship, dramatically improving retention and intuitive understanding.

## 13. Visual Language and Readability
Text must integrate seamlessly into the environment—engraved on stone, glowing in the air, or revealed by a localized "inspector lens." UI must be minimal. Readability in VR/3D requires high contrast, legible typography, and avoiding text clutter.

## 14. Accessibility and Low-End Hardware Strategy
While the full experience is a rich 3D WebGL/WebGPU application, accessibility requires a fallback.
- **Graceful degradation**: Lower LODs, fewer splats, simplified shaders.
- **2D Mode**: A beautifully rendered 2D vector zooming interface (like an infinite canvas map) for ultra-low-end devices or screen readers.

## 15. AI Integration
- **Tutors**: Conversational agents embodied as localized guides.
- **Curators**: AI that suggests the next node based on your current trajectory.
- **Generators**: Procedural generation of connective tissue (e.g., landscapes between nodes).
- **Validators**: Automated fact-checking agents that cross-reference community edits against verified sources.

## 16. Creator Tools and Procedural Pipelines
A robust pipeline allows educators and artists to create nodes. Tools to convert text into semantic graphs, graphs into spatial layouts, and layouts into procedural 3D environments. Support for uploading 3D scans (splats) directly to nodes.

## 17. Content Governance, Factual Reliability, and Versioning
A Wikipedia-like governance model but for 3D/Spatial data. Edits are proposed, reviewed by domain experts, and merged. Versioning allows a user to roll back a node to see how our understanding of a topic has evolved over time (e.g., viewing the "Pluto" node pre- and post-2006).

## 18. Licensing and Asset Provenance
All assets (splats, textures, text) must have cryptographic or robust database provenance. Favor Creative Commons (CC-BY-SA) for educational public goods. Ensure museums providing splats retain attribution.

## 19. Technical Architecture Recommendations
- **Frontend**: React, Three.js, React Three Fiber, Luma Web (for splats).
- **Backend**: Distributed graph database (e.g., Neo4j or decentralized alternatives).
- **Asset Delivery**: Spatial CDN, progressive streaming of 3D tiles (e.g., 3D Tiles / OGC standards).
- **State Management**: Zustand or similar for local client traversal state.

## 20. Performance and Streaming Strategy
Never load the whole universe. Load only the current node, low-res proxies of neighbors, and the immediate parent. As the user zooms, aggressively cull out-of-view objects and stream in higher resolution LODs of the target node.

## 21. Roadmap
For deep dive, see [ROADMAP.md](./ROADMAP.md)
- **Prototype (Now)**: Basic zoom mechanic, 2-3 deep vertical slices.
- **1-Year**: Core engine, creator tools, first major "World" completed.
- **5-Year**: VR integration, global curriculum mapping, decentralized governance.
- **20-Year**: Standardized protocol for spatial knowledge; used in schools globally.
- **100-Year**: The definitive, durable archive of human knowledge, surviving technological platform shifts.

## 22. Risks, Failure Modes, and Anti-Patterns
- **The "Empty Universe"**: Too much space, too little content. (Solution: Procedural filler or tighter spacing).
- **Getting Lost**: Disorientation in 3D space. (Solution: Breadcrumbs, "return to surface" escape hatch).
- **High Friction**: Loading screens or lag breaking the flow. (Solution: Aggressive optimization and streaming).
- **Scope Creep**: Trying to build everything at once. (Solution: Focus on vertical slices).

## 23. First Playable Vertical Slice
For deep dive, see [FIRST_VERTICAL_SLICE.md](./FIRST_VERTICAL_SLICE.md)

A deep, narrow slice demonstrating the concept. e.g., "The Journey of a Photon" - from the Sun's core, across space, into Earth's atmosphere, into a leaf, triggering photosynthesis.

## 24. Implementation Notes & Next Tasks
**Current Implementation Notes:**
- The current React Three Fiber `<Canvas>` requires `gl={{ preserveDrawingBuffer: true }}` to support Playwright screenshots/testing properly without blank images.
- Current zooming prototype is 2D/pseudo-3D; requires an architectural shift to true 3D spatial nested coordinates.

**Next Tasks (Prioritized):**
1. Scaffold graph database schema for node linking.
2. Build the basic 3D nested coordinate system and LOD transition logic.
3. Integrate a basic 3D Gaussian splat as a node interior.
4. Implement the "Journey of a Photon" vertical slice.
