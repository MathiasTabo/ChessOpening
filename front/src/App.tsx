import { useState } from 'react'
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface Move {
  from: string;
  to: string;
  promotion: string;
}


interface Tree {
  move: Move;
  bottom: list[Move];
}

function createNode(move) {
  const node:Tree = {
    move,
    bottom: [],
  }
  return node;
}

function addNode(tree, move) {
  const node = createNode(move);
  if (!tree) {
    return node;
  }
  var treeClone = JSON.parse(JSON.stringify(tree));
  treeClone.bottom.push(node);
  return node;
}

function App() {
  const [game, setGame] = useState(new Chess());
  const [tree, setTree] = useState(null)
  console.log(tree);

  function makeAMove(move:Move) {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      setGame(gameCopy);
      const newNode = addNode(tree?.curr_node, move);
      if (!tree) {
        setTree({tree: newNode, curr_node: newNode});
      } else {
        setTree({tree: tree.tree, curr_node: newNode});
      }
      return result; // null if the move was illegal, the move object if the move was legal
    } catch (err) {
      console.log(err)
      return null
    }
  }

  // function makeRandomMove() {
  //   const possibleMoves = game.moves();
  //   if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
  //     return; // exit if the game is over
  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //   makeAMove(possibleMoves[randomIndex]);
  // }

  function onDrop(sourceSquare:string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    // setTimeout(makeRandomMove, 200);
    return true;
  }

  return (
    <div className="p-8">
        <Chessboard id="BasicBoard" position={game.fen()} onPieceDrop={onDrop} />
    </div>
  )
}
export default App
