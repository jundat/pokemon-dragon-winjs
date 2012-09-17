// Exception Team
// Game UIT club
// 2012

var POINTS = [
    point1= null,
    point2= null
];

var N_POINT = 0;

function CheckOk(curPoint, newPoint, board) {
    N_POINT = 0;
    POINTS[0] = null;
    POINTS[1] = null;

    // Kiểm tra xem có cùng loại pokemon
    if ((board[curPoint.y][curPoint.x] != board[newPoint.y][newPoint.x]) || (board[curPoint.y][curPoint.x] < 0) || board[newPoint.y][newPoint.x] < 0) {
        return false;
    }


    //--------------------------------------------------------- TH111 -----------------------------------------------------------
    // Nối 1 đường thẳng giữa 2 ô
    if (CheckLineOk(curPoint, newPoint, board)) {
        //N_POINT = 0;
        //POINTS[0] = null;
        //POINTS[1] = null;
        return true;
    }


    ////////////////////////////////////////////////////////////// Lấy 2 đoạn thẳng giới hạn của 2 điểm
    var d1, dd1, n1, nn1;
    var d2, dd2, n2, nn2;
    var o;

    var i, j;
    // curPoint
    // vertical ~d1, dd1, x==nhau
    for (i = curPoint.y - 1; i >= 0; --i) {
        if (board[i][curPoint.x] >= 0) {
            break;
        }
    }
    d1 = GPoint(curPoint.x, i + 1);

    for (i = curPoint.y + 1; i < BOARD_HEIGH; ++i) {
        if (board[i][curPoint.x] >= 0) {
            break;
        }
    }
    dd1 = GPoint(curPoint.x, i - 1);

    // horizontal ~n1, nn1, x
    for (i = curPoint.x - 1; i >= 0; --i) {
        if (board[curPoint.y][i] >= 0) {
            break;
        }
    }
    n1 = GPoint(i + 1, curPoint.y);

    for (i = curPoint.x + 1; i < BOARD_WIDTH; ++i) {
        if (board[curPoint.y][i] >= 0) {
            break;
        }
    }
    nn1 = GPoint(i - 1, curPoint.y);

    /////////////////////////
    // newPoint
    // vertical ~d1, dd1, y
    for (i = newPoint.y - 1; i >= 0; --i) {
        if (board[i][newPoint.x] >= 0) {
            break;
        }
    }
    d2 = GPoint(newPoint.x, i + 1);

    for (i = newPoint.y + 1; i < BOARD_HEIGH; ++i) {
        if (board[i][newPoint.x] >= 0) {
            break;
        }
    }
    dd2 = GPoint(newPoint.x, i - 1);

    // horizontal ~n2, nn2, x
    for (i = newPoint.x - 1; i >= 0; --i) {
        if (board[newPoint.y][i] >= 0) {
            break;
        }
    }
    n2 = GPoint(i + 1, newPoint.y);

    for (i = newPoint.x + 1; i < BOARD_WIDTH; ++i) {
        if (board[newPoint.y][i] >= 0) {
            break;
        }
    }
    nn2 = GPoint(i - 1, newPoint.y);

    ////////////////////////////////////////////////////////////////// Lấy 2 đoạn thẳng giới hạn của 2 điểm ///// END



    //--------------------------------------------------------- TH222 -----------------------------------------------------------
    // TH 2 , chéo 2 đường
    // doc1 vs ngang2
    if (d1.y <= n2.y && dd1.y >= n2.y &&
        n2.x <= d1.x && nn2.x >= d1.x) {
        // Có 1 đường chéo cắt
        N_POINT = 1;
        POINTS[0] = GPoint(d1.x, n2.y);
        POINTS[1] = null;
        return true;
    }

    // doc2 vs ngang1
    if (d2.y <= n1.y && dd2.y >= n1.y &&
        n1.x <= d2.x && nn1.x >= d2.x) {
        // Có 1 đường chéo cắt
        N_POINT = 1;
        POINTS[0] = GPoint(d2.x, n1.y);
        POINTS[1] = null;
        return true;
    }

    //--------------------------------------------------------- TH333 -----------------------------------------------------------
    // TH 3, cheo 3 duong
    // 1) 2 canh ngang song song
    var left, right;
    left = Math.max(n1.x, n2.x);
    right = Math.min(nn1.x, nn2.x);
    var y1, y2;
    y1 = Math.min(n1.y, n2.y); // y1 < y2
    y2 = Math.max(n1.y, n2.y);

    // ChecLineOk 
    for (i = left; i <= right; ++i) {
        if(CheckLineOk(GPoint(i, y1), GPoint(i, y2), board)){
            // Co 1 duong 3
            N_POINT = 2;
            if (y1 == n1.y) {
                POINTS[0] = GPoint(i, y1);
                POINTS[1] = GPoint(i, y2);
            } else {
                POINTS[1] = GPoint(i, y1);
                POINTS[0] = GPoint(i, y2);
            }
            return true; ///////// NGANHG---------
        }
    }

    // 2) 2 canh doc song song
    var top, bottom;
    top = Math.max(d1.y, d2.y);
    bottom = Math.min(dd1.y, dd2.y);
    var x1, x2;
    x1 = Math.min(d1.x, d2.x); // x1 < x2
    x2 = Math.max(d1.x, d2.x);

    // CheckLineOk
    for (i = top; i <= bottom; ++i) {
        if (CheckLineOk(GPoint(x1, i), GPoint(x2, i), board)) {
            // Co 1 duong 3
            N_POINT = 2;
            if (x1 == d1.x) {
                POINTS[0] = GPoint(x1, i);
                POINTS[1] = GPoint(x2, i);
            } else {
                POINTS[1] = GPoint(x1, i);
                POINTS[0] = GPoint(x2, i);
            }
            return true; // DỌC]]]]]]]]]]]
        }
    }

    //--------------------------------------------------------- TH333 -- 2 -----------------------------------------------------------
    // TH Có 1 đường nối ở biên
    // tren
    if (d1.y == 0 && d2.y == 0) {
        N_POINT = 2;
        POINTS[0] = GPoint(curPoint.x, -1); // cur
        POINTS[1] = GPoint(newPoint.x, -1); // new
        return true;
    }

    // duoi
    if (dd1.y == BOARD_HEIGH - 1 && dd2.y == BOARD_HEIGH - 1) {
        N_POINT = 2;
        POINTS[0] = GPoint(curPoint.x, BOARD_HEIGH); // cur
        POINTS[1] = GPoint(newPoint.x, BOARD_HEIGH); // new
        return true;
    }

    // trai
    if (n1.x == 0 && n2.x == 0) {
        N_POINT = 2;
        POINTS[0] = GPoint(-1, curPoint.y); // cur
        POINTS[1] = GPoint(-1, newPoint.y); // new
        return true;
    }

    // phai
    if (nn1.x == BOARD_WIDTH - 1 && nn2.x == BOARD_WIDTH - 1) {
        N_POINT = 2;
        POINTS[0] = GPoint(BOARD_WIDTH, curPoint.y); // cur
        POINTS[1] = GPoint(BOARD_WIDTH, newPoint.y); // new
        return true;
    }

    return false;
}


// ~ board[point.y][point.x]
function CheckLineOk(p1, p2, board) {
    var point1, point2;

    var i;
    // doc
    if (p1.x == p2.x) {
        if (p1.y < p2.y) {
            point1 = p1;
            point2 = p2;
        } else {
            point1 = p2;
            point2 = p1;
        }

        for (i = point1.y + 1; i < point2.y; ++i) {
            if (board[i][point1.x] >= 0) {
                return false;
            }
        }
        return true;
    }
    else
    // ngang
        if (p1.y == p2.y) {
            if (p1.x < p2.x) {
                point1 = p1;
                point2 = p2;
            } else {
                point1 = p2;
                point2 = p1;
            }


            for (i = point1.x + 1; i < point2.x; ++i) {
                if (board[point1.y][i] >= 0) {
                    return false;
                }
            }
            return true;
    }

    return false;
}



