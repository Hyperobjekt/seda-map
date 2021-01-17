import { useMediaQuery } from '@material-ui/core'
import { useMemo } from 'react'

export default function useMobileFooter() {
  const mobile = useMediaQuery('(max-width: 1024px)')
  return useMemo(() => {
    return mobile
  }, [mobile])
}
