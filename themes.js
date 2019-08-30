blog('Themes loaded');

(() => { // wrap everything in anonymous function for iteration

  function resetStyles() {
    // brute force removal of inline styles
    document.querySelectorAll('[style]').forEach(el => {
      el.style.backgroundColor = ''
      el.style.color = 'inherit'
    })
    document.body.style.color = ''
  }

  // const observer = new MutationObserver((mutationsList, observer) => {
  //   for (let mutation of mutationsList) {
  //     if (mutation.type === 'childList') {
  //       _.debounce(resetStyles, 500, true)
  //     }
  //   }
  // })
  // observer.observe(document.querySelector('.page-title'), {
  //   childList: true,
  //   subtree: true,
  // })

  resetStyles()
  injectStyles('reset')
  injectStyles('themes')

  const userRef = firebase.database().ref('hack/mborn')
  userRef.on('value', (snapshot) => {
    const data = snapshot.val()
    document.body.classList.remove('theme-Light', 'theme-Maria')
    document.body.classList.add('theme-'+ data.theme)
  })

})() // this executes the anonymous function wrapping everything