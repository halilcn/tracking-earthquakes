import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import { useSelector } from 'react-redux'
import { signInWithGoogle, auth as authFirebase } from '../../service/firebase'
import githubImage from '../../assets/github.png'
import { BiHelpCircle } from 'react-icons/bi'
import Popup from '../popup'

import './index.scss'
import { useState } from 'react'

const PageTop = () => {
  const user = useSelector(state => state.user)
  const auth = user.auth
  const isLoadedAuthInformation = user.isLoadedAuthInformation

  const [popupEnabled, setPopupEnabled] = useState(false)

  const handleSignOut = () => {
    authFirebase.signOut()
  }

  /*
          <>
          {auth && <div className="app-top__username">{auth.displayName}</div>}
          {auth !== null && (
            <Button onClick={handleSignOut} color="error" variant="contained">
              Logout
            </Button>
          )}
          {auth === null && (
            <Button onClick={signInWithGoogle} variant="contained">
              Login
            </Button>
          )}
        </>
 */

  return (
    <div className="app-top">
      <div className="app-top__github-link">
        <a href="https://github.com/halilcn/tracking-earthquakes" target="_blank">
          <img className="app-top__github-icon" src={githubImage} />
          <div className="app-top__github-text">Github</div>
        </a>
      </div>
      <div className="app-top__action-list">
        <BiHelpCircle onClick={() => setPopupEnabled(true)} className="app-top__action-item" />
      </div>
      <Popup title="Test Title Hey" enabled={popupEnabled} disableHandle={() => setPopupEnabled(false)}>
        popup içeriği!
      </Popup>
      {!isLoadedAuthInformation ? <Skeleton variant="rectangular" width={150} height={35} /> : <div />}
    </div>
  )
}

export default PageTop
