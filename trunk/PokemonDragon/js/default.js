

(function () {
    "use strict";

    var homeUrl = "/html/homePage.html";
    var gameUrl = "/html/gamePage.html";
    var scoresUrl = "/html/scoresPage.html";
    var gameId = null;
    var game = new Game();
    var touchPanel = new TouchPanel();
    var state = new GameState();
    state.load();
    var scoreHelper = new Scores();
    var assetManager = new AssetManager();

    assetManager.load(getAllAssets(), function () {
        GAME_LOAD_COMPLETE = true;
        if (SPRITE_LOAD_COMPLETE) {
            //navigateHome();
            //if (GameManager.state.config.currentPage == gameUrl)
            //    WinJS.Navigation.navigate(GameManager.state.config.currentPage);
        }
    });

    assetManager.loadSprites(getAllSprites(), function () {
        SPRITE_LOAD_COMPLETE = true;
        if (GAME_LOAD_COMPLETE) {
            //navigateHome();
            //if (GameManager.state.config.currentPage == gameUrl)
            //    WinJS.Navigation.navigate(GameManager.state.config.currentPage);
        }
    });

    // get array of asset needed to load before game
    function getAllAssets () {
            // To add asset to a list of loading assets follow the the examples below
        var assets = {
            // imageeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

            // gamePage
            imgBgGame: { object: null, fileName: "/images/imgBgGame.png", fileType: AssetType.image },
            imgBgSnap: { object: null, fileName: "/images/imgBgSnap.png", fileType: AssetType.image },
            imgFrame: { object: null, fileName: "/images/imgFrame.png", fileType: AssetType.image },
            imgFrameSelect: { object: null, fileName: "/images/imgFrameSelect.png", fileType: AssetType.image },
            imgDialog: { object: null, fileName: "/images/imgDialog.png", fileType: AssetType.image },
            imgButtonResume: { object: null, fileName: "/images/imgButtonResume.png", fileType: AssetType.image },
            imgButtonResumeOver: { object: null, fileName: "/images/imgButtonResumeOver.png", fileType: AssetType.image },
            imgTime: { object: null, fileName: "/images/imgTime.png", fileType: AssetType.image },

            // homePage
            imgBgMenu: { object: null, fileName: "/images/imgBgMenu.png", fileType: AssetType.image },
            imgPlayButton: { object: null, fileName: "/images/imgPlayButton.png", fileType: AssetType.image },
            imgPlayButtonOver: { object: null, fileName: "/images/imgPlayButtonOver.png", fileType: AssetType.image },

            // scores
            imgBgScores: { object: null, fileName: "/images/imgBgScores.png", fileType: AssetType.image },

            // soundddddddddddddddddddddddddddddddddddd
            sndBounce: { object: null, fileName: "/sounds/sndBounce.wav", fileType: AssetType.audio, loop: false },

            sndBackground: { object: null, fileName: "/sounds/sndBackground.mp3", fileType: AssetType.audio, loop: true },
            //sndBackground: { object: null, fileName: "/sounds/sndBg.mid", fileType: AssetType.audio, loop: true },

            sndWin: { object: null, fileName: "/sounds/sndWin.wav", fileType: AssetType.audio, loop: false },
            sndCheckVolume: { object: null, fileName: "/sounds/sndCheckVolume.wav", fileType: AssetType.audio, loop: false },
        };
        
        return assets;
    }

    function getAllSprites() {
        var listSprites = [
         { object: null, fileName: "/sprites/0.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/1.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/2.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/3.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/4.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/5.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/6.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/7.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/8.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/9.png", fileType: AssetType.image },
         //
         { object: null, fileName: "/sprites/10.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/11.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/12.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/13.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/14.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/15.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/16.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/17.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/18.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/19.png", fileType: AssetType.image },
         //
         { object: null, fileName: "/sprites/20.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/21.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/22.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/23.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/24.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/25.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/26.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/27.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/28.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/29.png", fileType: AssetType.image },
         //
         { object: null, fileName: "/sprites/30.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/31.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/32.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/33.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/34.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/35.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/36.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/37.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/38.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/39.png", fileType: AssetType.image },
         //
         { object: null, fileName: "/sprites/40.png", fileType: AssetType.image },
         { object: null, fileName: "/sprites/41.png", fileType: AssetType.image },
        ];

        return listSprites;
    }
    

    // Navigation support
    function navigateHome() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== homeUrl) {
            // Navigate
            WinJS.Navigation.navigate(homeUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = homeUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    // Navigate to play game
    function navigateGame() {
        if (GIsSnapped()) return;

        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== gameUrl) {
            // Navigate
            WinJS.Navigation.navigate(gameUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = gameUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }
    
    function navigateScores() {
        if (GIsSnapped()) return;

        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== scoresUrl) {
            // Navigate
            WinJS.Navigation.navigate(scoresUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = scoresUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    // Preferences panel
    function showPreferences() {
        WinJS.UI.SettingsFlyout.show();
    }

    // Notification before App Bar or Settings are shown/hidden
    function onBeforeShow(e) {
        if (e.srcElement.id === "settingsDiv") {
            // Sync up the settings UI to match internal state
            GameManager.game.getSettings();
        }
        GameManager.game.showExternalUI(e);
    }

    function onAfterHide(e) {
        GameManager.game.hideExternalUI(e);
    }

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = {
            "settingsDiv": { title: "Game options", href: "/html/settingsFlyout.html" },
            "aboutUsDiv": { title: "About Us", href: "/html/settingAboutUs.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    // Activation
    WinJS.Application.onactivated = function (e) {
        if (e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {

            GameManager.game.initialize(GameManager.state);

            WinJS.UI.processAll();

            // Set up initial AppBar button styles. TODO: Add any new buttons' associated styles
            WinJS.Utilities.addClass(document.getElementById("scores"), "snapped-hidden");
            WinJS.Utilities.addClass(document.getElementById("newgame"), "game-button");
            WinJS.Utilities.addClass(document.getElementById("pause"), "game-button");

            navigateHome();
        }
    };

    // Suspend and resume
    function suspendingHandler(e) {
        console.log("Suspend Hnd!!!");
        if (GameManager.state.config.currentPage === gameUrl) {
            GameManager.game.suspend(e);
        } else {
            GameManager.state.save();
        }
    }

    function resumingHandler(e) {
        console.log("Resume Hnd!!!");
        if (GameManager.state.config.currentPage === gameUrl) {
            GameManager.game.resume(e);
        }
    }

    // Notify game of loss and regain of focus
    function blurHandler(e) {
        console.log("Blur handler: WindowWidth: " + window.innerWidth);
        if (WinJS.Navigation.location === gameUrl) {
            GameManager.game.hide();
        }
    }

    function focusHandler(e) {
        console.log("Focus handler");
        if (WinJS.Navigation.location === gameUrl) {
            GameManager.game.show();
        }
    }

    // new in RTM
    function newGame() {
        GameManager.game.newGame();
    }
    //end new in RTM

    //new in rtm
    function togglePause() {
        GameManager.game.togglePause();
    }
    //end new in rtm


    Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", suspendingHandler, false);
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resumingHandler, false);
    window.addEventListener("blur", blurHandler, false);
    window.addEventListener("focus", focusHandler, false);
    document.addEventListener("beforeshow", onBeforeShow, false);
    document.addEventListener("afterhide", onAfterHide, false);

    WinJS.Application.start();

    // new in Studio RTM
    WinJS.Utilities.markSupportedForProcessing(navigateHome);
    WinJS.Utilities.markSupportedForProcessing(navigateGame);
    WinJS.Utilities.markSupportedForProcessing(navigateScores);
    // new in RTM
    WinJS.Utilities.markSupportedForProcessing(newGame);
    WinJS.Utilities.markSupportedForProcessing(togglePause);
    //

    WinJS.Namespace.define("GameManager", {
        navigateHome: navigateHome,
        navigateGame: navigateGame,
        navigateScores: navigateScores,
        showPreferences: showPreferences,
        onBeforeShow: onBeforeShow,
        onAfterHide: onAfterHide,
        game: game,
        state: state,
        assetManager: assetManager,
        scoreHelper: scoreHelper,
        gameId: gameId,
        touchPanel: touchPanel,
        //new in RTM
        newGame: newGame,
        togglePause: togglePause,
    });

})();
