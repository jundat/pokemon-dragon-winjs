


// Số ô có trong Board = 84
var BOARD_SIZE = 84; // BOARD_WIDTH * BOARD_HEIGH
var NUMBER_POKEMON = 42;
var RANDOM_MAX = 3;//Math.floor(BOARD_SIZE / NUMBER_POKEMON);

var Board = WinJS.Class.define(
    null,
{
    board: [ // 12x7
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ],

    newPokemon: null,
    curPokemon: null,

    //Call in game initialize
    Initialize: function () {
        // new board
        this.CreateNewBoard();

        // reset shosen pokemon
        this.newPokemon = GPoint(-1, -1);
        this.curPokemon = GPoint(-1, -1);
    },

    CreateNewBoard: function () {
        var count = 0;
        var i, j, random;
        //////////////////////////////////////////////
        var List1 = new Array(NUMBER_POKEMON);
        // random xuôi
        if ((new Date()).getMilliseconds() % 2 == 0)
        {
            for (i = 0; i < NUMBER_POKEMON; ++i) {

                if (i == NUMBER_POKEMON - 1) { // con cuoi cung
                    List1[i] = BOARD_SIZE - count;
                    count += List1[i];
                    break;
                }

                // ko phai cuoi cung
                if (count < BOARD_SIZE) {
                    random = 2 * Math.floor(Math.random() * RANDOM_MAX + 1); // 2*( 1 -> NUMBER_POKEMON) // đảm bảo nó là số chẵn từ 1->6
                    List1[i] = random < BOARD_SIZE - count ? random : BOARD_SIZE - count;
                    count += List1[i];
                } else break;
            }
        } else {
            // random ngược lại
            for (i = NUMBER_POKEMON - 1; i >= 0; i--) {

                if (i == 0) { // con cuoi cung
                    List1[i] = BOARD_SIZE - count;
                    count += List1[i];
                    break;
                }

                // ko phai cuoi cung
                if (count < BOARD_SIZE) {
                    random = 2 * Math.floor(Math.random() * RANDOM_MAX + 1); // 2*( 1 -> NUMBER_POKEMON) // đảm bảo nó là số chẵn từ 1->6
                    List1[i] = random < BOARD_SIZE - count ? random : BOARD_SIZE - count;
                    count += List1[i];
                } else break;
            }
        }
        
        /////////////////////////////////////////////
        var List2 = new Array();
        for (i = 0; i < List1.length; ++i) {
            for (j = 0; j < List1[i]; ++j) {

                List2.push(i);
            }
        }

        //
        count = List2.length;
        for (i = 0; i < BOARD_HEIGH; ++i) {
            for (j = 0; j < BOARD_WIDTH; ++j) {

                random = Math.floor(Math.random() * count);
                this.board[i][j] = List2[random];
                List2.splice(random, 1);
                count--;
            }
        }
    },

    DrawAll: function (context) {
        var i, j;

        //
        this.DrawCurPokemon(context);

        // draw static cube
        for(i = 0; i < BOARD_HEIGH; ++i)
            for (j = 0; j < BOARD_WIDTH; ++j) {
                if(this.board[i][j] >= 0)
                    this.DrawCube(context, j, i, this.board[i][j]);
            }
    },

    DrawCube: function (context, jb, ib, spriteIndex) {
        var img;

        try {
            img = GameManager.assetManager.sprites[spriteIndex].object;
            
            context.drawImage(img,
                0, 0, img.width, img.height,

                (BOARD_LEFT + jb * CUBE_WIDTH) * SCALE + CV_POSX,
                (BOARD_TOP + ib * CUBE_WIDTH) * SCALE + CV_POSY,
                CUBE_WIDTH * SCALE,
                CUBE_WIDTH * SCALE);

            img = GameManager.assetManager.assets.imgFrame.object;
            GDrawImage(context, img, BOARD_LEFT + jb * CUBE_WIDTH, BOARD_TOP + ib * CUBE_WIDTH);

        } catch (e) {
            console.log("Exception in board.js\n" + e.message);
        }
    },

    DrawCurPokemon: function(context){
        
        var img = GameManager.assetManager.assets.imgFrameSelect.object;
        
        if(this.curPokemon)
            if (this.curPokemon.x >= 0 && this.curPokemon.x < BOARD_WIDTH && this.curPokemon.y >= 0 && this.curPokemon.y < BOARD_HEIGH) {
                GDrawImage(context, img, BOARD_LEFT + this.curPokemon.x * CUBE_WIDTH, BOARD_TOP + this.curPokemon.y * CUBE_WIDTH);
            }

        if (this.newPokemon)
            if (this.newPokemon.x >= 0 && this.newPokemon.x < BOARD_WIDTH && this.newPokemon.y >= 0 && this.newPokemon.y < BOARD_HEIGH) {
                GDrawImage(context, img, BOARD_LEFT + this.newPokemon.x * CUBE_WIDTH, BOARD_TOP + this.newPokemon.y * CUBE_WIDTH);
            }
    },

    DeletePokemon: function (point) {
        this.board[point.y][point.x] = -1;
    },

    IsFinished: function () {
        for (var i = 0; i < BOARD_HEIGH; ++i) {
            for (var j = 0; j < BOARD_WIDTH; ++j) {
                if(this.board[i][j] >= 0)
                    return false;
            }
        }
        return true;
    },

    GetCompleteItem: function () {
        var res = 0;

        for (i = 0; i < BOARD_HEIGH; ++i) {
            for (j = 0; j < BOARD_WIDTH; ++j) {
                if (this.board[i][j] == -1) {
                    res++;
                }
            }
        }

        return res;
    },


});