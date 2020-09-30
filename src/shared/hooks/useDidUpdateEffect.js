import { useRef, useEffect } from 'react'

/**
 * Same as useEffect hook, but does not execute on mount, only subsequent changes
 * @param {*} fn
 * @param {*} inputs
 */
export default function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) fn()
    else didMountRef.current = true
  }, inputs)
}
