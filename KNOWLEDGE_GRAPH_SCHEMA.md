# Knowledge Graph Schema

This document details the architecture of the Infinite Encyclopedia's knowledge graph. It defines how concepts (nodes) are structured, how they relate, and how a user navigates between them fractally.

## Fractal Architecture Overview

The system is fundamentally fractal. There is no absolute "top" or "bottom," but rather relative scales.

### Core Entities

1. **Worlds (Macro-level):**
   - Massive domains of knowledge. Examples: *The Physical Universe*, *Human History*, *Abstract Mathematics*.
   - Rendered as vast cosmic or landscape-scale environments.

2. **Themes (Meso-level):**
   - Sub-regions contained within Worlds. Examples: *The Renaissance*, *Fluid Dynamics*, *Cellular Biology*.
   - Rendered as localized environments, cities, or biomes.

3. **Nodes (Micro-level):**
   - Specific concepts, events, artifacts, or entities. Examples: *Leonardo da Vinci's Flying Machine*, *Bernoulli's Principle*, *A Mitochondrion*.
   - Rendered as highly detailed 3D objects, interactive simulations, or Gaussian Splat artifacts.

## Data Schema Definition

The graph can be thought of as a hypergraph where nodes have multi-dimensional relationships.

### The `Node` Object
```json
{
  "id": "uuid",
  "name": "Mitochondrion",
  "type": "NODE",
  "scale_level": -5, // Logarithmic scale representing relative size
  "content": {
    "title": "Mitochondrion",
    "description": "The powerhouse of the cell, generating most of the cell's supply of ATP.",
    "assets": [
      { "type": "splat", "url": "cdn://assets/mitochondrion.splat" },
      { "type": "simulation", "url": "cdn://sims/atp_synthesis.wasm" }
    ]
  },
  "coordinates": {
    "parent_id": "uuid_of_eukaryotic_cell",
    "local_position": { "x": 1.2, "y": 0.5, "z": -0.8 },
    "bounding_box": { "radius": 0.05 }
  }
}
```

### Relationship Types (Edges)

Edges are not just semantic links; they define physical navigation and visual metaphors.

1. **Parent / Child (Hierarchical)**
   - *Meaning:* "Is composed of" or "Contains".
   - *Navigation:* Zooming in/out.
   - *Example:* `Cell` (Parent) -> `Nucleus` (Child).

2. **Lateral (Spatial / Temporal)**
   - *Meaning:* "Occurs next to", "Happens after", or "Is adjacent".
   - *Navigation:* Panning left/right/up/down within the same scale.
   - *Example:* `France` (Lateral) <-> `Germany`. `1914` (Temporal Lateral) -> `1915`.

3. **Cause / Effect (Causal)**
   - *Meaning:* "Leads to" or "Is caused by".
   - *Navigation:* Following a visual flow (e.g., glowing particles, a river, a beam of light).
   - *Example:* `Heating Water` -> `Steam`.

4. **Prerequisite (Dependency)**
   - *Meaning:* "Must be understood before".
   - *Navigation:* A locked door or grayed-out path that requires visiting the prerequisite node first (optional gamification, usually just a strong visual recommendation).
   - *Example:* `Basic Algebra` -> `Calculus`.

5. **Analogy / Contrast (Conceptual)**
   - *Meaning:* "Is similar to" or "Is the opposite of".
   - *Navigation:* Portals or mirrors that instantly teleport the user across the graph.
   - *Example:* `Branches of a Tree` <-> `Human Blood Vessels`.

## Example: The Solar System to Quantum Level

```
[World: Physical Universe]
  └─ [Theme: Milky Way Galaxy]
      └─ [Theme: Solar System]
          ├─ [Node: The Sun]
          └─ [Node: Earth] (Zoom In)
              └─ [Theme: The Amazon Rainforest]
                  └─ [Node: A specific canopy tree]
                      └─ [Node: A single leaf] (Zoom In)
                          └─ [Theme: Plant Cell]
                              ├─ [Node: Nucleus]
                              └─ [Node: Chloroplast] (Zoom In)
                                  └─ [Simulation Node: Photosynthesis / Light Absorption]
                                      └─ [Node: A single Photon] (Zoom In)
                                          └─ [Theme: Quantum Mechanics]
```

## Traversing the Graph

The client application fetches nodes progressively.
- **On load:** Fetch current node, parent node, and lateral siblings.
- **On zoom threshold (e.g., scale > 0.8):** Prefetch child nodes of the target.
- **On portal hover:** Prefetch the destination node of the analogy/relationship edge.

This schema ensures that the knowledge graph is intrinsically tied to the spatial rendering engine, turning abstract concepts into explorable territory.