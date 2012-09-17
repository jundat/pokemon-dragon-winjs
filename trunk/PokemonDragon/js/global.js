// ------ GLOBAL VARIANT ----------

// Kích thước cả màn hình
var WINDOW_WIDTH = 0;
var WINDOW_HEIGHT = 0;

// Kích thước của gameCanvas vẫn là full
// Nhưng đây là kích thước thực tế ta sử dụng trong đó.
var CV_WIDTH = 0;
var CV_HEIGHT = 0;

// Còn đây là vị trí góc trên-trái, bắt đầu vùng canvas mà ta sử dụng
var CV_POSX = 0;
var CV_POSY = 0;

// Ty le scale cua game
var SCALE = 0;

// 
var GAME_LOAD_COMPLETE = false;
var SPRITE_LOAD_COMPLETE = false;

var BOARD_WIDTH = 12; // kich thuoc cua 1 board
var BOARD_HEIGH = 7;

var BOARD_LEFT = 203; // vitri ve board
var BOARD_TOP = 130; //76

var CUBE_WIDTH = 80;//24


// ---------- GLOBAL FUNCTION --------

// Draw image with new origin (CV_POSX, CV_POSY) and SCALE
// Base origin is 0,0 and base size is 1366, 768
function GDrawImage(contextt, imgg, x, y) {
    try {
        contextt.drawImage(imgg,
            0, 0, imgg.width, imgg.height,
            x * SCALE + CV_POSX, y * SCALE + CV_POSY, imgg.width * SCALE, imgg.height * SCALE);
    } catch (e) {
        console.log("Exception: function DrawImage(contextt, imgg, x, y) in homePage.js\n" + e.message);
    }
}

// srcRect = {x, y, w, h};
function GDrawImageR(contextt, imgg, x, y, srcRect){
    try {
        contextt.drawImage(imgg, srcRect.x, srcRect.y, srcRect.w, srcRect.h, x * SCALE + CV_POSX, y * SCALE + CV_POSY, srcRect.w * SCALE, srcRect.h * SCALE);
    } catch (e) {
        console.log("Exception: function GDrawImageR(contextt, imgg, x, y, srcRect) in global.js\n" + e.message);
    }
}

// Draw string with new origin (CV_POSX, CV_POSY) and SCALE
// Base origin is 0,0 and base size is 1366, 768
function GFillText(context, string, x, y) {
    context.fillText(string, x * SCALE + CV_POSX, y * SCALE + CV_POSY);
}

// update canvas size and other global variant
function GUpdateCanvasSize(canvas) {
    var scale = 1366 / 768;
    WINDOW_WIDTH = window.innerWidth;
    WINDOW_HEIGHT = window.innerHeight;

    if (WINDOW_WIDTH / WINDOW_HEIGHT >= scale) {
        CV_WIDTH = WINDOW_HEIGHT * scale;
        CV_HEIGHT = WINDOW_HEIGHT;

        CV_POSX = (WINDOW_WIDTH - CV_WIDTH) / 2;
        CV_POSY = 0;

        SCALE = CV_HEIGHT / 768;
    }
    //
    if (WINDOW_WIDTH / WINDOW_HEIGHT < scale) {
        CV_HEIGHT = WINDOW_WIDTH / scale;
        CV_WIDTH = WINDOW_WIDTH;

        CV_POSX = 0;
        CV_POSY = (WINDOW_HEIGHT - CV_HEIGHT) / 2;

        SCALE = CV_WIDTH / 1366;
    }

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
}

// idicate if the view state is snap
function GIsSnapped() {
    return (window.innerWidth == 320);
}


// View state change handle
function GSetupMediaQueryListeners(pageUrl, fullPortraitListener, snapListener, fillListener, fullLandscapeListener) {
    var mql = matchMedia("all and (-ms-view-state: fullscreen-portrait)");
    mql.addListener(function (mql) {
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === pageUrl) {
            fullPortraitListener();
        }
    });

    var mql2 = matchMedia("all and (-ms-view-state: snapped)");
    mql2.addListener(function (mql) {
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === pageUrl) {
            snapListener();
        }
    });

    var mql3 = matchMedia("all and (-ms-view-state: filled)");
    mql3.addListener(function (mql) {
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === pageUrl) {
            fillListener();
        }
    });

    var mql4 = matchMedia("all and (-ms-view-state: fullscreen-landscape)");
    mql4.addListener(function (mql) {
        if (!mql.matches) { return; }
        if (GameManager.state.config.currentPage === pageUrl) {
            fullLandscapeListener();
        }
    });
}

// Handle all pointer event, mouse and touch
function GSetupPointerHandler(canvas, pointerDownHnd, pointerUpHnd, pointerMoveHnd, pointerOutHnd, pointerCancelHnd) {
    canvas.addEventListener("MSPointerDown", pointerDownHnd, false);
    canvas.addEventListener("MSPointerUp", pointerUpHnd, false);
    canvas.addEventListener("MSPointerMove", pointerMoveHnd, false);
    canvas.addEventListener("MSPointerOut", pointerOutHnd, false);
    canvas.addEventListener("MSPointerCancel", pointerCancelHnd, false);
}

