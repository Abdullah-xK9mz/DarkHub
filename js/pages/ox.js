
    /* ==================== 2. منطق لعبة إكس أو ==================== */
    let oxBoard = Array(9).fill(null), oxCurrentTurn = 'X', oxActive = true, oxScores = { X: 0, O: 0 };
    const oxWinPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    document.addEventListener('DOMContentLoaded', () => {
      resetOxGame();
    });

    function resetOxGame() {
      oxBoard = Array(9).fill(null); 
      oxCurrentTurn = 'X'; 
      oxActive = true;
      const grid = document.getElementById('ox-grid');
      grid.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ox-cell';
        cell.addEventListener('click', () => handleOxCellClick(i));
        grid.appendChild(cell);
      }
      document.getElementById('ox-winOverlay').style.display = 'none';
    }

    function handleOxCellClick(index) {
      if (!oxActive || oxBoard[index]) return;
      makeOxMove(index, oxCurrentTurn);
      
      const mode = document.getElementById('ox-mode').value;
      if (oxActive && mode.startsWith('ai') && oxCurrentTurn === 'O') {
        setTimeout(makeAIMove, 300);
      }
    }

    function makeOxMove(index, player) {
      oxBoard[index] = player;
      const cells = document.getElementById('ox-grid').children;
      cells[index].innerText = player;
      cells[index].classList.add(player.toLowerCase());

      const winCombo = checkOxWin(player);
      if (winCombo) {
        oxActive = false;
        winCombo.forEach(i => cells[i].classList.add('win'));
        oxScores[player]++;
        document.getElementById(`ox-score-${player.toLowerCase()}`).innerText = oxScores[player];
        setTimeout(() => showOxWinner(player === 'X' ? 'اللاعب X فاز باللقب! 🏆' : 'اللاعب O فاز بالجولة! 🤖'), 500);
      } else if (oxBoard.every(c => c !== null)) {
        oxActive = false;
        setTimeout(() => showOxWinner('تعادل عادل! 🤝'), 400);
      } else {
        oxCurrentTurn = oxCurrentTurn === 'X' ? 'O' : 'X';
      }
    }

    function checkOxWin(player) {
      return oxWinPatterns.find(p => p.every(i => oxBoard[i] === player));
    }

    function showOxWinner(msg) {
      document.getElementById('ox-winTitle').innerText = msg;
      document.getElementById('ox-winOverlay').style.display = 'flex';
    }

    function makeAIMove() {
      const mode = document.getElementById('ox-mode').value;
      const emptyIndices = oxBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
      if (emptyIndices.length === 0) return;

      let move;
      if (mode === 'ai-easy') {
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      } else {
        move = findBestOxMove('O') ?? findBestOxMove('X') ?? (oxBoard[4] === null ? 4 : emptyIndices[Math.floor(Math.random() * emptyIndices.length)]);
      }
      makeOxMove(move, 'O');
    }

    function findBestOxMove(player) {
      for (let combo of oxWinPatterns) {
        const pCount = combo.filter(i => oxBoard[i] === player).length;
        const emptyCount = combo.filter(i => oxBoard[i] === null).length;
        const nullIdx = combo.find(i => oxBoard[i] === null);
        if (pCount === 2 && emptyCount === 1 && nullIdx !== undefined) {
          return nullIdx;
        }
      }
      return null;
    }
  