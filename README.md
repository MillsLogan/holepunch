# DAT Hole Punch Practice
Holepunch is an interactive web playground for visualizing paper folds and punches, designed primarily for students preparing for the Perceptual Ability Test (PAT) section of the Dental Admission Test (DAT). Specifically, it focuses on the hole-punch problems, helping users build spatial reasoning skills by simulating folds and punches in real-time.

> Try it here: https://millslogan.github.io/Holepunch

## Features
* **Interactive Folding** — Click buttons to fold the paper horizontally, vertically, or diagonally.
* **Punch Placement** — Add punches to specific locations before or after folds.
* **Fold History** — View and scroll through the sequence of folds with a step-through interface to see how the paper unfolds.
* **Directional Controls** — Fold buttons are angled to visually indicate the fold direction; clicking on a particular side of the button folds the paper in that direction.
* **Instant Feedback** — Designed for fast visualization and study.

## Usage
1. **Folding the Paper:**
   - Use the directional buttons on the interface to add folds.

   - Buttons angled diagonally correspond to diagonal folds; horizontal and vertical folds use straight buttons.

   - The side of the button you press is the side the paper folds towards.

2. **Adding Punches:**
   - After folding, click on the grid to add punches.
   - Punches will propagate through the folds based on the folding history.

3. **Viewing the Fold History:**

   - Use the slide controls on the side to step forward or backward through the folds and see how the punches appear at each step.

4. **Reset Anytime:** Start fresh with a new sheet whenever you like.

## Installation (Optional)
You don’t need to install anything to use the playground — just visit the URL above.

For local development:

```bash
git clone https://github.com/yourusername/Holepunch.git
cd Holepunch/front
npm install
npm run dev
```