// Keyboard Handeler
function GSetUpKeyboardHandler(keyDownHnd, keyUpHnd, keyPressHnd) {
    document.onkeydown = keyDownHnd;
    document.onkeyup = keyUpHnd;
    document.onkeypress = keyPressHnd;
}

function GSetupMouseWheel(mouseWheelHnd) {
    document.onmousewheel = mouseWheelHnd;
}

// Play Sound
function GPlaySound(sound, playAgainIfPlaying) {
    try {
        sound.object.volume = GameManager.state.external.soundVolume / 100;
        // loop sound
        if (sound.loop) {
            sound.object.addEventListener("ended", function () {
                sound.object.currentTime = 0;
                sound.object.play();
            }, false);
        }

        if (playAgainIfPlaying) {
            if (!sound.object.ended) {
                sound.object.pause();
                sound.object.currentTime = 0;
            }
        }

        sound.object.play();
        return true;
    }
    catch (e) {
        console.log("Exception: GPlaySound: function (sound) in global.js\n" + e.message);
        return false;
    }
}

// Pause Sound
function GPauseSound(sound) {
    try{
        if (!sound.object.ended) {
            sound.object.pause();
        }
    } catch (e) {
        console.log("Exception: GPauseSound: function (sound) in global.js\n" + e.message);
    }
}


// End Sound
function GStopSound(sound) {
    try {
        if (!sound.object.ended) {
            sound.object.stop();
        }
    } catch (e) {
        console.log("Exception: GStopSound: function (sound) in global.js\n" + e.message);
    }
}

// fill context which color
function GFill(context, color) {
    context.fillStyle = color;
    context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
}

// clear context
function GClear(context) {
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
}

// Create an Rectangle
function GRect(xx, yy, ww, hh) {
    var rect = {
        x: xx,
        y: yy,
        w: ww,
        h: hh,
        contain: function (xxx, yyy) {
            if (xxx > (this.x * SCALE + CV_POSX) &&
                xxx < ((this.x + this.w) * SCALE + CV_POSX) &&
                yyy > (this.y * SCALE + CV_POSY) &&
                yyy < ((this.y + this.h) * SCALE + CV_POSY)) {
                return true;
            }
            return false;
        }
    };

    return rect;
}

function GPoint(xx, yy) {
    var point = { x: xx, y: yy };
    return point;
}

function GMessage(title, content, yesFunction, noFunction) {
    var msg = new Windows.UI.Popups.MessageDialog("");
    msg.title = title;
    msg.content = content;
    
    if (yesFunction) {
        msg.commands.append(new Windows.UI.Popups.UICommand("Yes", function () { yesFunction(); }));
        if(noFunction)
            msg.commands.append(new Windows.UI.Popups.UICommand("No", function () { noFunction(); }));
    }
    msg.defaultCommandIndex = 0;
    msg.cancelCommandIndex = 1;
    try{
        msg.showAsync();
    } catch (e) {
        console.log("Can not show messageBox");
    }
}

function GEffect(pointsss) {
    var effect = {
        points: pointsss,
        time: 0,
        oldDate: new Date(),

        draw: function (context) {
            if (this.time > 400) {
                return;
            } else {
                context.strokeStyle = "red";
                context.lineWidth = 10;
                context.lineCap = "round";
                context.lineJoin = 'round';
                //
                context.beginPath();
                //
                context.moveTo((this.points[0].x * CUBE_WIDTH + BOARD_LEFT + CUBE_WIDTH / 2) * SCALE + CV_POSX, (this.points[0].y * CUBE_WIDTH + BOARD_TOP + CUBE_WIDTH / 2) * SCALE + CV_POSY);

                for (var i = 0; i < this.points.length; ++i) {
                    context.lineTo((this.points[i].x * CUBE_WIDTH + BOARD_LEFT + CUBE_WIDTH / 2)*SCALE + CV_POSX, (this.points[i].y * CUBE_WIDTH + BOARD_TOP + CUBE_WIDTH / 2)*SCALE + CV_POSY);
                }

                context.stroke();

                this.time = new Date() - this.oldDate;
            }
        },
    };

    return effect;
}

function GFillText3D(ct, string, x, y, colorMain, colorBg) {
    //default
    if (!colorMain || !colorBg) {
        ct.fillStyle = "red";
        GFillText(ct, string, x + 2, y + 2);

        ct.fillStyle = "white";
        GFillText(ct, string, x, y);
    } else {
        ct.fillStyle = colorBg;
        GFillText(ct, string, x + 2, y + 2);

        ct.fillStyle = colorMain;
        GFillText(ct, string, x, y);
    }
}




