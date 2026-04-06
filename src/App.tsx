/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Crown, RotateCcw, Bomb, PlaySquare, Undo, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    atOptions: any;
  }
}

const BannerAd = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    
    bannerRef.current.innerHTML = '';

    window.atOptions = {
      'key' : '8038e3ac3cde9e8c01d7520f63beef93',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://www.highperformanceformat.com/8038e3ac3cde9e8c01d7520f63beef93/invoke.js";
    script.async = true;
    
    bannerRef.current.appendChild(script);

    return () => {
      if (bannerRef.current) {
        bannerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="mt-auto pt-4 w-full flex justify-center overflow-hidden min-h-[66px]">
      <div ref={bannerRef} className="w-[320px] h-[50px] flex justify-center items-center bg-black/20 rounded-lg"></div>
    </div>
  );
};

const AdModal = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://pl29080417.profitablecpmratenetwork.com/101de369504aa0354319f3ebf87cca43/invoke.js";
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] p-4">
      <div className="bg-[#2a3256] p-4 rounded-xl w-full max-w-[400px] flex flex-col items-center border border-white/10 shadow-2xl">
        <h3 className="text-white font-bold mb-4 text-xl">Advertisement</h3>
        <div id="container-101de369504aa0354319f3ebf87cca43" className="min-h-[250px] w-full bg-black/40 rounded-lg flex items-center justify-center overflow-hidden relative">
          <span className="text-white/30 text-sm absolute">Loading Ad...</span>
        </div>
        <button 
          onClick={onClose}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full w-full transition-colors"
        >
          Close & Continue
        </button>
      </div>
    </div>
  );
};

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playSound = (type: 'place' | 'clear' | 'gameover' | 'bomb') => {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'place') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'clear') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 1);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    } else if (type === 'bomb') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

type Shape = number[][];
type Block = {
  id: string;
  shape: Shape;
  color: string;
};

const SHAPES: Shape[] = [
  [[1]], // 1x1
  [[1, 1]], [[1], [1]], // 2x1, 1x2
  [[1, 1, 1]], [[1], [1], [1]], // 3x1, 1x3
  [[1, 1, 1, 1]], [[1], [1], [1], [1]], // 4x1, 1x4
  [[1, 1, 1, 1, 1]], [[1], [1], [1], [1], [1]], // 5x1, 1x5
  [[1, 1], [1, 1]], // 2x2
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]], // 3x3
  // Small L
  [[1, 0], [1, 1]], [[0, 1], [1, 1]], [[1, 1], [1, 0]], [[1, 1], [0, 1]],
  // Medium L (3x2)
  [[1, 0], [1, 0], [1, 1]], [[0, 1], [0, 1], [1, 1]], [[1, 1], [1, 0], [1, 0]], [[1, 1], [0, 1], [0, 1]],
  [[1, 1, 1], [1, 0, 0]], [[1, 1, 1], [0, 0, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]],
  // Large L (3x3)
  [[1, 0, 0], [1, 0, 0], [1, 1, 1]], [[0, 0, 1], [0, 0, 1], [1, 1, 1]], [[1, 1, 1], [1, 0, 0], [1, 0, 0]], [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
  // T shapes
  [[1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 1], [1, 0]], [[0, 1], [1, 1], [0, 1]],
  // Large T shapes (3x3)
  [[1, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 1, 0], [0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1], [1, 0, 0]], [[0, 0, 1], [1, 1, 1], [0, 0, 1]],
  // Z shapes
  [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]], [[0, 1], [1, 1], [1, 0]]
];

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
];

const generateBlock = (): Block => {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { id: Math.random().toString(36).substr(2, 9), shape, color };
};

type DragState = {
  block: Block;
  sourceIndex: number;
  pointerX: number;
  pointerY: number;
};

