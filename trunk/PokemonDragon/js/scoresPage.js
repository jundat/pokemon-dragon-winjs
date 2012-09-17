//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved


(function () {
    "use strict";

    function ready(element, options) {

        GameManager.state.config.currentPage = "/html/scoresPage.html";

        var context;
        var animationId;
        var scores;
        

        function Draw(time) {
            if (WinJS.Navigation.location == "/html/scoresPage.html") {
                context = scoresCanvas.getContext("2d");

                GClear(context);
                
                if (!GIsSnapped()) {
                    GDrawImage(context, GameManager.assetManager.assets.imgBgScores.object, 0, 0);
                    var img = new Image();
                    img.dataSrc = context.getImageData(0, 0, 100, 100);
                    GDrawImage(context, img, 100, 100);
                    
                    context.font = "bold " + Math.floor(48 * SCALE) + "px Papyrus";
                    context.fillStyle = "black";
                    context.textBaseline = "middle";
                    context.textAlign = "left";

                    var _player = "";
                    var _level = "";
                    var _score = "";

                    for (var i = 0; i < scores.length; i++) {
                        _player = scores[i].player;
                        _level = "lv-" + scores[i].level;
                        _score = scores[i].score + "p";

                        if (_player.length >= 10) {
                            _player = _player.substr(0, 10);
                        }

                        GFillText3D(context, _player, 400, 250 + i * 80, "black", "white");
                        GFillText3D(context, _level, 750, 250 + i * 80, "black", "red");
                        GFillText3D(context, _score, 920, 250 + i * 80, "black", "yellow");
                    }
                } else {
                    GFill(context, "white");
                    context.drawImage(GameManager.assetManager.assets.imgBgSnap.object, 0, 0);
                }

                //--------
                animationId = window.requestAnimationFrame(Draw);
            } else {
                window.cancelAnimationFrame(animationId);
            }
        }

        function registerForShare() {
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", shareImageHandler);
        }

        function shareImageHandler(e) {
            //
            var request = e.request;
            request.data.properties.title = "PokemonDragon";
            request.data.properties.description = "High Scores";
            var deferral = request.getDeferral();

            Windows.ApplicationModel.Package.current.installedLocation.getFileAsync("images\\logoECT.png").then(function (thumbnailFile) {
                request.data.properties.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(thumbnailFile);
                return Windows.ApplicationModel.Package.current.installedLocation.getFileAsync("images\\logoECT.png");
            }).done(function (imageFile) {
                request.data.setBitmap(Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(imageFile));                
                deferral.complete();
            }, function (err) {
                request.failWithDisplayText(err);
            });
        }

        WinJS.UI.processAll(element)
            .done(function () {
                // Snap Listener
                GSetupMediaQueryListeners("/html/scoresPage.html",
                    function () { GUpdateCanvasSize(scoresCanvas); },
                    function () { },
                    function () { GUpdateCanvasSize(scoresCanvas); },
                    function () { GUpdateCanvasSize(scoresCanvas); });

                //------------ Scale Canvas --------------
                GUpdateCanvasSize(scoresCanvas);

                // get scores
                scores = GameManager.scoreHelper.getScores();

                //------- Draw  --------
                animationId = window.requestAnimationFrame(Draw);

                // share
                try{
                    registerForShare();
                } catch (e) {
                    console.log("can not share");
                }
            });
    }

    WinJS.UI.Pages.define("/html/ScoresPage.html", {
        ready: ready
    });
})();
