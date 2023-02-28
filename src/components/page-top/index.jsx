import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import { useSelector } from 'react-redux'
import { signInWithGoogle, auth as authFirebase } from '../../service/firebase'
import githubImage from '../../assets/github.png'

import './index.scss'

const PageTop = () => {
  const user = useSelector(state => state.user)
  const auth = user.auth
  const isLoadedAuthInformation = user.isLoadedAuthInformation

  const handleSignOut = () => {
    authFirebase.signOut()
  }

  return (
    <div className="app-top">
      <div className="app-top__github-link">
        <a href="https://github.com/halilcn/tracking-earthquakes" target="_blank">
          <img className="app-top__github-icon" src={githubImage} />
          <div className="app-top__github-text">Github</div>
        </a>
      </div>
      {!isLoadedAuthInformation ? (
        <Skeleton variant="rectangular" width={150} height={35} />
      ) : (
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
      )}
    </div>
  )
}

export default PageTop
