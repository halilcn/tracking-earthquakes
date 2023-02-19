import { CircularProgress } from '@mui/material'

import './index.scss'

const Loading = () => {
  return (
    <div className="laoding">
      <CircularProgress color="grey" size={60} />
    </div>
  )
}

export default Loading
