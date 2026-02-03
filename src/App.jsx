import { useState } from 'react'
import './App.css'
import ColorPicker from './components/ColorPicker'
import GameBoard from './components/GameBoard'
import { generateGradient, getRandomColor, shuffleArray } from './utils/colorUtils'

function App() {
  const [gamePhase, setGamePhase] = useState('selection') // 'selection' or 'game'
  const [startColor, setStartColor] = useState('#ff6b6b')
  const [endColor, setEndColor] = useState('#4ecdc4')
  const [colorPool, setColorPool] = useState([])
  const [slots, setSlots] = useState(Array(24).fill(null))
  const [correctGradient, setCorrectGradient] = useState([]) // Store the correct order
  const [isValidating, setIsValidating] = useState(false) // Whether to show validation

  const handleConfirm = () => {
    // Generate 24 gradient colors
    const gradientColors = generateGradient(startColor, endColor, 24)
    
    // Store the correct order for validation
    setCorrectGradient(gradientColors)
    
    // Shuffle the colors for the pool
    const shuffledColors = shuffleArray(gradientColors)
    
    setColorPool(shuffledColors)
    setSlots(Array(24).fill(null))
    setIsValidating(false)
    setGamePhase('game')
  }

  const handleColorPlace = (color, slotIndex) => {
    // Remove color from pool
    const newPool = colorPool.filter((c, i) => {
      const firstIndex = colorPool.indexOf(color)
      return i !== firstIndex
    })
    
    // Place color in slot (replace if occupied)
    const newSlots = [...slots]
    if (newSlots[slotIndex] !== null) {
      // Return the old color to pool
      newPool.push(newSlots[slotIndex])
    }
    newSlots[slotIndex] = color
    
    setColorPool(newPool)
    setSlots(newSlots)
  }

  const handleColorRemove = (slotIndex) => {
    const color = slots[slotIndex]
    if (color) {
      // Return color to pool
      setColorPool([...colorPool, color])
      
      // Clear slot
      const newSlots = [...slots]
      newSlots[slotIndex] = null
      setSlots(newSlots)
    }
  }

  const handleSlotSwap = (fromIndex, toIndex) => {
    // Swap colors between two slots without affecting the pool
    const newSlots = [...slots]
    const temp = newSlots[fromIndex]
    newSlots[fromIndex] = newSlots[toIndex]
    newSlots[toIndex] = temp
    setSlots(newSlots)
  }

  const handleReset = () => {
    setGamePhase('selection')
    setColorPool([])
    setSlots(Array(24).fill(null))
    setCorrectGradient([])
    setIsValidating(false)
  }

  const handleRandomStart = () => {
    setStartColor(getRandomColor())
  }

  const handleRandomEnd = () => {
    setEndColor(getRandomColor())
  }

  const handleCheckAnswer = () => {
    setIsValidating(true)
  }

  const handleContinueEditing = () => {
    setIsValidating(false)
  }

  return (
    <div className="app">
      {gamePhase === 'selection' ? (
        <ColorPicker
          startColor={startColor}
          endColor={endColor}
          onStartColorChange={setStartColor}
          onEndColorChange={setEndColor}
          onRandomStart={handleRandomStart}
          onRandomEnd={handleRandomEnd}
          onConfirm={handleConfirm}
        />
      ) : (
        <GameBoard
          colorPool={colorPool}
          slots={slots}
          onColorPlace={handleColorPlace}
          onColorRemove={handleColorRemove}
          onSlotSwap={handleSlotSwap}
          startColor={startColor}
          endColor={endColor}
          onReset={handleReset}
          correctGradient={correctGradient}
          isValidating={isValidating}
          onCheckAnswer={handleCheckAnswer}
          onContinueEditing={handleContinueEditing}
        />
      )}
    </div>
  )
}

export default App
