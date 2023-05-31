import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LANGUAGES } from '../../../../../constants'
import { getCurrentLanguage } from '../../../../../utils'
import { setLanguage } from '../../../../../utils/localStorageActions'
import './index.scss'

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage())
  const { t, i18n } = useTranslation()

  const handleChange = e => {
    const selectedLang = e.target.value
    setSelectedLanguage(selectedLang)
    setLanguage(selectedLang)
    i18n.changeLanguage(selectedLang)
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="language">{t('Language')}</InputLabel>
        <Select size="small" labelId="language" value={selectedLanguage} label={t('Language')} onChange={handleChange}>
          {Object.keys(LANGUAGES).map((languageKey, key) => (
            <MenuItem key={key} value={languageKey}>
              {LANGUAGES[languageKey]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default ChooseLanguage
