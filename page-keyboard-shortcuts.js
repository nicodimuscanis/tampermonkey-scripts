// ==UserScript==
// @name         Open Links, Focus Inputs and Buttons by Keyboard (with auto-hide shortcuts)
// @namespace    nicodimus_canis
// @version      18.01.2025
// @description  Adds alphanumeric shortcuts to links, input fields, and buttons with auto-hide on focus change
// @author       nicodimus_canis
// @match        *://*/*
// @grant        none
// ==/UserScript==

// USAGE: 1. press "\" button to show or hide shortlinks on a page,
//        2. press the button corredponds to a link or input field to navigate
(function () {
    'use strict';

    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let currentIndex = 0;

    const elementMap = {}; // Карта соответствия символов элементам (ссылкам, полям ввода и кнопкам)
    let shortcutsVisible = false; // Флаг для контроля отображения ярлыков
    let badges = []; // Список всех созданных ярлыков

    function isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
            rect.top >= 0 && rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }

    function toggleShortcuts() {
        if (shortcutsVisible) {
            // Скрыть символы
            badges.forEach(badge => badge.remove());
            badges = [];
            shortcutsVisible = false;
        } else {
            // Показать символы
            currentIndex = 0; // Сбросить индекс к началу
            const elements = Array.from(document.querySelectorAll('a, input, textarea, button'));
            elements.forEach(element => {
                if (!isElementVisible(element)) return; // Пропускаем невидимые элементы
                if (currentIndex >= validChars.length) return; // Больше символов нет

                const shortcut = validChars[currentIndex++];
                const badge = document.createElement('span');
                badge.textContent = ` [${shortcut}]`;
                badge.style.color = 'red';
                badge.style.fontWeight = 'bold';
                badge.style.marginLeft = '5px';
                badge.style.cursor = 'pointer';
                badge.style.fontSize = '10px'; // размер
                badge.style.backgroundColor = 'white'; // фон
                badge.style.padding = '2px'; // внутренние отступы
                badge.style.borderRadius = '3px'; // скруглённые углы
                badge.style.boxShadow = '0px 1px 3px rgba(0, 0, 0, 0.2)'; // лёгкая тень
                badge.className = 'tampermonkey-shortcut';

                if (element.tagName === 'A') {
                    badge.addEventListener('click', () => element.click()); // клик по значку открывает ссылку
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    badge.addEventListener('click', () => element.focus()); // клик переводит фокус на поле ввода
                } else if (element.tagName === 'BUTTON') {
                    badge.addEventListener('click', () => element.click()); // клик по значку нажимает кнопку
                }

                element.after(badge);
                badges.push(badge);
                elementMap[shortcut] = element;
            });
            shortcutsVisible = true;
        }
    }

    function isFocusOnInputField() {
        const activeElement = document.activeElement;
        return (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    }

    // Обрабатываем нажатия клавиш
    document.addEventListener('keydown', (e) => {
        if (e.key === '\\') {
            if (!isFocusOnInputField()) {
                toggleShortcuts(); // Показать/скрыть ярлыки при нажатии на '\', если фокус не на поле ввода
            }
        } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(e.key)) {
            if (shortcutsVisible) toggleShortcuts(); // Скрыть ярлыки при навигации
        } else if (shortcutsVisible && elementMap[e.key]) {
            e.preventDefault();
            const element = elementMap[e.key];
            if (element.tagName === 'A') {
                element.click(); // Открыть ссылку
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.focus(); // Перевести фокус на поле ввода
            } else if (element.tagName === 'BUTTON') {
                element.click(); // Нажать кнопку
            }
        }
    });

    // Скрыть ярлыки, если фокус переведён на поле ввода
    document.addEventListener('focusin', (e) => {
        if (isFocusOnInputField() && shortcutsVisible) {
            // Если фокус на поле ввода, скрыть ярлыки
            toggleShortcuts();
        }
    });
})();
