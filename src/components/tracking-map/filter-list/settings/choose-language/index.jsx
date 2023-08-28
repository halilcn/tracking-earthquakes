import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { LANGUAGES } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid'
import { earthquakeActions } from '../../../../../store/earthquake'
import { setLanguage } from '../../../../../utils/localStorageActions'
import './index.scss'

const ChooseLanguage = () => {
  const testid = constantsTestid.chooseLanguage

  const dispatch = useDispatch()
  const language = useSelector(state => state.earthquake.settings.language)

  const { t, i18n } = useTranslation()

  const handleChange = e => {
    const selectedLanguage = e.target.value

    dispatch(earthquakeActions.updateSettings({ language: selectedLanguage }))
    setLanguage(selectedLanguage)
    i18n.changeLanguage(selectedLanguage)
  }

  return (
    <div data-testid={testid.container}>
      <FormControl fullWidth>
        <InputLabel id="language">{t('Language')}</InputLabel>
        <Select size="small" labelId="language" value={language} label={t('Language')} onChange={handleChange}>
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
