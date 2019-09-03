window.DEV = false // CHANGE TO FALSE BEFORE COMMITTING!

/**
 * Displays console logs with black hearts and blue text
 * 
 * @param {String} text any message you want to write to console
 */
window.blog = (text) => {
  console.log('%c🖤 '+ text, 'color:#28f')
}
blog('Hecate loaded')

/**
 * Just like it sounds
 */
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

/**
 * 
 * @param {*} filename only one file per call
 */
function injectStyles(filename) {
  const css = document.createElement('link')
  css.href = getSourceURL() + filename +'.css?v='+Date.now()
  css.rel = 'stylesheet'
  document.querySelector('head').appendChild(css)
}

(() => { // wrap everything in anonymous function for iteration

  const externalDeps = [
    'https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/6.5.0/firebase-database.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js',
    'https://unpkg.com/scrollreveal'
  ]
  const localDeps = [
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

// ☠️ nevermind all this 🔥 switching to Firebase
// /**
//  * Update global state, save localStorage, fire render event
//  * 
//  * @param {String} key 
//  * @param {*} value 
//  */
// window.updateState = (key, value) => {
//   // update global state
//   hecate[key] = value
//   // save localStorage
//   localStorage.setItem('hecate', JSON.stringify(hecate))
//   // fire render event
//   const render = new Event('render')
//   document.dispatchEvent(render)
// }
// document.addEventListener('render', () => blog('Render test'))

