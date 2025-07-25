// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game constants
const GRAVITY = 0.5;
const FRICTION = 0.8;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;

// Game state
let gameState = 'playing'; // 'playing', 'gameOver', 'levelComplete'
let camera = { x: 0, y: 0 };
let score = 0;
let lives = 3;

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velX = 0;
        this.velY = 0;
        this.onGround = false;
        this.facingRight = true;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
    }
    
    update() {
        // Handle invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTimer--;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Horizontal movement
        if (keys['a'] || keys['arrowleft']) {
            this.velX = -MOVE_SPEED;
            this.facingRight = false;
        } else if (keys['d'] || keys['arrowright']) {
            this.velX = MOVE_SPEED;
            this.facingRight = true;
        } else {
            this.velX *= FRICTION;
        }
        
        // Jumping
        if ((keys['w'] || keys[' '] || keys['space']) && this.onGround) {
            this.velY = JUMP_FORCE;
            this.onGround = false;
        }
        
        // Apply gravity
        this.velY += GRAVITY;
        
        // Update position
        this.x += this.velX;
        this.y += this.velY;
        
        // Platform collision
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.collidesWith(platform)) {
                // Landing on top
                if (this.velY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velY = 0;
                    this.onGround = true;
                }
                // Hitting from below
                else if (this.velY < 0 && this.y > platform.y) {
                    this.y = platform.y + platform.height;
                    this.velY = 0;
                }
                // Hitting from sides
                else if (this.velX > 0 && this.x < platform.x) {
                    this.x = platform.x - this.width;
                    this.velX = 0;
                } else if (this.velX < 0 && this.x > platform.x) {
                    this.x = platform.x + platform.width;
                    this.velX = 0;
                }
            }
        });
        
        // Coin collision
        coins.forEach((coin, index) => {
            if (this.collidesWith(coin)) {
                coins.splice(index, 1);
                score += 100;
                updateScore();
            }
        });
        
        // Enemy collision
        enemies.forEach((enemy, index) => {
            if (this.collidesWith(enemy)) {
                if (!this.invulnerable) {
                    // Check if jumping on enemy
                    if (this.velY > 0 && this.y < enemy.y - 10) {
                        // Kill enemy
                        enemies.splice(index, 1);
                        this.velY = JUMP_FORCE * 0.5; // Small bounce
                        score += 200;
                        updateScore();
                    } else {
                        // Take damage
                        this.takeDamage();
                    }
                }
            }
        });
        
        // World boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > 1600 - this.width) this.x = 1600 - this.width;
        
        // Fall off the world
        if (this.y > canvas.height + 100) {
            this.takeDamage();
        }
        
        // Update camera to follow player
        camera.x = this.x - canvas.width / 2;
        if (camera.x < 0) camera.x = 0;
        if (camera.x > 1600 - canvas.width) camera.x = 1600 - canvas.width;
    }
    
    takeDamage() {
        if (!this.invulnerable) {
            lives--;
            this.invulnerable = true;
            this.invulnerabilityTimer = 120; // 2 seconds at 60 FPS
            
            // Reset position
            this.x = 50;
            this.y = 200;
            this.velX = 0;
            this.velY = 0;
            
            updateScore();
            
            if (lives <= 0) {
                gameState = 'gameOver';
            }
        }
    }
    
    collidesWith(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    draw() {
        ctx.save();
        
        // Flashing effect when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Draw Mario (simple rectangle with face)
        ctx.fillStyle = '#FF0000'; // Red body
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        
        // Mario's hat
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(this.x - camera.x + 2, this.y - camera.y, this.width - 4, 8);
        
        // Mario's face
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(this.x - camera.x + 4, this.y - camera.y + 8, this.width - 8, 16);
        
        // Eyes
        ctx.fillStyle = '#000';
        if (this.facingRight) {
            ctx.fillRect(this.x - camera.x + 12, this.y - camera.y + 12, 3, 3);
            ctx.fillRect(this.x - camera.x + 18, this.y - camera.y + 12, 3, 3);
        } else {
            ctx.fillRect(this.x - camera.x + 8, this.y - camera.y + 12, 3, 3);
            ctx.fillRect(this.x - camera.x + 14, this.y - camera.y + 12, 3, 3);
        }
        
        // Mustache
        ctx.fillRect(this.x - camera.x + 10, this.y - camera.y + 18, 12, 3);
        
        // Overalls
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.x - camera.x + 6, this.y - camera.y + 24, this.width - 12, 8);
        
        ctx.restore();
    }
}

// Platform class
class Platform {
    constructor(x, y, width, height, color = '#8B4513') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        
        // Add some texture
        ctx.fillStyle = '#654321';
        for (let i = 0; i < this.width; i += 20) {
            ctx.fillRect(this.x - camera.x + i, this.y - camera.y, 2, this.height);
        }
    }
}

// Coin class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.rotation = 0;
    }
    
    update() {
        this.rotation += 0.1;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x - camera.x + this.width/2, this.y - camera.y + this.height/2);
        ctx.rotate(this.rotation);
        
        // Gold coin
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Inner circle
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(-this.width/2 + 3, -this.height/2 + 3, this.width - 6, this.height - 6);
        
        ctx.restore();
    }
}

