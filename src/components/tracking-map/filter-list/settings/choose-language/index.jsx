import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../../../../constants'
import { getLanguage, setLanguage } from '../../../../../utils/localStorageActions'

import './index.scss'

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(getLanguage() || DEFAULT_LANGUAGE)
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
        <InputLabel id="map-type">{t('Language')}</InputLabel>
        <Select
          size="small"
          className="map-type__select"
          labelId="map-type"
          value={selectedLanguage}
          label={t('Language')}
          onChange={handleChange}>
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
