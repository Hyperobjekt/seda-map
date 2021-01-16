import { useMediaQuery, useTheme } from "@material-ui/core"
import { useMemo } from "react"

export default function useIsMobile() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  return useMemo(() => {
    return mobile
  }, [mobile])
}