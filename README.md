# Super Mario Game

A classic Mario-style platformer game built with HTML5 Canvas and JavaScript.

## Features

- **Classic Mario Character**: Red-clad plumber with hat, mustache, and overalls
- **Physics Engine**: Realistic gravity, jumping, and collision detection
- **Multiple Platform Types**: Ground platforms and floating green platforms
- **Collectible Coins**: Spinning gold coins that rotate and give points
- **Enemies**: Goomba-style enemies that patrol platforms
- **Camera System**: Smooth camera that follows the player
- **Lives System**: 3 lives with invulnerability after taking damage
- **Score System**: Points for collecting coins and defeating enemies
- **Beautiful Graphics**: Sky gradient background with moving clouds
- **Win/Lose Conditions**: Complete the level by collecting all coins

## How to Play

### Controls
- **A/D Keys** or **Arrow Keys (←/→)**: Move left and right
- **W Key** or **Spacebar**: Jump
- **R Key**: Restart game (on game over or level complete screen)

### Gameplay
1. Navigate Mario through the level using the controls
2. Collect all **golden coins** to complete the level (100 points each)
3. Jump on **enemies** to defeat them (200 points each)
4. Avoid touching enemies from the side (causes damage)
5. Don't fall off the platforms!
6. Complete the level by collecting all coins

### Scoring
- **Coins**: 100 points each
- **Defeating Enemies**: 200 points each
- **Lives**: Start with 3 lives
- **Invulnerability**: 2 seconds after taking damage

## How to Run

1. Open `index.html` in any modern web browser
2. The game will start automatically
3. Use the controls to play!

## Game Mechanics

- **Gravity**: Realistic falling physics
- **Jumping**: Single jump with momentum
- **Collision**: Precise collision detection for platforms and objects
- **Enemy AI**: Enemies patrol platforms and turn around at edges
- **Camera**: Follows player smoothly across the level
- **Damage System**: Flashing invulnerability period after taking damage

## Technical Details

- **Canvas Size**: 800x400 pixels
- **Level Width**: 1600 pixels (scrolling level)
- **Frame Rate**: 60 FPS using requestAnimationFrame
- **No External Dependencies**: Pure HTML5, CSS3, and JavaScript

Enjoy playing the game!