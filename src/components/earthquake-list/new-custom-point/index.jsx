import { TextField, Button } from '@mui/material'
import dayjs from './../../../utils/dayjs'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postCustomPoint } from '../../../api'
import { earthquakeActions } from '../../../store/earthquake'
import { prepareCustomPoint } from '../../../utils'

import './index.scss'

const NewCustomPoint = () => {
  const dispatch = useDispatch()
  const selectedCoordinates = useSelector(state => state.earthquake.customPointCoordinates)
  const auth = useSelector(state => state.user.auth)

  const [description, setDescription] = useState('')

  const handleAddCustomPoint = async () => {
    const prepareParams = {
      coordinates: [selectedCoordinates.lng, selectedCoordinates.lat],
      date: dayjs(),
      username: auth.displayName,
      description,
    }
    const preparedCustomPoint = prepareCustomPoint(prepareParams)

    dispatch(earthquakeActions.addCustomPoints(preparedCustomPoint))
    dispatch(earthquakeActions.setIsActiveCustomPointSelection(false))

    await postCustomPoint(preparedCustomPoint)
  }

  return (
    <div className="new-custom-point">
      <div className="new-custom-point__item new-custom-point__item--title">Bir Nokta Ekle</div>
      <div className="new-custom-point__item new-custom-point__item--coordinates">
        <b>Koordinat:</b> [{selectedCoordinates?.lat.toFixed(2)} - {selectedCoordinates?.lng.toFixed(2)}]
      </div>
      <TextField
        onChange={e => setDescription(e.target.value)}
        className="new-custom-point__item new-custom-point__item--detail"
        label="Detay"
        size="small"
        maxRows={15}
        sx={{ input: { color: 'white' }, label: { color: 'white' }, fieldset: { borderColor: 'white' } }}
      />
      <Button onClick={handleAddCustomPoint} className="new-custom-point__item new-custom-point__item--save-button" variant="contained">
        Kaydet
      </Button>
    </div>
  )
}

export default NewCustomPoint
