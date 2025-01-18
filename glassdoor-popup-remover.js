// ==UserScript==
// @name         Glassdoor popup remover
// @description  Removes anoying popups on Glassdoor internet site
// @namespace    nicodimus_canis
// @version      18.01.2015
// @author       nicodims_canis
// @match        *://www.glassdoor.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glassdoor.com
// @grant        none
// ==/UserScript==

window.addEventListener('load', function() {
  let functions = [
    () => document.addEventListener("scroll", event => event.stopPropagation(), true),
    () => document.getElementById("ContentWallHardsell").remove(),
    () => document.getElementsByTagName('body')[0].style.removeProperty("overflow"),
    () => document.addEventListener("mousemove", event => event.stopPropagation(), true),
  ];
  functions.forEach(f => f());
});