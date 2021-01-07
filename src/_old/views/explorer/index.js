
import React from 'react'
import SedaPage from '../../components/seda/SedaPage';
import SedaExplorer from '../../components/seda/SedaExplorer';

const ExplorerView = () => (
    <SedaPage classes={{ 
      root: 'page--explorer', 
      main: 'page__body--explorer' 
    }}>
      <SedaExplorer />
    </SedaPage>
  )

export default ExplorerView
