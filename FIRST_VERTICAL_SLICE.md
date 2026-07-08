# First Vertical Slice: "The Journey of a Photon"

To prove the concept of the Infinite Encyclopedia, we will not build a wide, shallow wiki. Instead, we will build a single, extremely deep, fully playable vertical slice.

## The Concept

This slice demonstrates the fractal nature of knowledge, connecting macro-astrophysics directly to micro-biology and quantum mechanics through a continuous zoom.

**The Path:**
The Sun (Macro) → Earth (Meso) → A Forest (Meso) → A Leaf (Micro) → A Chloroplast (Micro) → Photosynthesis Simulation → A Single Photon (Quantum).

## User Experience Flow

1. **Node 1: The Sun (Start Point)**
   - **Visuals:** A massive, turbulent 3D simulation of a star.
   - **Interactivity:** User can manipulate time to see solar flares.
   - **Navigation:** A bright ray of light extends outward. The user is prompted to scroll/zoom along this ray.

2. **Node 2: Earth's Atmosphere**
   - **Transition:** A continuous, high-speed camera dive traversing 93 million miles, slowing down as it hits a blue sphere.
   - **Visuals:** Atmospheric scattering shader.
   - **Curiosity Path:** A lateral portal asks, "Why is the sky blue?" (Optional detour to Rayleigh Scattering).

3. **Node 3: The Forest Canopy**
   - **Transition:** Diving through clouds into a Gaussian Splat rendering of a real-world forest canopy (ensuring high fidelity without massive poly counts).
   - **Navigation:** One specific tree glows slightly. Zooming targets a specific green leaf.

4. **Node 4: The Leaf Surface to Cellular Level**
   - **Transition:** Scale shift. The macro texture of the leaf dissolves into a microscopic 3D landscape of stomata and plant cells.
   - **Visuals:** Stylized, electron-microscope-inspired rendering.

5. **Node 5: The Chloroplast & Photosynthesis**
   - **Transition:** Zooming inside a single plant cell into an organelle.
   - **Interactivity:** A live simulation. The user sees photons (particles of light) striking the thylakoid membrane. The user can adjust light intensity and watch the ATP production rate change.

6. **Node 6: The Photon (Quantum Level)**
   - **Transition:** Zooming into one of the incoming light particles.
   - **Visuals:** The rendering style changes entirely to abstract, wave-particle duality representations (glowing waves collapsing into points based on camera movement).

## Technical Implementation Steps

1. **Asset Procurement:**
   - Source or create a Gaussian splat for the forest/leaf level.
   - Create lightweight WebGL shaders for the Sun and Quantum levels.
2. **Camera Controller:**
   - Modify the `useZoom` hook to support true 3D spatial coordinate traversal, moving the camera through world-space rather than just scaling 2D planes.
3. **LOD System:**
   - Implement alpha-blending swaps so that as the camera enters the bounds of Node 2, Node 1 fades into a skybox/background element.
4. **Content Schema:**
   - Define these 6 nodes in `themes.json` (or the new graph DB) with their precise relative coordinates and scale factors.