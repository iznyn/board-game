import { useCallback, useEffect, useState } from 'react';
import './App.css'

enum PlayerColors {
  red = 'red',
  yellow = 'yellow'
}

type BoardTokens = PlayerColors[][];

const columnTotal = 10;
const rowTotal = 8;
const matchTotal = 4;

const getArrayRange = (max: number) => {
  const items = [];
  for(let i=0; i < max; i++) {
    items.push(i);
  }
  return items;
}

function App() {
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [boardTokens, setBoardTokens] = useState<BoardTokens>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [columnIndexes, setColumnIndexes] = useState<number[]>([]);
  const [rowIndexes, setRowIndexes] = useState<number[]>([]);
  const [player1Color, setPlayer1Color] = useState<PlayerColors | null>(null);
  const [player2Color, setPlayer2Color] = useState<PlayerColors | null>(null);

  useEffect(() => {
    setColumnIndexes(getArrayRange(columnTotal));
    setRowIndexes(getArrayRange(rowTotal));

    const tokenList = [];
    for(let i=0; i < columnTotal; i++) {
      tokenList.push([]);
    }
    setBoardTokens(tokenList);

    setPlayer1Color(PlayerColors.red);
    setPlayer2Color(PlayerColors.yellow);
  },[]);

  const checkMatchColor = useCallback((tokens: string[], currentColor: PlayerColors) => {
    let matchColors: PlayerColors[] = [];
    for (const index in tokens) {
      const color = tokens[index] as PlayerColors;
      if (color !== currentColor) {
        matchColors = [];
      } else {
        matchColors.push(color);
      }
      if (matchColors.length >= matchTotal) {
        break;
      }
    }

    if (matchColors.length >= matchTotal) {
      return true;
    }
    return false;
  }, []);

  const getTheWinner = useCallback((currentTokens: BoardTokens, currentColIndex: number, currentColor: PlayerColors) => {
    // Check vertical
    const tokensInColumn = [...currentTokens[currentColIndex]];
    if (tokensInColumn?.length >= 3) {
      tokensInColumn.reverse();
      
      const checkVerticalResult = checkMatchColor(tokensInColumn, currentColor);
      if (checkVerticalResult) {
        return true;
      }
    }

    // Check horizontal
    const rowIndex = tokensInColumn?.length - 1;
    const tokensInRows: string[] = [];
    currentTokens.forEach((columns) => {
      const columnItems = [...columns];
      columnItems.reverse();
      if (typeof columns[rowIndex] !== 'undefined') {
        tokensInRows.push(columns[rowIndex]);
      }
    });
    const checkHorizontalResult = checkMatchColor(tokensInRows, currentColor);
    if (checkHorizontalResult) {
      return true;
    }

    // Check diagonal left
    const diagonalLeftItems: string[] = [];
    let startLeftColumn: number = currentColIndex;
    let startLeftRow: number = rowIndex;
    while (startLeftColumn > 0 && startLeftRow < rowTotal - 1) {
      startLeftColumn -= 1;
      startLeftRow += 1;
    }

    let leftColumnIndex: number = startLeftColumn;
    let leftRowIndex: number = startLeftRow;
    while (leftColumnIndex <= (columnTotal - 1) && leftRowIndex <= (rowTotal - 1)) {
      if (typeof currentTokens[leftColumnIndex][leftRowIndex] !== 'undefined') {
        diagonalLeftItems.push(currentTokens[leftColumnIndex][leftRowIndex]);
      }
      leftColumnIndex += 1;
      leftRowIndex -= 1;
    }

    const checkDLeftResult = checkMatchColor(diagonalLeftItems, currentColor);
    if (checkDLeftResult) {
      return true;
    }

    // Check diagonal right
    const diagonalRightItems: string[] = [];
    let startRightColumn: number = currentColIndex;
    let startRightRow: number = rowIndex;
    while (startRightColumn < (columnTotal - 1) && startRightRow < (rowTotal - 1)) {
      startRightColumn += 1;
      startRightRow += 1;
    }

    let rightColumnIndex: number = startRightColumn;
    let rightRowIndex: number = startRightRow;
    while (rightColumnIndex >= 0 && rightRowIndex <= (rowTotal - 1)) {
      if (typeof currentTokens[rightColumnIndex][rightRowIndex] !== 'undefined') {
        diagonalRightItems.push(currentTokens[rightColumnIndex][rightRowIndex]);
      }
      rightColumnIndex -= 1;
      rightRowIndex -= 1;
    }

    const checkDRightResult = checkMatchColor(diagonalRightItems, currentColor);
    if (checkDRightResult) {
      return true;
    }

    return false;

  }, [checkMatchColor]);

  const insertToken = useCallback((colIndex: number) => {
    const color = currentPlayer === 1 ? player1Color : player2Color;

    if (color) {
      const newBoards = [...boardTokens];
      const colBoards = [...newBoards[colIndex], color];
      newBoards[colIndex] = colBoards;

      setBoardTokens(newBoards);
      const found = getTheWinner(newBoards, colIndex, color);

      if (!found) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      } else {
        setIsShowAlert(true);
      }
    }

    // Get the winners
  }, [currentPlayer, boardTokens, player1Color, player2Color]);

  return (
    <div className="main flex items-center gap-6">
      {columnIndexes.map((colIndex: number) => (
        <div key={`column-${colIndex}`} className="flex flex-col items-center gap-6">
          <button type="button" onClick={() => insertToken(colIndex)} className="mb-2 rounded-md py-1 px-3 bg-blue-500 text-white text-xs font-medium">Insert</button>

          <div className="flex flex-col-reverse items-center">
            {rowIndexes.map((rowIndex: number) => {
              // const colKey = `column_${colIndex + 1}`;
              const columnToken = boardTokens[colIndex];
              const tokenColor = (columnToken && typeof columnToken[rowIndex] !== 'undefined') ? columnToken[rowIndex] : false;

              return (
                <div key={`row-${rowIndex}`} className="relative bg-neutral-200 w-20 h-20 rounded-full mb-6">
                  {tokenColor && (
                    <div className={`absolute inset-0 rounded-full ${tokenColor === 'red' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {isShowAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="px-20 py-12 max-w-[480px] rounded-xl bg-white">
            <p className={`text-2xl font-bold`}>{currentPlayer === 1 ? 'Player 1' : 'Player 2'} Wins!!!</p>
            <div className="mt-10 text-center">
              <button type="button" onClick={() => window.location.reload()} className="mb-2 rounded-md py-2 px-4 bg-blue-500 text-white text-sm font-medium">Play Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
