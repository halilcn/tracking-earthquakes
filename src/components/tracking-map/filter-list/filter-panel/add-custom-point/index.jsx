import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../../../../store/earthquake'
import './index.scss'

const AddCustomPoint = () => {
  const dispatch = useDispatch()
  const isActiveCustomPointSelection = useSelector(state => state.earthquake.isActiveCustomPointSelection)
  const auth = useSelector(state => state.user.auth)

  const toggleAddCustomPoint = () => {
    dispatch(earthquakeActions.setIsActiveCustomPointSelection())
  }

  return (
    auth && (
      <div onClick={toggleAddCustomPoint} className="add-custom-point">
        <Button variant="outlined" {...(isActiveCustomPointSelection ? { color: 'error' } : {})}>
          {isActiveCustomPointSelection ? 'Vazgeç' : 'Nokta Ekle'}
        </Button>
      </div>
    )
  )
}

export default AddCustomPoint
