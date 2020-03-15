import React from 'react'
import { useTheme } from '@material-ui/core'
import SedaMap from './SedaMap'
import SedaScatterplot from './SedaScatterplot'
import SedaTooltip from './SedaTooltip'

export const Workspace = ({ children, view, ...props }) => {
  const theme = useTheme()
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        flexGrow: 1,
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
      <SedaTooltip />
      <div
        style={{
          width: view === 'split' ? '100%' : '200%',
          height: '100%',
          transform:
            view === 'chart'
              ? 'translateX(-50%)'
              : 'translateX(0)',
          display: 'flex',
          transition: theme.transitions.create(
            ['width', 'transform'],
            {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            }
          )
        }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%'
          }}>
          <SedaMap />
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            background: 'rgba(255,255,255,0.7)'
          }}>
          <SedaScatterplot />
        </div>
      </div>

      {children}
    </div>
  )
}
