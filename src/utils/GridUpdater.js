import { useState, useEffect } from 'react'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

function constructGridState(cellSize) {

  const { width, height } = getWindowDimensions()

  // Calculate necessary dimensions for pathfinding grid
  const cellsY = Math.round(height / cellSize) - 4
  const cellsX = Math.round(width / cellSize) - 4

  // 2D grid of Cells
  const gridState = []

  // Construct the gridState object
  for (let y = 0; y < cellsY; y++) {
    gridState.push([])
    for (let x = 0; x < cellsX; x++)
      gridState[y].push('Empty')
  }

  return gridState
}

export default function useGridState(cellSize) {
  const [gridState, setGridState] = useState(constructGridState(cellSize))

  function resetGridState() {
    setGridState(constructGridState(cellSize))
    console.log('resetting grid')
  }

  useEffect(() => {
    resetGridState()

    window.addEventListener('resize', resetGridState)
    return () => window.removeEventListener('resize', resetGridState)
  }, [])

  

  return { gridState, setGridState, resetGridState }
}