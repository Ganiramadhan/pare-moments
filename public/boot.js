// Runs before the page is drawn (it is a separate file so the Content-Security-Policy can stay
// strict: no inline scripts).
;(function () {
  var root = document.documentElement

  // Apply the saved light/dark choice, so there is no flash of the wrong theme.
  try {
    var theme = localStorage.getItem('pare-moments:theme')
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme
  } catch (e) {}

  // Cover the page in the splash color until the opening screen takes over. The splash plays on
  // every load, except for people who prefer less motion.
  try {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) root.dataset.splash = 'pending'
  } catch (e) {}
})()