const Cell = React.forwardRef<HTMLDivElement, { color?: string | null, isGhost?: boolean }>(
  ({ color, isGhost }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-full rounded-sm ${!color ? 'bg-[#3b446e] border border-[#2a3256]/50' : ''}`}
        style={{
          backgroundColor: color || undefined,
          boxShadow: color ? `inset 0px 4px 4px rgba(255,255,255,0.3), inset 0px -4px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)` : undefined,
          opacity: isGhost ? 0.5 : 1,
          transform: isGhost ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s',
        }}
      />
    );
  }
);

const TrayBlock = ({ block, onPointerDown, isDragging }: { block: Block | null, onPointerDown: (e: React.PointerEvent) => void, isDragging: boolean }) => {
  if (!block) return <div className="w-20 h-20" />;

  const rows = block.shape.length;
  const cols = block.shape[0].length;
  const maxDim = Math.max(rows, cols);
  const trayCellSize = Math.min(20, 80 / maxDim - 2);

  return (
    <div
      className={`w-20 h-20 flex items-center justify-center cursor-grab touch-none ${isDragging ? 'opacity-20' : 'opacity-100'} hover:scale-105 transition-transform`}
      onPointerDown={onPointerDown}
    >
      <div className="flex flex-col gap-[2px]">
        {block.shape.map((row, r) => (
          <div key={r} className="flex gap-[2px]">
            {row.map((cell, c) => (
              <div key={c} style={{ width: trayCellSize, height: trayCellSize }}>
                {cell ? <Cell color={block.color} /> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [grid, setGrid] = useState<(string | null)[][]>(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [blocks, setBlocks] = useState<(Block | null)[]>([null, null, null]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bombs, setBombs] = useState(2);
  const [bombActive, setBombActive] = useState(false);
  const [hasRevived, setHasRevived] = useState(false);
  
  const [comboCount, setComboCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  
  const [lastState, setLastState] = useState<{grid: (string | null)[][], blocks: (Block | null)[], score: number, comboCount: number, comboMultiplier: number} | null>(null);
  const [undoCount, setUndoCount] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoverPos, setHoverPos] = useState<{row: number, col: number} | null>(null);
  const [clearingLines, setClearingLines] = useState<{rows: number[], cols: number[]} | null>(null);
  const [combo, setCombo] = useState<{ lines: number, x: number, y: number } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    setBlocks([generateBlock(), generateBlock(), generateBlock()]);
    const savedHighScore = localStorage.getItem('blockPuzzleHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (cellRef.current) {
        setCellSize(cellRef.current.getBoundingClientRect().width);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    setTimeout(updateSize, 100);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const canPlace = (currentGrid: (string | null)[][], shape: Shape, startRow: number, startCol: number) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const gridRow = startRow + r;
          const gridCol = startCol + c;
          if (gridRow < 0 || gridRow >= 8 || gridCol < 0 || gridCol >= 8) return false;
          if (currentGrid[gridRow][gridCol] !== null) return false;
        }
      }
    }
    return true;
  };

  const checkLines = (currentGrid: (string | null)[][]) => {
    const rowsToClear = new Set<number>();
    const colsToClear = new Set<number>();

    for (let r = 0; r < 8; r++) {
      if (currentGrid[r].every(cell => cell !== null)) rowsToClear.add(r);
    }

    for (let c = 0; c < 8; c++) {
      let full = true;
      for (let r = 0; r < 8; r++) {
        if (currentGrid[r][c] === null) {
          full = false;
          break;
        }
      }
      if (full) colsToClear.add(c);
    }

    const linesCleared = rowsToClear.size + colsToClear.size;
    const clearedGrid = currentGrid.map((row, r) =>
      row.map((cell, c) => {
        if (rowsToClear.has(r) || colsToClear.has(c)) return null;
        return cell;
      })
    );

    return { clearedGrid, linesCleared, rowsToClear, colsToClear };
  };

  const checkGameOver = (currentGrid: (string | null)[][], currentBlocks: (Block | null)[]) => {
    const hasAvailableBlocks = currentBlocks.some(b => b !== null);
    if (!hasAvailableBlocks) return;

    for (const block of currentBlocks) {
      if (!block) continue;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (canPlace(currentGrid, block.shape, r, c)) return;
        }
      }
    }
    playSound('gameover');
    setGameOver(true);
  };

  const placeBlock = (block: Block, row: number, col: number, sourceIndex: number) => {
    setLastState({
      grid: grid.map(r => [...r]),
      blocks: [...blocks],
      score,
      comboCount,
      comboMultiplier
    });

    const newGrid = grid.map(r => [...r]);
    let blocksPlaced = 0;
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c]) {
          newGrid[row + r][col + c] = block.color;
          blocksPlaced++;
        }
      }
    }

    const { clearedGrid, linesCleared, rowsToClear, colsToClear } = checkLines(newGrid);

    const newBlocks = [...blocks];
    newBlocks[sourceIndex] = null;
    const isTrayEmpty = newBlocks.every(b => b === null);
    const nextBlocks = isTrayEmpty ? [generateBlock(), generateBlock(), generateBlock()] : newBlocks;

    let newScore = score + blocksPlaced;
    if (linesCleared > 0) {
      playSound('clear');
      
      const newComboCount = comboCount + 1;
      setComboCount(newComboCount);
      
      const currentMultiplier = linesCleared * newComboCount;
      setComboMultiplier(currentMultiplier);
      
      const lineScores = [0, 10, 30, 60, 100, 150, 210, 280, 360];
      const baseLineScore = lineScores[linesCleared] || (linesCleared * 50);
      
      newScore += baseLineScore * currentMultiplier;
      
      if (linesCleared > 1 || newComboCount > 1) {
        setCombo({ lines: linesCleared, x: window.innerWidth / 2, y: window.innerHeight / 2 });
        setTimeout(() => setCombo(null), 1000);
      }
    } else {
      playSound('place');
      setComboCount(0);
      setComboMultiplier(1);
    }

    setBlocks(nextBlocks);

    if (linesCleared > 0) {
      setGrid(newGrid);
      setClearingLines({ rows: Array.from(rowsToClear), cols: Array.from(colsToClear) });

      setTimeout(() => {
        setGrid(clearedGrid);
        setClearingLines(null);
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('blockPuzzleHighScore', newScore.toString());
        }
        checkGameOver(clearedGrid, nextBlocks);
      }, 250);
    } else {
      setGrid(clearedGrid);
      setScore(newScore);
      checkGameOver(clearedGrid, nextBlocks);
    }
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState || !gridRef.current || !cellSize) return;

    setDragState(prev => prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY } : null);

    const rect = gridRef.current.getBoundingClientRect();
    const gap = 4;
    const blockWidth = dragState.block.shape[0].length * cellSize + (dragState.block.shape[0].length - 1) * gap;
    const blockHeight = dragState.block.shape.length * cellSize + (dragState.block.shape.length - 1) * gap;

    const floatingLeft = e.clientX - blockWidth / 2;
    const floatingTop = e.clientY - blockHeight - 40;

    const gridX = floatingLeft - rect.left - 6; // 6 is p-1.5 padding
    const gridY = floatingTop - rect.top - 6;

    const col = Math.round(gridX / (cellSize + gap));
    const row = Math.round(gridY / (cellSize + gap));

    if (canPlace(grid, dragState.block.shape, row, col)) {
      setHoverPos({ row, col });
    } else {
      setHoverPos(null);
    }
  }, [dragState, cellSize, grid]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragState) return;
    if (hoverPos) {
      placeBlock(dragState.block, hoverPos.row, hoverPos.col, dragState.sourceIndex);
    }
    setDragState(null);
    setHoverPos(null);
  }, [dragState, hoverPos]);

  const handleUndo = () => {
    if (!lastState || clearingLines) return;
    
    setGrid(lastState.grid);
    setBlocks(lastState.blocks);
    setScore(lastState.score);
    setComboCount(lastState.comboCount);
    setComboMultiplier(lastState.comboMultiplier);
    setLastState(null);
    setGameOver(false);
    
    const newCount = undoCount + 1;
    setUndoCount(newCount);
    
    if (newCount % 2 === 0) {
      setShowAdModal(true);
    }
  };

  const restartGame = () => {
    setGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
    setBlocks([generateBlock(), generateBlock(), generateBlock()]);
    setScore(0);
    setGameOver(false);
    setClearingLines(null);
    setHoverPos(null);
    setDragState(null);
    setHasRevived(false);
    setBombActive(false);
    setLastState(null);
    setUndoCount(0);
    setComboCount(0);
    setComboMultiplier(1);
  };

  const handleBombClick = () => {
    if (bombs > 0) {
      setBombActive(!bombActive);
    } else {
      window.open('https://www.profitablecpmratenetwork.com/jatjsvu5?key=81bacb23585dec844619004769e281f0', '_blank');
      setBombs(b => b + 1);
    }
  };

  const useBomb = (rowToClear: number) => {
    setLastState({
      grid: grid.map(r => [...r]),
      blocks: [...blocks],
      score,
      comboCount,
      comboMultiplier
    });
    playSound('bomb');
    setBombActive(false);
    setBombs(b => b - 1);
    
    setComboCount(0);
    setComboMultiplier(1);

    const newGrid = grid.map(r => [...r]);
    newGrid[rowToClear] = Array(8).fill(null);
    
    setClearingLines({ rows: [rowToClear], cols: [] });
    setTimeout(() => {
      setGrid(newGrid);
      setClearingLines(null);
      checkGameOver(newGrid, blocks);
    }, 250);
  };

  const handleRevive = () => {
    window.open('https://www.profitablecpmratenetwork.com/jatjsvu5?key=81bacb23585dec844619004769e281f0', '_blank');
    setHasRevived(true);
    setGameOver(false);
    
    const newGrid = grid.map(r => [...r]);
    for(let r = 4; r < 8; r++) {
      newGrid[r] = Array(8).fill(null);
    }
    
    setClearingLines({ rows: [4, 5, 6, 7], cols: [] });
    playSound('bomb');
    
    setTimeout(() => {
      setGrid(newGrid);
      setClearingLines(null);
    }, 250);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#3b446e] to-[#2a3256] flex flex-col items-center justify-center p-4 font-sans touch-none select-none overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerDown={initAudio}
    >
      <AnimatePresence>
        {combo && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1.2 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed z-50 text-yellow-400 font-black text-5xl italic drop-shadow-lg pointer-events-none"
            style={{ left: combo.x, top: combo.y, transform: 'translate(-50%, -50%)' }}
          >
            {combo.lines} COMBO!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-8 text-white">
        <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
          <Crown size={24} />
          <span>{highScore}</span>
        </div>
        <div className="flex flex-col items-center">
          <motion.div
            key={score}
            initial={{ scale: 1.5, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-5xl font-bold"
          >
            {score}
          </motion.div>
          <AnimatePresence>
            {comboMultiplier > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-orange-400 font-bold text-sm mt-1"
              >
                x{comboMultiplier} MULTIPLIER
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="p-2 rounded-full text-gray-300 hover:text-white bg-white/10 transition-colors"
          >
            <Trophy size={20} />
          </button>
          <button 
            onClick={handleUndo} 
            disabled={!lastState || !!clearingLines}
            className={`p-2 rounded-full transition-colors ${!lastState || clearingLines ? 'text-gray-500 bg-white/5 cursor-not-allowed' : 'text-gray-300 hover:text-white bg-white/10'}`}
          >
            <Undo size={20} />
          </button>
          <button 
            onClick={handleBombClick} 
            className={`relative p-2 rounded-full transition-colors ${bombActive ? 'bg-red-500 text-white animate-pulse' : 'text-gray-300 hover:text-white bg-white/10'}`}
          >
            <Bomb size={20} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {bombs > 0 ? bombs : '+'}
            </span>
          </button>
          <button onClick={restartGame} className="p-2 rounded-full text-gray-300 hover:text-white bg-white/10 transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="w-full max-w-[400px] aspect-square bg-[#2a3256] p-1.5 rounded-lg grid grid-cols-8 grid-rows-8 gap-1 relative shadow-2xl"
      >
        {grid.map((row, r) =>
          row.map((cellColor, c) => {
            let isGhost = false;
            let ghostColor = null;

            if (hoverPos && dragState) {
              const { shape, color } = dragState.block;
              const dr = r - hoverPos.row;
              const dc = c - hoverPos.col;
              if (dr >= 0 && dr < shape.length && dc >= 0 && dc < shape[0].length && shape[dr][dc]) {
                isGhost = true;
                ghostColor = color;
              }
            }

            const isClearing = clearingLines?.rows.includes(r) || clearingLines?.cols.includes(c);

            return (
              <div 
                key={`${r}-${c}`} 
                className="w-full h-full relative"
                onPointerDown={() => {
                  if (bombActive) {
                    useBomb(r);
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={isClearing ? { scale: 0, opacity: 0, borderRadius: '50%' } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <Cell
                    ref={r === 0 && c === 0 ? cellRef : null}
                    color={cellColor || ghostColor}
                    isGhost={isGhost}
                  />
                </motion.div>
              </div>
            );
          })
        )}
      </div>

      {/* Tray */}
      <div className="w-full max-w-[400px] mt-12 flex justify-between items-center h-24">
        {blocks.map((block, i) => (
          <div key={i} className="flex-1 flex justify-center items-center">
            <TrayBlock
              block={block}
              onPointerDown={(e) => {
                if (!block || clearingLines || gameOver || bombActive) return;
                e.preventDefault();
                setDragState({
                  block,
                  sourceIndex: i,
                  pointerX: e.clientX,
                  pointerY: e.clientY,
                });
              }}
              isDragging={dragState?.sourceIndex === i}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 text-white/30 font-bold text-3xl italic tracking-wider">
        ADDICTIVE!
      </div>

      {/* Banner Ad */}
      <BannerAd />

      {/* Floating Block */}
      {dragState && cellSize > 0 && (
        <div
          className="fixed pointer-events-none z-50 flex flex-col gap-1"
          style={{
            left: dragState.pointerX - (dragState.block.shape[0].length * cellSize + (dragState.block.shape[0].length - 1) * 4) / 2,
            top: dragState.pointerY - (dragState.block.shape.length * cellSize + (dragState.block.shape.length - 1) * 4) - 40,
          }}
        >
          {dragState.block.shape.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => (
                <div key={c} style={{ width: cellSize, height: cellSize }}>
                  {cell ? <Cell color={dragState.block.color} /> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#2a3256] p-8 rounded-2xl flex flex-col items-center text-white shadow-2xl border border-white/10"
          >
            <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Out of Moves!
            </h2>
            <p className="text-2xl mb-8 text-gray-300 font-bold">Score: {score}</p>
            
            <div className="flex flex-col gap-4 w-full">
              {!hasRevived && (
                <button
                  onClick={handleRevive}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-3 text-xl shadow-lg shadow-green-500/30"
                >
                  <PlaySquare size={24} />
                  Watch Ad to Revive
                </button>
              )}
              <button
                onClick={restartGame}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-3 text-xl shadow-lg shadow-blue-500/30"
              >
                <RotateCcw size={24} />
                Play Again
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Ad Modal */}
      {showAdModal && (
        <AdModal onClose={() => setShowAdModal(false)} />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#2a3256] p-6 rounded-xl w-full max-w-[300px] flex flex-col items-center border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 text-yellow-400">
              <Trophy size={28} />
              <h3 className="font-black text-2xl">Leaderboard</h3>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold">1.</span>
                  <span className="text-white font-bold">Nyasha</span>
                </div>
                <span className="text-yellow-400 font-bold">10000</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 font-bold">2.</span>
                  <span className="text-white font-bold">Tino</span>
                </div>
                <span className="text-gray-300 font-bold">5900</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold">3.</span>
                  <span className="text-white font-bold">Alicia</span>
                </div>
                <span className="text-orange-400 font-bold">2000</span>
              </div>
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full w-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

