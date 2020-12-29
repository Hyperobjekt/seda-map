import { useState, useEffect } from 'react'

// Ignore key presses when focus is on these element types
const ignoreElements = ['input']

export default function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    function downHandler({ key, target }) {
      if (
        ignoreElements.indexOf(target.tagName.toLowerCase()) > -1
      )
        return
      if (key === targetKey) {
        setKeyPressed(true)
      }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key, target }) => {
      if (
        ignoreElements.indexOf(target.tagName.toLowerCase()) > -1
      )
        return
      if (key === targetKey) {
        setKeyPressed(false)
      }
    }
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [targetKey]) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}
