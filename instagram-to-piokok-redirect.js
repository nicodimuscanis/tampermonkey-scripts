// ==UserScript==
// @name         Instagram to Pikok Redirect
// @namespace    nicodimus_canis
// @version      18.01.2025
// @description  Redirect Instagram profiles to Pikok profiles
// @author       nicodimus_canis
// @match        *://*.instagram.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// ==/UserScript==

(function() {
    'use strict';

    // Redirect if the URL matches Instagram's user profile pattern
    let currentUrl = window.location.href;
    let instagramUserMatch = currentUrl.match(/^https:\/\/www\.instagram\.com\/([^/?#&]+)\/?$/);

    if (instagramUserMatch) {
        let instagramUser = instagramUserMatch[1];
        let pikokUrl = `https://www.piokok.com/profile/${instagramUser}/`;
        window.location.replace(pikokUrl);
    }

    // Add an event listener to capture and redirect clicks on Instagram links
    document.addEventListener('click', function(e) {
        let target = e.target.closest('a');
        if (target && target.href && target.href.includes('instagram.com')) {
            let linkMatch = target.href.match(/^https:\/\/www\.instagram\.com\/([^/?#&]+)\/?$/);
            if (linkMatch) {
                e.preventDefault();
                let instagramUser = linkMatch[1];
                let pikokUrl = `https://www.piokok.com/profile/${instagramUser}/`;
                window.location.href = pikokUrl;
            }
        }
    });

})();