// Enemy class (Goomba-like)
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.velX = -1;
        this.velY = 0;
    }
    
    update() {
        this.x += this.velX;
        this.y += this.velY;
        
        // Apply gravity
        this.velY += GRAVITY;
        
        // Platform collision
        let onGround = false;
        platforms.forEach(platform => {
            if (this.collidesWith(platform)) {
                if (this.velY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velY = 0;
                    onGround = true;
                }
            }
        });
        
        // Reverse direction at edges or when hitting walls
        if (this.x <= 0 || this.x >= 1600 - this.width) {
            this.velX *= -1;
        }
        
        // Check for platform edges
        if (onGround) {
            let willFall = true;
            platforms.forEach(platform => {
                let futureX = this.x + this.velX * 10;
                if (futureX + this.width > platform.x && futureX < platform.x + platform.width &&
                    this.y + this.height >= platform.y && this.y + this.height <= platform.y + 10) {
                    willFall = false;
                }
            });
            if (willFall) {
                this.velX *= -1;
            }
        }
    }
    
    collidesWith(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    draw() {
        // Brown enemy body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - camera.x + 4, this.y - camera.y + 6, 4, 4);
        ctx.fillRect(this.x - camera.x + 16, this.y - camera.y + 6, 4, 4);
        
        // Angry eyebrows
        ctx.fillRect(this.x - camera.x + 3, this.y - camera.y + 4, 6, 2);
        ctx.fillRect(this.x - camera.x + 15, this.y - camera.y + 4, 6, 2);
        
        // Feet
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x - camera.x, this.y - camera.y + this.height, 8, 4);
        ctx.fillRect(this.x - camera.x + 16, this.y - camera.y + this.height, 8, 4);
    }
}

// Game objects
let player = new Player(50, 200);
let platforms = [];
let coins = [];
let enemies = [];

// Create level
function createLevel() {
    // Ground platforms
    platforms.push(new Platform(0, 350, 200, 50));
    platforms.push(new Platform(250, 350, 150, 50));
    platforms.push(new Platform(450, 350, 200, 50));
    platforms.push(new Platform(700, 350, 100, 50));
    platforms.push(new Platform(850, 350, 300, 50));
    platforms.push(new Platform(1200, 350, 400, 50));
    
    // Floating platforms
    platforms.push(new Platform(300, 250, 100, 20, '#228B22'));
    platforms.push(new Platform(500, 200, 80, 20, '#228B22'));
    platforms.push(new Platform(650, 150, 120, 20, '#228B22'));
    platforms.push(new Platform(900, 200, 100, 20, '#228B22'));
    platforms.push(new Platform(1100, 250, 80, 20, '#228B22'));
    platforms.push(new Platform(1300, 180, 100, 20, '#228B22'));
    
    // Coins
    coins.push(new Coin(320, 220));
    coins.push(new Coin(520, 170));
    coins.push(new Coin(680, 120));
    coins.push(new Coin(920, 170));
    coins.push(new Coin(1120, 220));
    coins.push(new Coin(1320, 150));
    coins.push(new Coin(280, 320));
    coins.push(new Coin(480, 320));
    coins.push(new Coin(780, 320));
    coins.push(new Coin(1400, 320));
    
    // Enemies
    enemies.push(new Enemy(300, 300));
    enemies.push(new Enemy(500, 300));
    enemies.push(new Enemy(800, 300));
    enemies.push(new Enemy(1000, 300));
    enemies.push(new Enemy(1300, 300));
}

// Update score display
function updateScore() {
    scoreElement.textContent = `Score: ${score} | Lives: ${lives}`;
}

// Draw background
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
        let cloudX = (i * 300 + 100 - camera.x * 0.3) % (canvas.width + 100);
        drawCloud(cloudX, 50 + i * 20);
    }
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FF0000';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'playing') {
        // Draw background
        drawBackground();
        
        // Update game objects
        player.update();
        coins.forEach(coin => coin.update());
        enemies.forEach(enemy => enemy.update());
        
        // Draw game objects
        platforms.forEach(platform => platform.draw());
        coins.forEach(coin => coin.draw());
        enemies.forEach(enemy => enemy.draw());
        player.draw();
        
        // Check win condition
        if (coins.length === 0) {
            gameState = 'levelComplete';
        }
        
    } else if (gameState === 'gameOver') {
        drawGameOver();
        
        // Restart game
        if (keys['r']) {
            restartGame();
        }
    } else if (gameState === 'levelComplete') {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText('Press R to Play Again', canvas.width / 2, canvas.height / 2 + 50);
        
        if (keys['r']) {
            restartGame();
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {
    player = new Player(50, 200);
    platforms = [];
    coins = [];
    enemies = [];
    score = 0;
    lives = 3;
    camera = { x: 0, y: 0 };
    gameState = 'playing';
    
    createLevel();
    updateScore();
}

// Initialize game
createLevel();
updateScore();
gameLoop();