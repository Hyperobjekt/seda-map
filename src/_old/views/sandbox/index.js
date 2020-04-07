// import React from 'react'

// import { Typography } from '@material-ui/core'
// import {
//   getChoroplethColorAtValue,
//   getValuePositionForVarName
// } from '../../shared/selectors'
// import DivergingBar from '../../components/molecules/DivergingBar'
// import StatDiverging from '../../components/molecules/StatDiverging.js'
// import { formatNumber } from '../../utils/index.js'
// import Callout from '../../components/molecules/Callout'
// import HelpIcon from '@material-ui/icons/Help'
// import { LocationStatDiverging } from '../../components/organisms/LocationPanel/LocationStats'

// const SandboxComponent = ({ heading, children }) => {
//   return (
//     <div className="sandbox__component">
//       <Typography className="sandbox__heading" variant="h3">
//         {heading}
//       </Typography>
//       {children}
//     </div>
//   )
// }

// const SandboxView = () => {
//   return (
//     <div className="sandbox">
//       <SandboxComponent heading="Typography">
//         <Typography variant="h1">Heading One</Typography>
//         <Typography variant="h2">Heading Two</Typography>
//         <Typography variant="h3">Heading Three</Typography>
//         <Typography variant="h4">Heading Four</Typography>
//         <Typography variant="h5">Heading Five</Typography>
//         <Typography variant="h6">Heading Six</Typography>
//         <Typography variant="subtitle1">Subtitle One</Typography>
//         <Typography variant="subtitle2">Subtitle Two</Typography>
//       </SandboxComponent>
//       <SandboxComponent heading="Help Callout">
//         <Callout type="help" icon={<HelpIcon />}>
//           How do average test scores impact educational opportunity?
//         </Callout>
//         <Callout
//           focusRipple={true}
//           type="help"
//           size="small"
//           icon={<HelpIcon />}>
//           How do average test scores impact educational opportunity?
//         </Callout>
//       </SandboxComponent>
//       <SandboxComponent heading="Diverging Bar">
//         <DivergingBar
//           minLabel="-3"
//           maxLabel="3"
//           position={-0.5 / 6}
//           value={-0.5}
//         />
//         <DivergingBar position={0.5 / 6} value={0.5} color={'#f00'} />
//       </SandboxComponent>
//       <SandboxComponent heading="Stat Diverging">
//         <StatDiverging
//           label="White"
//           minLabel="-3"
//           maxLabel="3"
//           position={0.5}
//           value={0.33}
//           color={getChoroplethColorAtValue((0.5 + 1) / 2)}
//         />
//         <StatDiverging
//           label="Black"
//           minLabel="-3"
//           maxLabel="3"
//           position={formatNumber(-0.6 * -0.5)}
//           value={0.66666666}
//           color={getChoroplethColorAtValue((-0.6 * -0.5 + 1) / 2)}
//         />
//         <StatDiverging
//           label="Asian"
//           minLabel="-3"
//           maxLabel="3"
//           position={null}
//           color={null}
//         />
//         <LocationStatDiverging
//           feature={{
//             properties: {
//               id: '12345',
//               all_ses: -0.5
//             }
//           }}
//           midPosition={getValuePositionForVarName(0, [-6, 2]) * 100 + '%'}
//           varName="all_ses"
//           range={[-6, 2]}
//           midPoint={0}
//           label="Offset"
//           minLabel="-6"
//           maxLabel="2"
//         />
//         <LocationStatDiverging
//           feature={{
//             properties: {
//               id: '12345',
//               all_ses: 0.65
//             }
//           }}
//           midPosition={'0%'}
//           varName="all_ses"
//           range={[0, 1]}
//           midPoint={0}
//           label="Positive"
//           minLabel="0"
//           maxLabel="1"
//         />
//       </SandboxComponent>
//     </div>
//   )
// }

// export default SandboxView
