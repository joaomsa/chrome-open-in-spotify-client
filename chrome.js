/* global chrome */
import * as spotifyLink from './spotify-link.js'

const urls = {
  urls: spotifyLink.domains.map(d => `*://${d}/*`)
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  if (spotifyLink.leaveAlone(details.url)) return

  const spotifyUri = spotifyLink.createDesktop(details.url)
  if (!spotifyUri) return
  console.log('++++')
  console.log(details)
  console.log('++++')

  // If the current tab url is the same as the one initiating this
  // request it means this is a newly opened tab, so it is safe to
  // close the tab after Spotify has been opened.
  if (details.tabId >= 0) {
    chrome.tabs.get(details.tabId, function (tab) {
      console.log('going in!')
      // Firefox workaround: As of v84, when an link to an external protocol is
      // opened, Firefox requires confirmation from the user. There is no way
      // yet to detect if the user has handled the confirmation, so to prevent
      // an extra tab from hanging around we prematurely cancel and close this
      // one and have the tab where the click originated show the confirmation
      // dialog instead.
      // You can set security.external_protocol_requires_permission to false in
      // about:config to stop the confirmation prompt from showing
      if (tab.url === 'about:blank' && tab.openerTabId) {
        chrome.tabs.sendMessage(
          tab.openerTabId,
          { url: `spotify:${spotifyUri}` },
          function (resp) {
            chrome.tabs.remove(details.tabId)
          })
        return { cancel: true }
      }
    })
  }

  return {
    redirectUrl: `spotify:${spotifyUri}`
  }
}, urls, ['blocking'])
