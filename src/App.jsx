import 'intro.js/introjs.css'
import ReactGA from 'react-ga'

import AppContainer from './components/app-container'
import './i18n'
import './styles/default.scss'

ReactGA.initialize(process.env.VITE_TRACKING_ID)

function App() {
  return <AppContainer />
}

export default App
