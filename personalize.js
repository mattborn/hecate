blog('Personalize loaded');

window.currentTheme = 0

function nextTheme() {
  const themes = ['Default', 'Light', 'Maria', 'Future']
  currentTheme++
  if (currentTheme > 3) currentTheme = 0
  setTheme({theme: themes[currentTheme]})
}

function setTheme(name) {
  const userRef = firebase.database().ref('hack/mborn')
  userRef.set({theme: name})
}

(() => { // wrap everything in anonymous function for iteration

  injectStyles('personalize')

  function ZeusHeader() {
    let search = document.createElement('div')
    search.className = 'hecate-search'
    let searchInput = document.createElement('input')
    searchInput.className = 'hecate-search-input'
    searchInput.placeholder = 'Search for anything…'
    search.appendChild(searchInput)

    let upgrade = document.createElement('div')
    upgrade.className = 'hecate-upgrade'
    let upgradeButton = document.createElement('button')
    upgradeButton.className = 'hecate-upgrade-button'
    upgradeButton.textContent = '⚡️ Try the New Zeus ✨'
    upgradeButton.addEventListener('click', nextTheme)
    upgrade.appendChild(upgradeButton)

    let menu = document.createElement('div')
    menu.className = 'hecate-menu'
    let menuAvatar = document.createElement('img')
    menuAvatar.className = 'hecate-menu-avatar'
    menuAvatar.src = 'https://api.adorable.io/avatars/40/mborn@artemishealth.com.png'
    menu.appendChild(menuAvatar)
    let menuName = document.createElement('span')
    menuName.className = 'hecate-menu-name'
    menuName.textContent = 'Test User'
    menu.appendChild(menuName)
    let menuChevron = document.createElement('i')
    menuChevron.className = 'hecate-menu-chevron fas fa-chevron-down'
    menu.appendChild(menuChevron)
    let menuOptions = document.createElement('div')
    menuOptions.className = 'hecate-menu-options'
    let menuOption1 = document.createElement('div')
    menuOption1.className = 'hecate-menu-option'
    menuOption1.textContent = 'Profile & Settings'
    menuOption1.addEventListener('click', () => {
      document.querySelector('.hecate-page-profile').style.display = 'block'
    })
    menuOptions.appendChild(menuOption1)
    let menuOption2 = document.createElement('div')
    menuOption2.className = 'hecate-menu-option'
    menuOption2.textContent = 'Sign Out'
    menuOptions.appendChild(menuOption2)
    menu.appendChild(menuOptions)

    let header = document.createElement('div')
    header.className = 'hecate-header'
    header.appendChild(search)
    header.appendChild(upgrade)
    header.appendChild(menu)

    if (!document.querySelector('.hecate-header')) {
      let toolbar = document.querySelector('.app-header .mat-toolbar')
      toolbar.insertBefore(header, toolbar.children[3])
    }
  }

  function profilePage() {
    let page = document.createElement('div')
    page.className = 'hecate-page-profile'

    let align = document.createElement('div')
    align.className = 'hecate-page-align'

    let back = document.createElement('button')
    back.textContent = '← Back to app'
    back.addEventListener('click', () => {
      document.querySelector('.hecate-page-profile').style.display = 'none'
    })
    align.appendChild(back)

    let title = document.createElement('h1')
    title.textContent = 'Hi! 👋🏼'
    align.appendChild(title)

    let leadLine = document.createElement('p')
    leadLine.textContent = 'Configure your profile settings below. Any changes will automatically be applied and saved.'
    align.appendChild(leadLine)

    let settingTitle1 = document.createElement('h2')
    settingTitle1.textContent = 'Choose a Theme'
    align.appendChild(settingTitle1)

    let themeSelect = document.createElement('select')
    themeSelect.addEventListener('change', (e) => {
      setTheme(e.currentTarget.value)
    })
    let themeOption1 = document.createElement('option')
    themeOption1.textContent = 'Light'
    themeOption1.value = 'Light'
    themeSelect.appendChild(themeOption1)
    let themeOption2 = document.createElement('option')
    themeOption2.textContent = 'Maria'
    themeOption2.value = 'Maria'
    themeSelect.appendChild(themeOption2)
    let themeOption3 = document.createElement('option')
    themeOption3.textContent = 'Future'
    themeOption3.value = 'Future'
    themeSelect.appendChild(themeOption3)
    align.appendChild(themeSelect) 

    page.appendChild(align)
    document.body.appendChild(page)
  }
  profilePage()

  function render() {
    if (location.hostname.split('.')[0].startsWith('zeus')) {
      ZeusHeader()
    } else {

    }
  }

  render()

})() // this executes the anonymous function wrapping everything