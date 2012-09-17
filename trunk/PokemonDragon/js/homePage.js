// Exception Team
// Game UIT club
// 2012


(function () {
    "use strict";

    function ready(element, options) {

        GameManager.state.config.currentPage = "/html/homePage.html";

        var context;
        var animationId;

        var MAX_LOAD = 4;
        var loaded = 0;
        var PLAY = GRect(177, 473, 250, 200);
        function end(e) {
            if (GIsSnapped()) {
                return;
            }

            //
            // Not need right mouse
            if (e.button == 2)
                return;

            if (PLAY.contain(e.x, e.y)) {
                GPlaySound(GameManager.assetManager.assets.sndBounce, true);
                GameManager.navigateGame();
            }
        }

        var hoverPlay = false;
        function move(e) {
            if (GIsSnapped()) {
                return;
            }

            //
            if (PLAY.contain(e.x, e.y)) {
                if (hoverPlay != true) {
                    hoverPlay = true;
                    GDrawImage(context, GameManager.assetManager.assets.imgPlayButtonOver.object, PLAY.x, PLAY.y);
                }
            } else {
                if (hoverPlay != false) {
                    hoverPlay = false;
                }
            }
        }

        function Draw(time) {
            if (typeof homeCanvas !== "undefined") {
                context = homeCanvas.getContext("2d");
                //
                GUpdateCanvasSize(homeCanvas);
                //
                GClear(context);
                GFill(context, "black");

                if (!GIsSnapped()) {
                    GDrawImage(context, GameManager.assetManager.assets.imgBgMenu.object, 0, 0);
                    //
                    if(hoverPlay)
                        GDrawImage(context, GameManager.assetManager.assets.imgPlayButtonOver.object, PLAY.x, PLAY.y);
                    else
                        GDrawImage(context, GameManager.assetManager.assets.imgPlayButton.object, PLAY.x, PLAY.y);
                } else {
                    GFill(context, "white");
                    context.drawImage(GameManager.assetManager.assets.imgBgSnap.object, 0, 0);
                }
                //
                animationId = window.requestAnimationFrame(Draw);
            } else {
                window.cancelAnimationFrame(animationId);
            }
        }

        WinJS.UI.processAll(element)
            .done(function () {
                //------------ Scale Canvas --------------

                GUpdateCanvasSize(homeCanvas);

                // PointerHandler
                GSetupPointerHandler(homeCanvas,
                    function () { },
                    end,
                    move,
                    function () { },
                    function () { });

                // Snap Listener
                GSetupMediaQueryListeners("/html/homePage.html",
                    function () { GUpdateCanvasSize(homeCanvas); },
                    function () { },
                    function () { GUpdateCanvasSize(homeCanvas); },
                    function () { GUpdateCanvasSize(homeCanvas); });

                //------- Draw  --------
                animationId = window.requestAnimationFrame(Draw);
            });
    }

    WinJS.UI.Pages.define("/html/homePage.html", {
        ready: ready
    });
})();
