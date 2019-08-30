/**
 * Displays console logs with black hearts and blue text
 * 
 * @param {String} text any message you want to write to console
 */
window.blog = (text) => {
  console.log('%c🖤 '+ text, 'color:#28f')
}
blog('Helpers loaded')

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

function injectStyles(filename) {
  const css = document.createElement('link')
  css.href = getSourceURL() + filename +'.css?v='+Date.now()
  css.rel = 'stylesheet'
  document.querySelector('head').appendChild(css)
}