import React, { Component } from 'react';
import Square from './Square';

export default class Board extends Component {

    constructor(props){
        super(props);
        this.state = {
            len : props.squares.length,
        }
        this.renderSquare = this.renderSquare.bind(this);
    }

    renderSquare(j){
        const term = []
        for (let i = 0; i < this.state.len; i++){
            term.push(<Square value={this.props.squares[j][i]}
                key = {(this.state.len - 1)*j + i}
                onClick={()=>this.props.onClick(j,i)}
                />)
        }
        return (<div key={'rowSquare'+j}>{term}</div>)
    }
    render() {
        const term = []
        for (let i = 0; i < this.state.len; i++){
            term.push(this.renderSquare(i))
        }
        return (
            <div>
                {term}
            </div>
        )
        
    }
}