/* global chrome */
chrome.runtime.onMessage.addListener(function ({ url }) {
  window.location.assign(url)
})
