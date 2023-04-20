import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import store from './store/index.js'
import { Provider } from 'react-redux'

import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
