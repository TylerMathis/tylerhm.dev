import PointSet from './PointSet'
import Queue from './Queue'

class BreadthFirstSearch {
  constructor(gridState, cellsX, cellsY) {

    // Metadata for search
    this.walls = []
    this.start = {}
    this.endsArray = []

    // Retrieve important metadata from gridState
    for (let y = 0; y < cellsY; y++)
      for (let x = 0; x < cellsX; x++)
        switch (gridState[y][x]) {
        case 'Wall':
          this.walls.push({x: x, y: y})
          break
        case 'Start':
          this.start.x = x
          this.start.y = y
          break
        case 'End':
          this.endsArray.push({x: x, y: y})
          break 
        }

    // Populate all obstacles
    this.obstacles = new PointSet()
    this.walls.forEach(wall => {
      this.obstacles.add(wall)
    })

    // Populate the ends
    this.ends = new PointSet()
    this.endsArray.forEach(end => {
      this.ends.add(end)
    })

    // Queue of paths, useful to backtrack
    this.queue = new Queue()
    this.queue.enqueue([this.start])

    // Set of visited nodes, fast lookup
    this.visitedSet = new PointSet()

    // Array of visited nodes, for rendering
    this.visited = []

    // Holds the y and x maximum bounds
    this.maxX = cellsX
    this.maxY = cellsY

    // Movement iterator
    this.dx = [-1, 0, 1, 0]
    this.dy = [0, -1, 0, 1]

    // Flag for finishing the pathing
    this.done = false
  }

  // Returns whether a new coord is valid
  valid(coord) {
    return (
      coord.x >= 0               && 
      coord.x < this.maxX        && 
      coord.y >= 0               && 
      coord.y < this.maxY        &&
      !this.obstacles.has(coord) &&
      !this.visitedSet.has(coord)
    )
  }

  isEnd(coord) {
    return this.ends.has(coord)
  }

  clock() {
    // If there is nothing left to search, stop
    if (this.queue.isEmpty()) {
      this.done = true
      this.path = []
    }

    // We are done, don't clock
    if (this.done) {
      console.error('Clocked a finished pathfinder, aborting...')
      return
    }

    // Clear the current visited array for visualization
    this.visited = []

    // Get current working path
    const path = this.queue.dequeue()
    // Find last node in path
    const node = path[path.length - 1]

    for (let i = 0; i < 4; i++) {
      const adjNode = {
        x: node.x + this.dx[i],
        y: node.y + this.dy[i],
      }

      if (!this.valid(adjNode)) continue
      if (this.isEnd(adjNode)) {
        this.done = true
        this.path = path
        return
      }

      this.visitedSet.add(adjNode)
      this.visited.push(adjNode)

      const newPath = [...path]
      newPath.push(adjNode)
      this.queue.enqueue(newPath)
    }
  }
}

export default BreadthFirstSearch