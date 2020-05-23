import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_DEV_FIRESTORE_API_KEY,
  authDomain: process.env.REACT_APP_DEV_FIRESTORE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_DEV_FIRESTORE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_DEV_FIRESTORE_DATABASE_URL,
  appId: process.env.REACT_APP_DEV_FIRESTORE_APP_ID
}

const handleError = error => {
  if (error.code === 'failed-precondition') {
    return {
      message: 'Error',
      description:
        'Multiple tabs open, persistence can only be enabled in one tab at a a time.'
    }
  } else if (error.code === 'unimplemented') {
    return {
      message: 'Error',
      description:
        'The current browser does not support all of the features required to enable persistenc'
    }
  }
}

firebase.initializeApp(config)
firebase
  .firestore()
  .enablePersistence()
  .then(() => firebase.firestore())
  .catch((err) => {
    handleError(err)
    firebase.firestore()
  })
const db = firebase.firestore()

export { firebase }

export default db
