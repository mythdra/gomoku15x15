
 function getAllScore(board, player){
    var score = 0;
    for ( let i = 0; i < 15; i++){
        score += getScore(board[i], 'O', player);
        score -= getScore(board[i], 'X', player);
    }
    for ( let i = 0; i < 15; i++){
        let temp = []
        for (let j = 0; j < 15; j++){
            temp.push(board[j][i]);
        }
        score += getScore(temp, 'O', player);
        score -= getScore(temp, 'X', player);
    }
    for (let k = 0; k <= 2 * (board.length - 1); k++) {
        let iStart = Math.max(0, k - board.length + 1);
        let iEnd = Math.min(board.length - 1, k);
        let temp = [];
        for (let i = iStart; i <= iEnd; ++i) {
            let j = k - i;
            temp.push(board[i][j])
        }
        score += getScore(temp, 'O', player);
        score -= getScore(temp, 'X', player);
    }
    for (let k = 1-board.length; k < board.length; k++) {
        let iStart = Math.max(0, k);
        let iEnd = Math.min(board.length + k - 1, board.length-1);
        let temp = [];
        for (let i = iStart; i <= iEnd; ++i) {
            let j = i - k;
            temp.push(board[i][j])
        }
        score += getScore(temp, 'O', player);
        score -= getScore(temp, 'X', player);
    }
    return score;
}

function getCurrentScore(count, blocks, current){
    const winScore = 1000000;
    if (blocks === 2 && count < 5){
        return 0;
    }
    switch(count){
        case 5:
            return winScore*1000;
            break;
        case 4:
            if (current){
                return winScore;
            }else{
                if (blocks === 0){
                    return winScore/4;
                }else{
                    return 200;
                }
            }
            break;
        case 3:
            if (blocks === 0){
                if (current){
                    return 50000;
                }else{
                    return 200;
                }
            } else {
                if (current){
                    return 10;
                } else {
                    return 5;
                }
            }
            break;
        case 2:
            if (blocks === 0){
                if (current){
                    return 7;
                } else {
                    return 5;
                }
            } else {
                return 3;
            }
            break;
        case 1:
            return 1
            break;
        default:
            return winScore * 10000;
    }
}

function getScore(line, sym, player){
    var consecutive = 0;
    var blocks = 2;
    var score = 0;
    var current;
    if (sym === player){
        current = true;
    } else {
        current = false;
    }
    for (var i = 0; i < line.length; i++){
        if (line[i] === sym){
            consecutive += 1;
        } else if (line[i] === '.'){
            if (consecutive > 0){
                blocks = blocks - 1;
                score += getCurrentScore(consecutive, blocks, current);
                consecutive = 0;
                blocks = 1
            } else{
                blocks = 1
            }
        } else if (consecutive > 0){
            score += getCurrentScore(consecutive, blocks, current);
            consecutive = 0;
            blocks = 2;
        } else {
            blocks = 2;
        }
    }
    if (consecutive > 0){
        score += getCurrentScore(consecutive, blocks, current);
    }
    return score;
}

function getCoor(board){
    var iMin = Number.POSITIVE_INFINITY;
    var jMin = Number.POSITIVE_INFINITY;
    var iMax = Number.NEGATIVE_INFINITY;
    var jMax = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < board.length; i++){
        for (let j =0; j < board.length; j++){
            if (board[i][j] !== '.'){
                iMin = Math.min(iMin, i);
                jMin = Math.min(jMin, j);
                iMax = Math.max(iMax, i);
                jMax = Math.max(jMax, j);
            }
        }
    }
    if (iMin - 1 >= 0){
        iMin = iMin - 1;
    }
    if (jMin - 1 >= 0){
        jMin = jMin - 1;
    }
    if (iMax + 1 < board.length){
        iMax = iMax + 1;
    }
    if (jMax + 1 < board.length){
        jMax = jMax + 1;
    }
    return {iMin, jMin, iMax, jMax};
}

function genMoveList(board){
    const {iMin, jMin, iMax, jMax} = getCoor(board);
    var moveList = [];
    for( let i = iMin; i <= iMax; i++){
        for (let j = jMin; j <= jMax; j++){
            if (board[i][j] === '.'){
                moveList.push([i,j]);
            }
        }
    }
    return moveList;
}

