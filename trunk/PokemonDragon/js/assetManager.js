//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

var AssetType = { image: 1, audio: 2, other: 3 };

var AssetManager = WinJS.Class.define(
    null,
{
    // ------------------ SPRITE--------------------------------------------------------------------------------
    sprites: null,
    loadedCount2: 0,
    toLoadCount2: 0,
    loadCompleteHandler2: null,

    loadSprites: function (spritesToLoad, loadCompleteHandler2) {
        this.sprites = spritesToLoad;
        this.toLoadCount2 = Object.keys(spritesToLoad).length;
        this.loadCompleteHandler2 = loadCompleteHandler2;
        var that = this;

        for (var i = 0; i < that.sprites.length; ++i) {
            that.sprites[i].object = new Image();
            that.sprites[i].object.addEventListener("load", function (okEvent) { that.loadCompleted2(okEvent, i); }, false);
            that.sprites[i].object.addEventListener("error", function (error) { that.loadFailed2(error, i); }, false);
            that.sprites[i].object.src = that.sprites[i].fileName;
        }
    },

    loadCompleted2: function (e, i) {
        this.loadedCount2++;
        if (this.loadedCount2 === this.toLoadCount2) {
            this.loadCompleteHandler2.call();
        }
    },

    loadFailed2: function (e, i) {
        this.sprites[i].object = null;
        this.loadedCount2++;
        if (this.loadedCount2 === this.toLoadCount2) {
            this.loadCompleteHandler2.call();
        }
    },


    // -------------- other ASSETS-------------------------------------------------------------------------------
    assets: null,
    loadedCount: 0,
    toLoadCount: 0,
    loadCompleteHandler: null,

    load: function (assetsToLoad, loadCompleteHandler) {
        this.assets = assetsToLoad;
        this.toLoadCount = Object.keys(assetsToLoad).length;
        this.loadCompleteHandler = loadCompleteHandler;
        var that = this;

        Object.keys(that.assets).forEach(function (asset, i) {
            switch (that.assets[asset].fileType) {
                case AssetType.image:
                    that.assets[asset].object = new Image();
                    that.assets[asset].object.addEventListener("load", function (okEvent) { that.loadCompleted(okEvent, i); }, false);
                    that.assets[asset].object.addEventListener("error", function (error) { that.loadFailed(error, i); }, false);
                    that.assets[asset].object.src = that.assets[Object.keys(that.assets)[i]].fileName;
                    break;

                case AssetType.audio:
                    that.assets[asset].object = new Audio(that.assets[Object.keys(that.assets)[i]].fileName);
                    if (that.assets[asset].object === null || !!!that.assets[asset].object.canPlayType) {
                        that.assets[asset].object = null;
                        that.loadFailed(null, i);
                        return;
                    }

                    that.assets[asset].object.addEventListener("canplaythrough", function (okEvent) { that.soundLoadCompleted(okEvent, i); }, false);
                    that.assets[asset].object.addEventListener("error", function (error) { that.loadFailed(error, i); }, false);

                    if (!!that.assets[asset].object.canPlayType("audio/mpeg") &&
                        !!that.assets[asset].object.canPlayType("audio/ogg") &&
                        !!that.assets[asset].object.canPlayType("audio/wav")) {
                        that.assets[asset].object = null;
                    }

                    if (that.assets[asset].object === null) {
                        that.loadFailed(null, i);
                    }

                    break;
            }
        });

    },

    loadCompleted: function (e, i) {
        this.loadedCount++;
        if (this.loadedCount === this.toLoadCount) {
            this.loadCompleteHandler.call();
        }
    },

    loadFailed: function (e, indexOfFailed) {
        // Sound could not be loaded, so set variable to null, so we don't try to play it
        this.assets[Object.keys(this.assets)[indexOfFailed]].object = null;
        this.loadedCount++;
        if (this.loadedCount === this.toLoadCount) {
            this.loadCompleteHandler.call();
        }
    },

    soundLoadCompleted: function (okEvent, indexOfCompleted) {
        this.loadedCount++;
        if (this.loadedCount === this.toLoadCount) {
            this.loadCompleteHandler.call();
        }
    },

    // Set all playingSounds.volume = volume / 100
    setVolume: function (volume) {
        var that = this;

        Object.keys(that.assets).forEach(function (asset, i) {
            if (that.assets[asset].fileType == AssetType.audio) {
                try {
                    if (volume)
                        that.assets[asset].object.volume = volume;
                    else
                        that.assets[asset].object.volume = GameManager.state.external.soundVolume / 100;
                } catch (e) {
                    console.log("Exception: in assetManager.js\n" + e.message);
                }
            }
        });
    }
});