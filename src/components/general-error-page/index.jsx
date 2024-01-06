import { useTranslation } from 'react-i18next'

import GeneralError from '../../../public/general-error.jpg'
import './index.scss'

const GeneralErrorPage = () => {
  const { t } = useTranslation()

  return (
    <div className="general-error">
      <div className="general-error__left">
        <div className="general-error__title">Opsssss......</div>
        <div className="general-error__info">{t('Something went wrong')}</div>
        <div className="general-error__info">{t('We are working on it and we will get it fixed as soon as possible')}</div>
      </div>
      <div className="general-error__right">
        <img className="general-error__error-img" src={GeneralError} />
      </div>
    </div>
  )
}

export default GeneralErrorPage
