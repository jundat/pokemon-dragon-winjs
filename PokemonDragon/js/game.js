// Exception Team
// Game UIT club
// 2012

var MIN_TIME = 1 * 1000 * 60; // 1 phút, nếu hoàn thành thì win game
var MAX_TIME = 5 * 1000 * 60; // 10 phút
var RATIO = 0.865662541920; // MIN_TIME = MAX_TIME * RATIO^(10-1)
var ON_BOARD = GRect(203, 130, 960, 560);
// Tổng cộng có khoảng 10 level
var CENTER = GPoint(683, 384 + 10);
var buttonResume = GRect(555, 530, 256, 100);

var Game = WinJS.Class.define(
    null,
{
    // Convenience variables
    gameContext: null,
    stateHelper: new GameState(),
    state: (new GameState()).internal,
    settings: (new GameState()).external,

    score: 0,
    level: 1, // tinh thoi gian
    time: 0, // biến đếm thời gian
    timeLimit: MAX_TIME, // thời gian giới hạn cho từng level
    board: new Board(),
    effect: null,

    getTimeLimit: function(level){
        return MAX_TIME * Math.pow(RATIO, level - 1) ;
    },

    getScore2Add: function (level) {
        return (level * 5);
    },

    oldDate: new Date(),
    getEllapsedTime: function () {
        var tmp = this.oldDate;
        this.oldDate = new Date();

        return (this.oldDate - tmp);
    },

    // Called when Game is first loaded
    initialize: function (state) {

        if (GameManager.gameId === null) {
            this.stateHelper = state;
            this.state = state.internal;
            this.settings = state.external;

            //---load state
            this.level = this.state.level ? this.state.level : 1;
            this.score = this.state.score ? this.state.score : 0;
            this.time = this.state.time ? this.state.time : 0;

            this.board.Initialize();

            //if (false)
            if (this.state.board)
            {
                this.board.board = this.state.board;
            } else {
                this.saveState();
            }
            //---
            this.timeLimit = this.getTimeLimit(this.level);
            
        }
    },


    // Called once time at the first time the game is shown
    showFirst: function () {
        GPlaySound(GameManager.assetManager.assets.sndBackground, false);

        // new game if this is the first time it run
        if (this.state.gamePhase === "ready") {
            this.newGame();
        }

        // If game was previously running, pause it.
        if (this.state.gamePhase === "started") {
            //this.pause();
            this.getEllapsedTime();
        }

        // Note: gameCanvas is the name of the <canvas> in default.html
        this.gameContext = gameCanvas.getContext("2d");
    },

    // Called each time the game is shown
    show: function () {
    },

    // Called each time the game is hidden
    hide: function () {
    },

    // Called when the game enters snapped view
    snap: function () {
        this.pause();
        // TODO: Update game state when in snapped view - basic UI styles can be set with media queries in gamePage.css
        // Temporarily resize game area to maintain aspect ratio
        GUpdateCanvasSize(gameCanvas);

        GClear(this.gameContext);
        GFill(this.gameContext, "white");
        this.gameContext.drawImage(GameManager.assetManager.assets.imgBgSnap.object, 0, 0);
        this.pause();
    },

    // Called when the game enters fill
    unsnap: function () {
        GUpdateCanvasSize(gameCanvas);
        this.draw();
    },

    fullLandscape: function () {
        GUpdateCanvasSize(gameCanvas);
        this.draw();
    },

    fullPortrait: function () {
        GUpdateCanvasSize(gameCanvas);
        this.draw();
    },

    // Called to reset the game
    newGame: function () {
        GameManager.game.ready();
    },

    // reset board, time, timeLimit
    nextGame: function (nextLevel) {
        GMessage("LEVEL " + nextLevel, "");

        this.board.Initialize();
        this.level = nextLevel;
        this.time = 0;
        this.getTimeLimit();// reset counter
        this.timeLimit = this.getTimeLimit(this.level);
        this.state.gamePaused = false;
    },

    // Called when the game is being prepared to start
    ready: function () {
        // TODO: Replace with your own new game initialization logic
        this.state.gamePhase = "started";

        //reset
        this.level = 1;
        this.score = 0;
        this.nextGame(this.level);
        //save state
        this.saveState();
    },

    retry: function () {
        
        var complete = this.board.GetCompleteItem();
        this.state.gamePhase = "started";
        this.nextGame(this.level);
        this.score -= ((complete / 2) * this.getScore2Add(this.level));
    },

    // Called when the game is started
    start: function () {
        this.state.gamePhase = "started";
        this.getEllapsedTime();//reset counter
    },

    lose: function () {
        this.state.gamePhase = "lose";
        this.pause();
        GameManager.scoreHelper.newScore(this.settings.playerName, this.level, this.score);
    },

    win: function () {
        this.state.gamePhase = "win";
        this.pause();
        GameManager.scoreHelper.newScore(this.settings.playerName, this.level, this.score);
    },

    // Called when the game is paused
    pause: function () {
        if (this.state.gamePhase == "started") {
            this.state.gamePaused = true;
        }
    },

    // Called when the game is un-paused
    unpause: function () {
        this.state.gamePaused = false;
        this.getEllapsedTime();
    },

    // Called to toggle the pause state
    togglePause: function () {
        if (GameManager.game.state.gamePaused) {
            GameManager.game.unpause();
        } else {
            GameManager.game.pause();
        }
    },

    // KEYBOARD HND
    keyDown: function (e) {
    },

    keyUp: function (e) {
    },

    keyPress: function (e) {
    },

    // TOUCH HND
    doTouch: function (touchType, e) {
        if (GIsSnapped()) {
            return;
        }
        //
        // do notthing if not load complete
        if (!GAME_LOAD_COMPLETE || !SPRITE_LOAD_COMPLETE) {
            return;
        }

        // Do nothing with right mouse
        if (e.button == 2) return;

        switch (touchType) {
            case "start": GameManager.game.touchStart(e);
                break;
            case "end": GameManager.game.touchEnd(e);
                break;
            case "move": GameManager.game.touchMove(e);
                break;
            case "out": GameManager.game.touchOut(e);
                break;
            case "cancel": GameManager.game.touchCancel(e);
                break;
        }
    },

    touchStart: function (e) {
        if (GameManager.state.internal.gamePaused == true) {
        }
    },

    touchEnd: function (e) {
        if (GameManager.state.internal.gamePhase == "win") {
            return;
        }

        if (GameManager.state.internal.gamePhase == "lose") {
            if (buttonResume.contain(e.x, e.y)) {
                this.retry();
            }
        }
        
        // PAUSEING......................................................................................................................
        //touch to resume
        if (GameManager.state.internal.gamePaused == true && GameManager.state.internal.gamePhase != "lose" && GameManager.state.internal.gamePhase != "win") {
            if(buttonResume.contain(e.x, e.y)){
                this.togglePause();
            }
        } else {
            // RUNNING........................................................................................................................
            
            // Ko chọn ra ngoài
            if (!ON_BOARD.contain(e.x, e.y)) {
                return;
            }

            var point = GPoint();
            point.x = Math.floor((((e.x - CV_POSX) / SCALE) - BOARD_LEFT) / CUBE_WIDTH);
            point.y = Math.floor((((e.y - CV_POSY) / SCALE) - BOARD_TOP) / CUBE_WIDTH);

            // Ko chọn vào ô trống
            if (this.board.board[point.y][point.x] < 0)
                return;

            if (this.board.curPokemon && !this.board.newPokemon) { // mới có curPokemon, chưa có newPokemon
                this.board.newPokemon = point;
                if (this.board.newPokemon.x == this.board.curPokemon.x &&
                    this.board.newPokemon.y == this.board.curPokemon.y) {
                    this.board.newPokemon = null;
                    this.board.curPokemon = null;
                }
            }
            else
                if (this.board.curPokemon && this.board.newPokemon) { // đã có cả 2
                    this.board.newPokemon = null;
                    this.board.curPokemon = point;
                }
                else
                    if (!this.board.curPokemon && !this.board.newPokemon) { // chưa có cái nào
                        this.board.newPokemon = null;
                        this.board.curPokemon = point;
                    }

            // Check Ok
            if (this.board.curPokemon && this.board.newPokemon) {
                if (CheckOk(this.board.curPokemon, this.board.newPokemon, this.board.board)) {
                    this.board.DeletePokemon(this.board.curPokemon);
                    this.board.DeletePokemon(this.board.newPokemon);

                    if (N_POINT == 0) { // 1 duong thang
                        this.effect = GEffect([this.board.curPokemon, this.board.newPokemon]);
                    }

                    if (N_POINT == 1) { // 1 duong cheo
                        this.effect = GEffect([this.board.curPokemon, POINTS[0], this.board.newPokemon]);
                    }

                    if (N_POINT == 2) {
                        this.effect = GEffect([this.board.curPokemon, POINTS[0], POINTS[1], this.board.newPokemon]);
                    }
                    this.score += this.getScore2Add(this.level);
                }
                this.board.curPokemon = this.board.newPokemon = null;
            }
            this.saveState();
        }
    },

    ishover: false,
    touchMove: function (e) {
        if (GameManager.state.internal.gamePaused == true || this.state.gamePhase == "lose") {
            if (buttonResume.contain(e.x, e.y)) {
                this.ishover = true;
            } else {
                this.ishover = false;
            }
        } else {
            this.ishover = false;
        }
    },

    touchCancel: function (e) {
        if (GameManager.state.internal.gamePaused == true) {
        }
    },

    touchOut: function (e) {
        if (GameManager.state.internal.gamePaused == true) {
        }
    },
    // END

    // Called before preferences panel or app bar is shown
    showExternalUI: function (e) {
        if (e.srcElement.id === "settingsDiv" || e.srcElement.id === "aboutUsDiv") {
            GameManager.game.pause();
        }
    },

    // Called after preferences panel or app bar is hidden
    hideExternalUI: function (e) {
        if (e.srcElement.id === "appbar") {
            return;
        }
        //if (e.srcElement.id === "settingsDiv" || e.srcElement.id === "aboutUsDiv") {
        GameManager.game.unpause();
        //}
    },

    // Called by settings panel to populate the current values of the settings
    getSettings: function () {
        // Note: The left side of these assignment operators refers to the setting controls in default.html
        // TODO: Update to match any changes in settings panel
        settingPlayerName.value = this.settings.playerName;
        settingSoundVolume.value = this.settings.soundVolume;
        //settingLevel.value = this.level;
    },

    // Called when changes are made on the settings panel
    setSettings: function () {
        // Note: The right side of these assignment operators refers to the controls in default.html
        // TODO: Update to match any changes in settings panel
        this.settings.playerName = settingPlayerName.value;

        if (this.settings.soundVolume != settingSoundVolume.value) {
            this.settings.soundVolume = settingSoundVolume.value;
            GPlaySound(GameManager.assetManager.assets.sndCheckVolume, true);
            GameManager.assetManager.setVolume();
        }

        //if (this.level != settingLevel.value) {
        //    this.level = settingLevel.value;
        //    this.nextGame(this.level);
        //    this.saveState();
        //    this.stateHelper.save("internal");
        //}
        
        this.stateHelper.save("external");
    },

    // Called when the app is suspended
    suspend: function () {
        this.pause();
        this.stateHelper.save();
    },

    // Called when the app is resumed
    resume: function () {
    },

    increaseLevel: function () {
        if (this.timeLimit >= MIN_TIME) /* chưa hết level */
        {
            this.level++;
            this.nextGame(this.level);
            
        } else { /* Win Game */
            this.state.gamePhase = "win";
        }

        this.saveState();
    },

    // Main game update loop
    update: function () {
        if (GIsSnapped()) {
            return;
        }
        //
        // do notthing if not load complete
        if (!GAME_LOAD_COMPLETE || !SPRITE_LOAD_COMPLETE) {
            return;
        }

        if (this.state.gamePhase == "lose" || this.state.gamePhase == "win")
            return;

        if (this.state.gamePaused == false && this.state.gamePhase === "started") {

            this.time += this.getEllapsedTime();

            this.saveState();

            // check lose
            if (this.time >= this.timeLimit) {
                this.lose();
            }

            // check complete
            if (this.board.IsFinished()) {
                this.increaseLevel();
            }
        }
    },

    // Main game render loop
    draw: function () {
        //do nothing in snap view
        if (GIsSnapped()) {
            return;
        }

        //clear all
        GClear(this.gameContext);
        GFill(this.gameContext, "black");

        // Do not draw if load not complete
        if (!GAME_LOAD_COMPLETE || !SPRITE_LOAD_COMPLETE) {
            GDrawImage(this.gameContext, GameManager.assetManager.assets.imgBgGame.object, 0, 0);
            return;
        }

        // draw background
        GDrawImage(this.gameContext, GameManager.assetManager.assets.imgBgGame.object, 0, 0);

        // Text
        this.gameContext.font = "Bold " + Math.floor(50 * SCALE) + "px Papyrus";
        this.gameContext.fillStyle = "black";
        this.gameContext.textBaseline = "middle";
        this.gameContext.textAlign = "left";

        //score - level - time
        GFillText(this.gameContext, this.score, 931, 715);
        GFillText(this.gameContext, this.level, 390, 715);
        var imgTime = GameManager.assetManager.assets.imgTime.object;
        GDrawImageR(this.gameContext,
            imgTime,
            182, 64,
            GRect(0, 0, imgTime.width * this.time / this.timeLimit, imgTime.height));
        this.gameContext.textAlign = "center";
        GFillText(this.gameContext, Math.floor(this.time * 100 / this.timeLimit) + "%", 680, 110);


        // draw board
        if (!(this.state.gamePaused == true &&
            this.state.gamePhase !== "lose" &&
            this.state.gamePhase != "win")) {
            // do not draw when pause
            this.board.DrawAll(this.gameContext);
        }

        {
            if(this.effect != null)
                this.effect.draw(this.gameContext);
        }     

        // STARTED
        if (this.state.gamePhase == "started") {
            //
        }

        this.gameContext.fillStyle = "black";
        this.gameContext.font = "Bold " + Math.floor(60 * SCALE) + "px Papyrus";
        this.gameContext.textAlign = "center";

        // PAUSE
        if (this.state.gamePaused == true &&
            this.state.gamePhase !== "lose" &&
            this.state.gamePhase != "win") {
            //if (!this.hasPausedWhenHide) {
                //
                GDrawImage(this.gameContext, GameManager.assetManager.assets.imgDialog.object, 283, 135);
                if (this.ishover)
                    GDrawImage(this.gameContext, GameManager.assetManager.assets.imgButtonResumeOver.object, buttonResume.x, buttonResume.y);
                else
                    GDrawImage(this.gameContext, GameManager.assetManager.assets.imgButtonResume.object, buttonResume.x, buttonResume.y);

                //
                GFillText3D(this.gameContext, "PAUSE !!!", CENTER.x, CENTER.y);

                this.gameContext.font = "Bold " + Math.floor(32 * SCALE) + "px Papyrus";
                GFillText3D(this.gameContext, "RESUME", 683, 580, "black", "white");
            //}
        }

        // WIN
        if (this.state.gamePhase == "win") {
            //
            GDrawImage(this.gameContext, GameManager.assetManager.assets.imgDialog.object, 283, 135);
            //
            GFillText3D(this.gameContext, "You Win !!!", CENTER.x, CENTER.y);
        }

        // LOSE
        if (this.state.gamePhase == "lose") {
            //
            GDrawImage(this.gameContext, GameManager.assetManager.assets.imgDialog.object, 283, 135);
            if (this.ishover)
                GDrawImage(this.gameContext, GameManager.assetManager.assets.imgButtonResumeOver.object, buttonResume.x, buttonResume.y);
            else
                GDrawImage(this.gameContext, GameManager.assetManager.assets.imgButtonResume.object, buttonResume.x, buttonResume.y);

            //
            GFillText3D(this.gameContext, "LOSE !!!", CENTER.x, CENTER.y);

            this.gameContext.font = "Bold " + Math.floor(32 * SCALE) + "px Papyrus";
            GFillText3D(this.gameContext, "RETRY", 683, 580, "black", "white");
        }
    },

    saveState: function () {
        this.state.score = this.score;
        this.state.level = this.level;
        this.state.time = this.time;
        this.state.board = this.board.board;

        this.stateHelper.save("internal");
    },
});