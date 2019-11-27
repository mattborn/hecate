window.blog = (text) => {
  console.log('%c■ '+ text, 'color:#28f')
}
let scriptsLoaded = []

const externalDeps = [
  'https://cdn.jsdelivr.net/npm/jquery',
  'https://cdn.jsdelivr.net/npm/moment',
  'https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js',
]
injectExternalDeps(externalDeps)

function injectExternalDeps(scripts) {
  scripts.forEach(script => {
    const f = document.getElementsByTagName('script')[0]
    const j = document.createElement('script')
    j.defer = true
    j.onload = () => {
      scriptsLoaded.push(script)
      // console.log(externalDeps, scriptsLoaded, Date.now())
      if (externalDeps.length === scriptsLoaded.length) injectFirebaseLibs()
    }
    j.src = script
    f.parentNode.insertBefore(j,f)
  })
}

// duping code above as workaround for firebase-app not loading first
function injectFirebaseLibs() {
  const firebaseLibs = [
    'https://www.gstatic.com/firebasejs/7.5.0/firebase-analytics.js',
    'https://www.gstatic.com/firebasejs/7.5.0/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/7.5.0/firebase-database.js',
  ]
  firebaseLibs.forEach(script => {
    const f = document.getElementsByTagName('script')[0]
    const j = document.createElement('script')
    j.defer = true
    j.onload = () => {
      scriptsLoaded.push(script)
      // console.log(externalDeps, scriptsLoaded, Date.now())
      if (externalDeps.length + firebaseLibs.length === scriptsLoaded.length) allScriptsLoaded()
    }
    j.src = script
    f.parentNode.insertBefore(j,f)
  })
}

const appHeader = document.querySelector('.app-header .mat-toolbar')
const chuiHeader = document.createElement('div')
chuiHeader.id = 'Header'
appHeader.insertBefore(chuiHeader, appHeader.children[3])
const Header = document.getElementById('Header')

function allScriptsLoaded() {
  blog('All scripts loaded. Initializing…')

  firebase.initializeApp({
    apiKey: "AIzaSyC_-n9YBIOAnI6LOkIg_nD-4VbKr1UxP5g",
    authDomain: "hecate-work.firebaseapp.com",
    databaseURL: "https://hecate-work.firebaseio.com",
    projectId: "hecate-work",
    storageBucket: "hecate-work.appspot.com",
    messagingSenderId: "45682059855",
    appId: "1:45682059855:web:bbe1585244dcae79"
  })

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const handle = user.email.split('@')[0]
      const usersRef = firebase.database().ref('users/'+ handle)
      const myConnectionsRef = firebase.database().ref('users/'+ handle +'/connections')
      const lastOnlineRef = firebase.database().ref('users/'+ handle +'/lastOnline')
  
      firebase.database().ref('.info/connected').on('value', snap => {
        if (snap.val() === true) {
          usersRef.onDisconnect().set({status: 'offline'})
          usersRef.set({status: 'online'})
          let con = myConnectionsRef.push()
          con.onDisconnect().set({ended: firebase.database.ServerValue.TIMESTAMP})
          con.set({
            began: firebase.database.ServerValue.TIMESTAMP,
            userAgent: navigator.userAgent,
          })
          lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP)
        }
      })
      let button = document.createElement('button')
      button.innerText = 'Sign Out'
      button.onclick = () => { firebase.auth().signOut() }
      Header.innerHTML = ''
      Header.appendChild(button)
      render()
    } else {
      let button = document.createElement('button')
      button.innerText = 'Sign in with Google'
      button.onclick = () => { signIn() }
      Header.innerHTML = ''
      Header.appendChild(button)
    }
  })
}

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider).then(result => {
    // const token = result.credential.accessToken
    // const user = result.user
  }).catch(error => console.error)
}

function render() {
  const usersRef = firebase.database().ref('users')

  usersRef.on('value', snap => {
    console.log(snap.numChildren())
    snap.forEach(s => {
      console.log(s.key)
    })
  })
}