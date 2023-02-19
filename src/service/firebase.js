import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_CONFIG } from '../constants'

// Initialize Firebase
const app = firebase.initializeApp(FIREBASE_CONFIG)

export const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => auth.signInWithPopup(provider)
export const db = getFirestore(app)

export default firebase
