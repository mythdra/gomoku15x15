import React, { Component } from 'react'
import Board from './Board';
import alphaBeta from './MiniMax'
import { checkState } from './MiniMax';
import WorkerBuilder from './Worker';

// Worker for multi thread
var worker = new WorkerBuilder(alphaBeta)

export default class Game extends Component {

    // Constructor for class Game
    constructor(props) {
        super(props);
        this.state = {
            isEnd: false,
            gameState : 'Player Turn',
            depth : 3,
            history: [
                { 
                    board : [
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                    ]   
                } 
            ],
            board : [
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ]   
        }
    }

    // Create listen event for worker
    componentDidMount = () => {
        // Get x y from MiniMax 
        worker.onmessage = e =>{
            let px = e.data.px;
            let py = e.data.py;
            const board = this.state.board;
            var newArr = [];
            for (let i = 0; i < board.length; i++)
                newArr[i] = board[i].slice();
    
            newArr[px][py] = 'O';

            // Remove board at index(1)
            if(this.state.history.length >= 7){
                this.state.history.splice(1,1)
            }
            

            // Update history of board
            this.setState({
                history : this.state.history.concat({
                    board : newArr
                }),
                board : newArr,
                gameState : 'Player Turn'
            }); 
            var status = checkState(newArr);
            switch(status){
                case 'O':
                    this.setState({
                        isEnd : true,
                        gameState : 'PC Win'
                    })
                    return;
                case 'X':
                    this.setState({
                        isEnd : true,
                        gameState : 'You Win',
                    })
                    return;
                case 'tie':
                    this.setState({
                        isEnd : true,
                        gameState : 'Draw',
                    })
                    return;
                case 'next':
    
            }
        }
    };
    
    // Player click 
    handleClick(x,y){
        // Is the game end?
        if (this.state.isEnd){
            return
        }
        
        // Generate click and check if cell not empty
        const board = this.state.board;
        var newArr = [];
        for (let i = 0; i < board.length; i++)
            newArr[i] = board[i].slice();
        if(newArr[x][y] === '.') {
            newArr[x][y] = 'X';
        } else if (newArr[x][y] !== '.'){
            return
        }

        
        // Update board
        this.setState({
            board : newArr,
        });

        let status = checkState(newArr);
        switch(status){
            case 'O':
                this.setState({
                    isEnd : true,
                    gameState : "PC Win"
                })
                return;
            case 'X':
                this.setState({
                    isEnd : true,
                    gameState : "You Win"
                })
                return;
            case 'tie':
                this.setState({
                    isEnd : true,
                    gameState : "Draw"
                })
                return;
            case 'next':

        }
        
        // Update new board and status
        this.setState({
            board : newArr,
            gameState : 'PC Thinking...',
        });

        // Send stat of board to minimax
        worker.postMessage({ 
            board : newArr, 
            depth : this.state.depth, 
            player : 'O', 
            move : true, 
            alpha : Number.NEGATIVE_INFINITY, 
            beta : Number.POSITIVE_INFINITY,
        });

    }
    
    //Back 1 Moves
    backGame(){
        var history = this.state.history.slice();
        if (history.length <= 2){
            return;
        }
        history.splice(history.length - 1, 1)
        console.log(history);

        this.setState({
            history : history,
        })

        var board = history[history.length - 1].board.slice()
        var newArr = [];
        for (let i = 0; i < board.length; i++)
            newArr[i] = board[i].slice();
        this.setState({
            board : newArr,
            gameState : "Player Turn",
            isEnd : false, 
        })
    }

    restartGame(){
        
        this.setState({
            history: [
                { 
                    board : [
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                    ]   
                } 
            ],
            board : [
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
                ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ],
            isEnd : false,
        })
    }

    // Render
    render() {
        return (
            <div>
                <div style={{textAlign : 'center'}}>
                    <button onClick={() => {this.setState({depth : 2 , board : this.state.history[0].board})}}>Easy</button>
                    <button onClick={() => {this.setState({depth : 3 , board : this.state.history[0].board})}}>Normal</button>
                    <button onClick={() => {this.setState({depth : 4 , board : this.state.history[0].board})}}>Hard</button>
                    <button  onClick={() => {this.restartGame()}}>Restart Game</button>
                    <div style = {{textAlign : 'center', fontSize : '20px'}}>{this.state.gameState}</div>
                </div>
                <div style={{textAlign : 'center'}}>
                    <button style = {{margin : '5px'}} onClick={() => this.backGame()}>Back</button>
                </div>
                <div className="Game">
                    <div className="game-board">
                        <Board onClick={(x,y) => { this.handleClick(x,y);}}
                            squares={this.state.board} />
                    </div>
                </div>      
            </div>
            
        )
    }
}

