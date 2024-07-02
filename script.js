// Add event listener to the button to generate a new maze when clicked
document
  .getElementById("generate-maze-btn")
  .addEventListener("click", generateMaze);

// Get the canvas element and its 2D context for drawing
const canvas = document.getElementById("maze-canvas");
const ctx = canvas.getContext("2d");

// Define the number of rows and columns in the maze and the size of each cell
const rows = 20;
const cols = 20;
const cellSize = canvas.width / cols;

// Cell class represents each cell in the maze grid
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.walls = [true, true, true, true]; // Initially, all walls are present
    this.visited = false; // This flag helps in tracking the generation process
  }

  draw() {
    const x = this.col * cellSize;
    const y = this.row * cellSize;
    ctx.strokeStyle = "black";
    ctx.beginPath(); // Ensures each cell's lines are drawn separately

    // Draw walls based on the boolean values
    // Checking and drawing individual walls ensures flexible maze design
    if (this.walls[0]) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y); // top wall
    }
    if (this.walls[1]) {
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize); // right wall
    }
    if (this.walls[2]) {
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize); // bottom wall
    }
    if (this.walls[3]) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize); // left wall
    }

    ctx.stroke(); // Render the walls on the canvas
  }
}

// Function to generate a new maze
function generateMaze() {
  const grid = [];

  // Initialize the grid with cells
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(new Cell(r, c));
    }
    grid.push(row);
  }

  const stack = [];
  const start = grid[0][0]; // Start the maze generation from the top-left cell
  start.visited = true; // Mark the start cell as visited
  stack.push(start);

  // Depth-First Search with backtracking to generate the maze
  while (stack.length > 0) {
    const current = stack.pop();
    const next = getNextCell(grid, current);

    if (next) {
      stack.push(current); // Push current cell back to the stack for backtracking
      removeWalls(current, next); // Remove walls between current cell and the next cell
      next.visited = true; // Mark the next cell as visited
      stack.push(next); // Continue the process with the next cell
    }
  }

  // Clear entrance and exit
  grid[0][0].walls[3] = false; // Entrance (left wall of the top-left cell)
  grid[rows - 1][cols - 1].walls[1] = false; // Exit (right wall of the bottom-right cell)

  // Draw the generated maze
  drawMaze(grid);
}

// Function to get the next cell to visit during maze generation
function getNextCell(grid, cell) {
  const { row, col } = cell;
  const neighbors = [];

  // Collect all unvisited neighboring cells
  // This ensures that the maze generation explores new cells
  if (row > 0 && !grid[row - 1][col].visited)
    neighbors.push(grid[row - 1][col]);
  if (col < cols - 1 && !grid[row][col + 1].visited)
    neighbors.push(grid[row][col + 1]);
  if (row < rows - 1 && !grid[row + 1][col].visited)
    neighbors.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].visited)
    neighbors.push(grid[row][col - 1]);

  // Randomly choose one of the unvisited neighbors to continue the maze generation
  // Randomization helps in creating a different maze structure each time
  if (neighbors.length > 0) {
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  } else {
    return undefined; // No unvisited neighbors left
  }
}

// Function to remove walls between two adjacent cells
function removeWalls(current, next) {
  const x = current.col - next.col;
  const y = current.row - next.row;

  // Remove walls based on the relative positions of the cells
  // This connects the current cell with the next cell in the maze
  if (x === 1) {
    current.walls[3] = false;
    next.walls[1] = false;
  } else if (x === -1) {
    current.walls[1] = false;
    next.walls[3] = false;
  }

  if (y === 1) {
    current.walls[0] = false;
    next.walls[2] = false;
  } else if (y === -1) {
    current.walls[2] = false;
    next.walls[0] = false;
  }
}

// Function to draw the entire maze
function drawMaze(grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
  // Render each cell in the grid
  // Iterating through all cells ensures the entire maze is drawn
  grid.forEach((row) => row.forEach((cell) => cell.draw()));
}

// Generate an initial maze when the page loads
generateMaze();
