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

  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider).then(result => {
    const token = result.credential.accessToken
    const user = result.user
    const handle = user.email.split('@')[0]

    const myConnectionsRef = firebase.database().ref('users/'+ handle +'/connections')
    const lastOnlineRef = firebase.database().ref('users/'+ handle +'/lastOnline')
    const connectedRef = firebase.database().ref('.info/connected')

    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {
        let con = myConnectionsRef.push()
        con.onDisconnect().remove()
        con.set({
          at: firebase.database.ServerValue.TIMESTAMP,
          userAgent: navigator.userAgent,
        })
        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP)
      }
    })
  }).catch(error => console.error)
}