export function checkState(board){
    var moveList = genMoveList(board);
    var score = getAllScore(board, 'X');
    if (score >= 3000000){
        return 'O';
    } else if (score <= -3000000){
        return 'X';
    }  else if (moveList.length === 0){
        return 'Tie';
    } else {
        return 'next';
    }
}

export default function alphaBeta(){

    // Listen message from main thread
    self.onmessage = e =>{ /* eslint-disable-line no-restricted-globals */
        let board = e.data.board;
        let depth = e.data.depth;
        let player = e.data.player;
        let move = e.data.move;
        let alpha = e.data.alpha;
        let beta = e.data.beta;
        
        // Runing minimax
        var {px ,py} = calculate(board, depth, player, move, alpha, beta);
        postMessage({px : px, py : py});
    }
    
    // MiniMax Function
    function calculate(board, depth, player, move, alpha, beta){    
        var px, py;
        var score, bestScore;
        score = getAllScore(board, player);
        var moveList = genMoveList(board);

        if (score >= 3000000){
            return score;
        } else if (score <= -3000000){
            return score;
        }  else if (moveList.length === 0){
            return score;
        }
        if (depth === 0){
            return score;
        }

        var isMax = player === 'O'? true : false;
        if (isMax){
            bestScore = Number.NEGATIVE_INFINITY;
            moveList.forEach(coor => {
                let x = coor[0];
                let y = coor[1];
                board[x][y] = player;
                let value = calculate(board, depth - 1, 'X', false, alpha, beta);
                if (value > bestScore){
                    bestScore = value;
                    px = x;
                    py = y;
                }
                board[x][y] = '.';
                alpha = Math.max(bestScore, alpha);
                if (beta <= alpha){
                    return bestScore
                }
            });
        } else{
            bestScore = Number.POSITIVE_INFINITY;
            moveList.forEach(coor => {
                let x = coor[0];
                let y = coor[1];
                board[x][y] = player;
                let value = calculate(board, depth - 1, 'O', false, alpha, beta);
                if (value < bestScore){
                    bestScore = value;
                    px = x;
                    py = y;
                }
                board[x][y] = '.';
                beta = Math.min(bestScore, beta);
                if (beta <= alpha){
                    return bestScore   
                }
            });
        }
        if (move){
            // console.log(px + ' ' + py);
            return {px, py}
        }
        return bestScore;
    }
    
    // Calculate All Score for row, column, diag
    // Score will be calculate = Score('O') - Score('X')
    function getAllScore(board, player){
        var score = 0;
        for ( let i = 0; i < 15; i++){
            score += getScore(board[i], 'O', player);
            score -= getScore(board[i], 'X', player);
        }
        for ( let i = 0; i < 15; i++){
            let temp = []
            for (let j = 0; j < 15; j++){
                temp.push(board[j][i]);
            }
            score += getScore(temp, 'O', player);
            score -= getScore(temp, 'X', player);
        }
        for (let k = 0; k <= 2 * (board.length - 1); k++) {
            let iStart = Math.max(0, k - board.length + 1);
            let iEnd = Math.min(board.length - 1, k);
            let temp = [];
            for (let i = iStart; i <= iEnd; ++i) {
                let j = k - i;
                temp.push(board[i][j])
            }
            score += getScore(temp, 'O', player);
            score -= getScore(temp, 'X', player);
        }
        for (let k = 1-board.length; k < board.length; k++) {
            let iStart = Math.max(0, k);
            let iEnd = Math.min(board.length + k - 1, board.length-1);
            let temp = [];
            for (let i = iStart; i <= iEnd; ++i) {
                let j = i - k;
                temp.push(board[i][j])
            }
            score += getScore(temp, 'O', player);
            score -= getScore(temp, 'X', player);
        }
        return score;
    }

    // Calculate score for each cases
    function getCurrentScore(count, blocks, current){
        const winScore = 1000000;
        
        // if block 2 side and stone < 5, score = 0
        if (blocks === 2 && count < 5){
            return 0;
        }
        switch(count){
            case 5:
                // Win whenever stone = 5, get super score
                return winScore*1000;
                break;
            case 4:
                // if it's 4 stone and this is your turn, get full score even though 0 or 1 block
                if (current){
                    return winScore;
                }else{
                    // It's your opponent turn and not block
                    // if it's 'O' turn, and calculate for '_XXXX_' stone, this will be big NegaTive (-winScore/4) score
                    // MiniMax need to block this ASAP 
                    // if it's 'X' turn, and calculate for '_OOOO_' stone, this will be big PosiTive (winScore/4) score 
                    // MiniMax will do this 
                    if (blocks === 0){
                        return winScore/4;
                    }else{
                        // if it's your opponent turn and 1 block, this can be blocked
                        return 200;
                    }
                }
                break;
            case 3:
                if (blocks === 0){
                    if (current){
                        // 3 stones with 0 block can lead to the win so this score will be high
                        return 50000;
                    }else{
                        // it also can be blocked soon so it will score 200
                        return 200;
                    }
                } else {
                    if (current){
                        return 10;
                    } else {
                        return 5;
                    }
                }
                break;
            case 2:
                if (blocks === 0){
                    if (current){
                        return 7;
                    } else {
                        return 5;
                    }
                } else {
                    return 3;
                }
                break;
            case 1:
                return 1
                break;
            default:
                // is this any case that will be more than 5 stone ???
                return winScore * 10000;
        }
    }

    // Get score for the line with symbols and whose turn
    function getScore(line, sym, player){
        var consecutive = 0;
        var blocks = 2;
        var score = 0;
        var current;
        if (sym === player){
            current = true;
        } else {
            current = false;
        }
        for (var i = 0; i < line.length; i++){
            if (line[i] === sym){
                consecutive += 1;
            } else if (line[i] === '.'){
                if (consecutive > 0){
                    blocks = blocks - 1;
                    score += getCurrentScore(consecutive, blocks, current);
                    consecutive = 0;
                    blocks = 1
                } else{
                    blocks = 1
                }
            } else if (consecutive > 0){
                score += getCurrentScore(consecutive, blocks, current);
                consecutive = 0;
                blocks = 2;
            } else {
                blocks = 2;
            }
        }
        if (consecutive > 0){
            score += getCurrentScore(consecutive, blocks, current);
        }
        return score;
    }

    // Generate the coordinate around current stone on the board, avoid to calculate all the empty cell in the board
    function getCoor(board){
        var iMin = Number.POSITIVE_INFINITY;
        var jMin = Number.POSITIVE_INFINITY;
        var iMax = Number.NEGATIVE_INFINITY;
        var jMax = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < board.length; i++){
            for (let j =0; j < board.length; j++){
                if (board[i][j] !== '.'){
                    iMin = Math.min(iMin, i);
                    jMin = Math.min(jMin, j);
                    iMax = Math.max(iMax, i);
                    jMax = Math.max(jMax, j);
                }
            }
        }
        if (iMin - 1 >= 0){
            iMin = iMin - 1;
        }
        if (jMin - 1 >= 0){
            jMin = jMin - 1;
        }
        if (iMax + 1 < board.length){
            iMax = iMax + 1;
        }
        if (jMax + 1 < board.length){
            jMax = jMax + 1;
        }
        return {iMin, jMin, iMax, jMax};
    }

    // Generate the best moves list for MiniMax, reduce calculation time
    function genMoveList(board){
        const {iMin, jMin, iMax, jMax} = getCoor(board);
        var moveList = [];
        for( let i = iMin; i <= iMax; i++){
            for (let j = jMin; j <= jMax; j++){
                if (board[i][j] === '.'){
                    moveList.push([i,j]);
                }
            }
        }
        var betterList = []
        moveList.forEach(coor => {
            let x = coor[0];
            let y = coor[1];
            let xMin = x - 1 >= 0 ? x - 1 : x;
            let yMin = y - 1 >= 0 ? y - 1 : y;
            let xMax = x + 1 <= 14 ? x + 1 : x;
            let yMax = y + 1 <= 14 ? y + 1 : y;
            for (let i = xMin; i <= xMax; i++){
                for (let j = yMin; j <= yMax; j++)  {
                    if (board[i][j] !== '.'){
                        betterList.push([x,y])
                        i = xMax + 1;
                        break;
                    }
                }
            }
        })
        return betterList;
    }
}

