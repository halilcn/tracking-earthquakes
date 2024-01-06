import { Component } from 'react'
import { useTranslation } from 'react-i18next'

import './index.scss'

const ErrorFallback = () => {
  const { t } = useTranslation()

  return <span className="error-text">{t('Something went wrong')}...</span>
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(err, info) {
    console.log('err', err)
    console.log('info', info)
  }

  render() {
    const { children } = this.props

    if (this.state.hasError) {
      const { ErrorFallbackComponent: _ErrorFallbackComponent } = this.props
      const ErrorFallbackComponent = _ErrorFallbackComponent || ErrorFallback

      return <ErrorFallbackComponent />
    }

    return children
  }
}

export default ErrorBoundary
