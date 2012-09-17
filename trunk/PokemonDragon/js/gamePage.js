//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved


//----------------------------------------------------------------------------

(function () {
    "use strict";

    function ready(element, options) {

        GameManager.state.config.currentPage = "/html/gamePage.html";

        // Stop previous loop if it is running already
        if (GameManager.gameId !== null) {
            stopGameLoop();
        }

        WinJS.UI.processAll(element)
            .done(function () {
                gamePage.enableAppBarGameButtons();

                if (GameManager.gameId === null) {
                    // Set up game area
                    GUpdateCanvasSize(gameCanvas);

                    // Initialize update loop
                    if (GameManager.state.config.frameRate > 0) {
                        updateTimer.reset(updateLoop, GameManager.state.config.frameRate);
                    }

                    // Initialize draw loop
                    GameManager.gameId = window.requestAnimationFrame(gamePage.renderLoop);

                    // Set up touch panel
                    GameManager.touchPanel.initialize(touchCanvas, GameManager.game.doTouch);

                    // set up keyboard hnd
                    GSetUpKeyboardHandler(
                        function (e) { GameManager.game.keyDown(e); },
                        function (e) { GameManager.game.keyUp(e); },
                        function (e) { GameManager.game.keyPress(e); });
                    
                    // Prepare game for first-time showing
                    GameManager.game.showFirst();

                    // Set up media query listeners
                    gamePage.setupMediaQueryListeners();
                }
            });
    }

    function unload(e) {
        gamePage.disableAppBarGameButtons();

        // Stop previous loop if it is running
        if (GameManager.gameId !== null) {
            stopGameLoop();
        }
    }

    // Handle showing and hiding game buttons from the app bar
    function enableAppBarGameButtons() {
        // TODO: Add any other game specific buttons here
        WinJS.Utilities.removeClass(document.getElementById("newgame"), "game-button");
        WinJS.Utilities.removeClass(document.getElementById("pause"), "game-button");
    }

    function disableAppBarGameButtons() {
        // TODO: Add any other game specific buttons here
        WinJS.Utilities.addClass(document.getElementById("newgame"), "game-button");
        WinJS.Utilities.addClass(document.getElementById("pause"), "game-button");
    }

    // Stop drawing loop for the game
    function stopGameLoop() {
        window.cancelAnimationFrame(GameManager.gameId);
        GameManager.gameId = null;
    }

    var updateTimer = new FrameTimer();

    function setupMediaQueryListeners() {
        var mql = matchMedia("all and (-ms-view-state: fullscreen-portrait)");
        mql.addListener(fullPortrait);

        var mql2 = matchMedia("all and (-ms-view-state: snapped)");
        mql2.addListener(snapListener);

        var mql3 = matchMedia("all and (-ms-view-state: filled)");
        mql3.addListener(unsnapListener);

        var mql4 = matchMedia("all and (-ms-view-state: fullscreen-landscape)");
        mql4.addListener(fullLandscape);
    }
 
    function unsnapListener(mql)
    {
        if ( !mql.matches ) { return; }
        if (GameManager.state.config.currentPage === "/html/gamePage.html") {
            GameManager.game.unsnap();
        }
    }
 
    function snapListener(mql)
    { 
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === "/html/gamePage.html") {
            GameManager.game.snap();
        }
    }

    function fullLandscape(mql) {
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === "/html/gamePage.html") {
            GameManager.game.fullLandscape();
        }
    }

    function fullPortrait(mql) {
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === "/html/gamePage.html") {
            GameManager.game.fullPortrait();
        }
    }

    function renderLoop() {
        if (typeof gameCanvas !== "undefined") {
            GameManager.game.draw();
            window.requestAnimationFrame(renderLoop);
        }
    }

    function updateLoop() {
        if (typeof gameCanvas !== "undefined") {
            GameManager.game.update();
        }
    }

    WinJS.UI.Pages.define("/html/gamePage.html", {
        ready: ready,
        unload: unload
    });

    WinJS.Namespace.define("gamePage", {
        renderLoop: renderLoop,
        updateLoop: updateLoop,
        updateTimer: updateTimer,
        setupMediaQueryListeners: setupMediaQueryListeners,
        enableAppBarGameButtons: enableAppBarGameButtons,
        disableAppBarGameButtons: disableAppBarGameButtons
    });

})();
