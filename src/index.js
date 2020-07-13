import React from 'react'
import { render } from 'react-dom'
import theme from './theme'
import './index.css'
import SedaApp from './modules/explorer'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { DataLoader } from './modules/data'

const target = document.querySelector('#root')

// render(<DataLoader />, target)

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SedaApp />
  </ThemeProvider>,
  target
)
