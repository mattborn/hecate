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
const chuiStatus = document.createElement('div')
chuiStatus.id = 'Status'
chuiStatus.onclick = () => { togglePresence() }
chuiHeader.appendChild(chuiStatus)
const chuiAction = document.createElement('div')
chuiAction.id = 'Action'
chuiHeader.appendChild(chuiAction)
appHeader.insertBefore(chuiHeader, appHeader.children[3])
// const Header = document.getElementById('Header')
const Status = document.getElementById('Status')
const Action = document.getElementById('Action')

const chuiPresence = document.createElement('div')
chuiPresence.id = 'Presence'
document.body.appendChild(chuiPresence)
const Presence = document.getElementById('Presence')

let me = ''

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
      const myUserRef = firebase.database().ref('users/'+ handle)
      const myConnectionsRef = firebase.database().ref('users/'+ handle +'/connections')
      const lastOnlineRef = firebase.database().ref('users/'+ handle +'/lastOnline')
      me = handle
  
      firebase.database().ref('.info/connected').on('value', snap => {
        if (snap.val() === true) {
          myUserRef.onDisconnect().update({status: 'offline'})
          myUserRef.set({
            pathname: location.pathname,
            status: 'online',
          })
          let con = myConnectionsRef.push()
          con.onDisconnect().update({ended: firebase.database.ServerValue.TIMESTAMP})
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
      Action.innerHTML = ''
      Action.appendChild(button)

      const usersRef = firebase.database().ref('users')
      usersRef.on('value', snap => { render(snap) })
    } else {
      let button = document.createElement('button')
      button.innerText = 'Sign in with Google'
      button.onclick = () => { signIn() }
      Action.innerHTML = ''
      Action.appendChild(button)
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

function render(snap) {
  // blog(snap.numChildren()+ ' total users')
  let numOnline = 0
  let noCollusion = []
  Presence.innerHTML = ''
  snap.forEach(s => {
    const val = s.val()
    const status = val.status
    if (status === 'online') numOnline++
    const User = document.createElement('div')
    User.className = 'Presence-User'
    User.classList.add(status)
    // left side
    const UserImage = document.createElement('div')
    UserImage.className = 'Presence-User-Image'
    User.appendChild(UserImage)
    // right side
    const UserInfo = document.createElement('div')
    UserInfo.className = 'Presence-User-Info'
    // top of right side
    const UserHead = document.createElement('div')
    UserHead.className = 'Presence-User-Head'
    const UserName = document.createElement('div')
    UserName.className = 'Presence-User-Name'
    UserName.innerText = s.key
    UserHead.appendChild(UserName)
    const UserTime = document.createElement('div')
    UserTime.className = 'Presence-User-Time'
    UserTime.textContent = moment(val.lastOnline).fromNow()
    UserHead.appendChild(UserTime)
    UserInfo.appendChild(UserHead)
    // bottom of right side
    const UserPath = document.createElement('div')
    UserPath.className = 'Presence-User-Path'
    UserPath.textContent = val.pathname
    UserPath.title = val.pathname
    UserInfo.appendChild(UserPath)
    User.appendChild(UserInfo)
    Presence.appendChild(User)
    // detect pathname collision
    if (s.key !== me && location.pathname === val.pathname) {
      document.body.classList.add('collision-detected')
    } else {
      noCollusion.push(s.key)
    }
  })
  if (noCollusion.length === snap.numChildren()) {
    document.body.classList.remove('collision-detected')
  }
  Status.innerText = numOnline === 1 ? 'Just you online' : numOnline +' users online'
}
document.addEventListener('click', () => {
  if (me) {
    setTimeout(() => {
      const myUserRef = firebase.database().ref('users/'+ me)
      myUserRef.set({pathname: location.pathname})
    }, 500)
  }
})

function togglePresence() {
  Presence.classList.toggle('visible')
}

/* inject first stylesheet */
const c = JSON.parse(localStorage.getItem('chui'))
const css = document.createElement('link')
css.href = (c ? c.src : 'https://cdn.jsdelivr.net/gh/mattborn/hecate')+ '/hecate-zeus.css'
css.rel = 'stylesheet'
document.querySelector('head').appendChild(css)