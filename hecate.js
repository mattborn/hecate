window.DEV = false // CHANGE TO FALSE BEFORE COMMITTING!

console.log('%c🖤 Hecate loaded', 'color:#28f');

function getSourceURL() {
  return DEV ? 'http://localhost:1666/' : 'https://raw.githack.com/mattborn/hecate/master/'
}

/**
 * 
 * @param {Array} scripts list of full paths to js files
 */
function injectExternalDeps(scripts) {
  scripts.forEach(script => {
    const s = document.createElement('script')
    s.src = script
    document.body.appendChild(s)
  })
}

/**
 * 
 * @param {Array} scripts list of js file names
 */
function injectLocalDeps(scripts) {
  scripts.forEach(script => {
    const s = document.createElement('script')
    s.src = getSourceURL() + script +'.js?v='+Date.now() 
    document.body.appendChild(s)
  })
}

(() => { // wrap everything in anonymous function for iteration

  const externalDeps = [
    'https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/6.5.0/firebase-database.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js',
    'https://unpkg.com/scrollreveal'
  ]
  const localDeps = [
    'helpers',
    'persist',
    'personalize',
    'themes',
  ]

  injectExternalDeps(externalDeps)
  
  const waitForMoment = setInterval(() => {
    if (moment) {
      clearInterval(waitForMoment)
      console.log('%c🖤 Moment loaded @ '+ moment().format('h:mm:ss a'), 'color:#28f')
    }
  }, 100)

  // const waitForScrollReveal = setInterval(() => {
  //   const fadeUp = {
  //     distance: '30%',
  //     interval: 50,
  //     origin: 'bottom'
  //   }
  //   if (ScrollReveal) {
  //     ScrollReveal().reveal('.component-card', fadeUp)
  //   }
  // }, 100)

  const waitForFirebase = setInterval(() => {
    if (firebase) {
      clearInterval(waitForFirebase)
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyC_-n9YBIOAnI6LOkIg_nD-4VbKr1UxP5g",
        authDomain: "hecate-work.firebaseapp.com",
        databaseURL: "https://hecate-work.firebaseio.com",
        projectId: "hecate-work",
        storageBucket: "",
        messagingSenderId: "45682059855",
        appId: "1:45682059855:web:bbe1585244dcae79"
      }
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig)

      injectLocalDeps(localDeps)
      document.body.classList.add('hecate')
    }
  }, 100)

})() // this executes the anonymous function wrapping everything