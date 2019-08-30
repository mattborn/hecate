blog('Persist loaded');

(() => { // wrap everything in anonymous function for iteration

  // const persist = JSON.parse(localStorage.getItem('hecate'))

  const defaults = {

    route: '/',
    theme: 'Light',

  }

  // window.hecate = persist || defaults

  window.userRef = firebase.database().ref('hack/mborn')
  userRef.once('value').then((snapshot) => {
    if (!snapshot.exists()) userRef.set(defaults)
  })

})() // this executes the anonymous function wrapping everything