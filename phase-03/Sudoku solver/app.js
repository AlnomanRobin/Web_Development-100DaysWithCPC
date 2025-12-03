// app.js — Sudoku Solver UI + Logic (ES module)

// Public API on window:
// - getBoard(): number[][]
// - setBoard(board: number[][]): void
// - solveBoard(): { status: 'solved' | 'unsolvable' | 'multiple', solutionsFound?: number }

// Initialization entry point
export function initApp(PUZZLES) {
  const state = createInitialState(PUZZLES);
  buildGrid(state);
  wireControls(state);
  applyURLPuzzle(state);
  restoreIfAny(state);
  announce(state, "Ready.");
  exposeAPI(state);
}

// ---------- State ----------
function createInitialState(PUZZLES) {
  return {
    mode: 'manual', // 'manual' | 'preset'
    difficulty: 'medium',
    allowedDigits: new Set([1,2,3,4,5,6,7,8,9]),
    board: emptyBoard(),       // numbers 0-9
    givenMask: blankMask(),    // booleans for prefilled (non-editable)
    undoStack: [],
    anim: false,
    puzzles: PUZZLES,
    lastSolveHighlights: new Set(), // cell indices for solved highlight
    statusEl: document.getElementById('statusText'),
    gridEl: document.getElementById('grid')
  };
}

function emptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}
function blankMask() {
  return Array.from({ length: 9 }, () => Array(9).fill(false));
}

// ---------- Grid ----------
function buildGrid(state) {
  const grid = state.gridEl;
  grid.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.tabIndex = 0;
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `Row ${r+1} Column ${c+1}`);
      if (r % 3 === 0) cell.classList.add('block-bold-top');
      if (c % 3 === 0) cell.classList.add('block-bold-left');
      if (c % 3 === 2) cell.classList.add('block-bold-right');
      if (r % 3 === 2) cell.classList.add('block-bold-bottom');

      const valueSpan = document.createElement('span');
      valueSpan.className = 'value';
      cell.appendChild(valueSpan);

      cell.addEventListener('click', () => focusCell(cell));
      cell.addEventListener('keydown', (e) => handleCellKeydown(e, state, cell));
      grid.appendChild(cell);
    }
  }
  renderBoard(state);
}

function focusCell(cell) {
  cell.focus();
}

function handleCellKeydown(e, state, cell) {
  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);
  const isEditable = !state.givenMask[r][c];

  // Navigation
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    e.preventDefault();
    let nr = r, nc = c;
    if (e.key === 'ArrowUp') nr = Math.max(0, r-1);
    if (e.key === 'ArrowDown') nr = Math.min(8, r+1);
    if (e.key === 'ArrowLeft') nc = Math.max(0, c-1);
    if (e.key === 'ArrowRight') nc = Math.min(8, c+1);
    const next = findCell(nr, nc);
    next && next.focus();
    return;
  }

  // Actions
  if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault();
    if (isEditable) setValue(state, r, c, 0, true);
    return;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    solveClicked(state);
    return;
  }

  // Entry: digits 1-9
  if (/^[1-9]$/.test(e.key)) {
    e.preventDefault();
    if (!isEditable) return;
    const digit = Number(e.key);
    if (!state.allowedDigits.has(digit)) {
      announce(state, `Digit ${digit} is disallowed by filter.`);
      flashConflict(cell, `Digit ${digit} not allowed`);
      return;
    }
    setValue(state, r, c, digit, true);
    return;
  }

  // Clear with '0'
  if (e.key === '0') {
    e.preventDefault();
    if (isEditable) setValue(state, r, c, 0, true);
  }
}

function findCell(r, c) {
  return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

function setValue(state, r, c, val, pushUndo = false) {
  const prev = state.board[r][c];
  if (prev === val) return;
  if (pushUndo) state.undoStack.push({ r, c, prev });
  state.board[r][c] = val;
  renderBoard(state);
}

function renderBoard(state) {
  state.lastSolveHighlights.clear();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = findCell(r, c);
      const val = state.board[r][c];
      cell.dataset.value = String(val);
      cell.dataset.given = String(state.givenMask[r][c]);
      cell.classList.remove('conflict', 'solved');
      cell.removeAttribute('data-title');
      cell.querySelector('.value').textContent = val === 0 ? '' : String(val);
      cell.setAttribute('aria-label', `Row ${r+1} Column ${c+1}${val ? ` Value ${val}` : ''}`);
      cell.setAttribute('aria-disabled', state.givenMask[r][c] ? 'true' : 'false');
    }
  }
}

// ---------- Controls wiring ----------
function wireControls(state) {
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  modeRadios.forEach(r => r.addEventListener('change', () => {
    state.mode = r.value;
    handleModeChange(state);
  }));
  document.getElementById('difficulty').addEventListener('change', (e) => {
    state.difficulty = e.target.value;
  });
  document.getElementById('newPuzzleBtn').addEventListener('click', () => newPuzzle(state, false));
  document.getElementById('randomizeBtn').addEventListener('click', () => newPuzzle(state, true));
  document.getElementById('validateBtn').addEventListener('click', () => validateClicked(state));
  document.getElementById('solveBtn').addEventListener('click', () => solveClicked(state));
  document.getElementById('hintBtn').addEventListener('click', () => hintClicked(state));
  document.getElementById('undoBtn').addEventListener('click', () => undoClicked(state));
  document.getElementById('clearBtn').addEventListener('click', () => clearClicked(state));
  document.getElementById('animateSolve').addEventListener('change', (e) => { state.anim = e.target.checked; });
  document.getElementById('saveBtn').addEventListener('click', () => saveClicked(state));
  document.getElementById('loadBtn').addEventListener('click', () => loadClicked(state));

  document.querySelectorAll('.digit-allow').forEach(chk => {
    chk.addEventListener('change', () => {
      const v = Number(chk.value);
      if (chk.checked) state.allowedDigits.add(v);
      else state.allowedDigits.delete(v);
      announce(state, `Allowed digits: ${[...state.allowedDigits].sort().join(', ') || 'None'}`);
    });
  });
  document.getElementById('resetDigitsBtn').addEventListener('click', () => {
    state.allowedDigits = new Set([1,2,3,4,5,6,7,8,9]);
    document.querySelectorAll('.digit-allow').forEach(chk => chk.checked = true);
    announce(state, 'Allowed digits reset to 1–9.');
  });

  handleModeChange(state);
}

function handleModeChange(state) {
  const presetControls = document.querySelector('.preset-controls');
  if (state.mode === 'preset') {
    presetControls.style.display = 'block';
    newPuzzle(state, true);
  } else {
    presetControls.style.display = 'block'; // visible for digits filter & save/load
    clearGivenMask(state);
    renderBoard(state);
    announce(state, 'Manual mode. Enter digits or paste a puzzle via URL.');
  }
}

function clearGivenMask(state) {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) state.givenMask[r][c] = false;
}

// ---------- Preset puzzles ----------
function newPuzzle(state, randomize) {
  const list = state.puzzles[state.difficulty] || state.puzzles.medium;
  let idx = 0;
  if (randomize) {
    idx = Math.floor(Math.random() * list.length);
  } else {
    const key = `sudoku_idx_${state.difficulty}`;
    const last = Number(localStorage.getItem(key) || '0');
    idx = (last + 1) % list.length;
    localStorage.setItem(key, String(idx));
  }
  const str = list[idx];
  loadPuzzleString(state, str);
  announce(state, `Loaded ${state.difficulty} puzzle ${idx+1}/${list.length}.`);
}

function loadPuzzleString(state, str) {
  // Accept '.' or '0' as blank
  const cleaned = str.replace(/[^0-9\.]/g, '').replace(/\./g, '0');
  if (cleaned.length !== 81) {
    announce(state, 'Invalid puzzle string length. Expected 81 characters.');
    return;
  }
  clearBoard(state, false);
  for (let i = 0; i < 81; i++) {
    const r = Math.floor(i / 9);
    const c = i % 9;
    const v = Number(cleaned[i]);
    state.board[r][c] = v;
    state.givenMask[r][c] = v !== 0;
  }
  renderBoard(state);
}

// ---------- Validation ----------
function validateClicked(state) {
  const conflicts = findConflicts(state.board);
  clearConflicts();
  if (conflicts.length === 0) {
    announce(state, 'No conflicts found.');
    return;
  }
  for (const { r, c, msg } of conflicts) {
    const cell = findCell(r, c);
    flashConflict(cell, msg);
  }
  announce(state, `Conflicts detected: ${conflicts.length}.`);
}

function clearConflicts() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('conflict');
    cell.removeAttribute('data-title');
  });
}

function flashConflict(cell, msg) {
  cell.classList.add('conflict');
  cell.dataset.title = msg;
}

// Returns array of conflicts with messages
function findConflicts(board) {
  const conflicts = [];
  // Rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map();
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (!v) continue;
      if (seen.has(v)) {
        conflicts.push({ r, c, msg: `Row ${r+1} duplicate ${v}` });
        conflicts.push({ r, c: seen.get(v), msg: `Row ${r+1} duplicate ${v}` });
      } else seen.set(v, c);
    }
  }
  // Cols
  for (let c = 0; c < 9; c++) {
    const seen = new Map();
    for (let r = 0; r < 9; r++) {
      const v = board[r][c];
      if (!v) continue;
      if (seen.has(v)) {
        conflicts.push({ r, c, msg: `Column ${c+1} duplicate ${v}` });
        conflicts.push({ r: seen.get(v), c, msg: `Column ${c+1} duplicate ${v}` });
      } else seen.set(v, r);
    }
  }
  // Boxes
  for (let br = 0; br < 3; br++) for (let bc = 0; bc < 3; bc++) {
    const seen = new Map();
    for (let r = br*3; r < br*3+3; r++) for (let c = bc*3; c < bc*3+3; c++) {
      const v = board[r][c];
      if (!v) continue;
      const key = v;
      if (seen.has(key)) {
        const [or, oc] = seen.get(key);
        conflicts.push({ r, c, msg: `Box ${br+1},${bc+1} duplicate ${v}` });
        conflicts.push({ r: or, c: oc, msg: `Box ${br+1},${bc+1} duplicate ${v}` });
      } else seen.set(key, [r, c]);
    }
  }
  return dedupeConflicts(conflicts);
}
function dedupeConflicts(list) {
  const seen = new Set();
  const out = [];
  for (const x of list) {
    const key = `${x.r}-${x.c}-${x.msg}`;
    if (!seen.has(key)) { seen.add(key); out.push(x); }
  }
  return out;
}

// ---------- Solver ----------
function solveClicked(state) {
  clearConflicts();
  const boardCopy = copyBoard(state.board);

  const { status, solutionsFound, solution } = solveSudoku(boardCopy, { multi: true });

  if (status === 'unsolvable') {
    announce(state, 'Unsolvable puzzle.');
    return;
  }
  if (status === 'multiple') {
    announce(state, `Multiple solutions found (${solutionsFound}).`);
    // Apply first solution to show one valid fill
    applySolution(state, solution, true);
    return;
  }
  if (status === 'solved') {
    applySolution(state, solution, true);
    announce(state, 'Solved.');
  }
}

function hintClicked(state) {
  const boardCopy = copyBoard(state.board);
  const result = solveSudoku(boardCopy, { multi: false });
  if (result.status !== 'solved') {
    announce(state, 'No hint available (unsolvable or ambiguous).');
    return;
  }
  // Find first differing cell that is editable
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (!state.givenMask[r][c] && state.board[r][c] === 0) {
      setValue(state, r, c, result.solution[r][c], true);
      const cell = findCell(r, c);
      cell.classList.add('solved');
      state.lastSolveHighlights.add(r*9+c);
      announce(state, `Hint filled at row ${r+1}, col ${c+1}.`);
      return;
    }
  }
  announce(state, 'No empty editable cells for hint.');
}

function applySolution(state, solution, highlight) {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const prev = state.board[r][c];
    const val = solution[r][c];
    if (prev !== val) {
      state.board[r][c] = val;
      if (highlight && !state.givenMask[r][c]) {
        const cell = findCell(r, c);
        cell.classList.add('solved');
        state.lastSolveHighlights.add(r*9+c);
      }
    }
  }
  renderBoard(state);
}

// Backtracking solver with forward-checking and MRV
function solveSudoku(board, { multi = true } = {}) {
  const domains = initDomains(board);
  if (!propagateAll(board, domains)) return { status: 'unsolvable' };

  const solutions = [];
  const t0 = performance.now();

  let aborted = false;
  const search = () => {
    if (aborted) return;
    // Check time; keep under ~200ms for typical puzzles
    if (performance.now() - t0 > 2000) { // generously allow 2s in worst cases
      aborted = true; return;
    }
    // Find cell with MRV
    let target = null, bestSize = 10;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const size = domains[r][c].size;
        if (size === 0) return false;
        if (size < bestSize) { bestSize = size; target = { r, c }; }
      }
    }
    if (!target) {
      solutions.push(copyBoard(board));
      return multi ? solutions.length < 2 : true; // stop early if not multi
    }

    // Least-constraining-value: sort candidates by frequency in peers
    const candidates = [...domains[target.r][target.c]];
    const lcvScores = candidates.map(v => ({ v, score: lcvScore(domains, target.r, target.c, v) }))
                                .sort((a,b) => a.score - b.score)
                                .map(x => x.v);

    for (const v of lcvScores) {
      const snapshot = snapshotDomains(domains);
      board[target.r][target.c] = v;
      domains[target.r][target.c] = new Set([v]);
      const ok = propagateAssign(board, domains, target.r, target.c, v);
      if (ok) {
        const res = search();
        if (res === true) return true;
        if (multi && solutions.length >= 2) return false;
      }
      // backtrack
      restoreDomains(domains, snapshot);
      board[target.r][target.c] = 0;
    }
    return false;
  };

  const res = search();
  if (solutions.length === 0) return { status: 'unsolvable' };
  if (solutions.length >= 2) return { status: 'multiple', solutionsFound: solutions.length, solution: solutions[0] };
  return { status: 'solved', solution: solutions[0] };
}

// Domains init
function initDomains(board) {
  const domains = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (board[r][c] !== 0) domains[r][c] = new Set([board[r][c]]);
    else domains[r][c] = new Set([1,2,3,4,5,6,7,8,9].filter(v => isAllowed(board, r, c, v)));
  }
  return domains;
}

function propagateAll(board, domains) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0 && domains[r][c].size === 1) {
        const val = [...domains[r][c]][0];
        board[r][c] = val;
        if (!propagateAssign(board, domains, r, c, val)) return false;
        changed = true;
      }
    }
  }
  return true;
}

function propagateAssign(board, domains, r, c, val) {
  // remove val from peers
  for (const [pr, pc] of peers(r, c)) {
    if (pr === r && pc === c) continue;
    const d = domains[pr][pc];
    if (board[pr][pc] === 0 && d.has(val)) {
      d.delete(val);
      if (d.size === 0) return false;
    }
  }
  return true;
}

function peers(r, c) {
  const ps = [];
  for (let i = 0; i < 9; i++) {
    ps.push([r, i], [i, c]);
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let rr = br; rr < br+3; rr++) for (let cc = bc; cc < bc+3; cc++) ps.push([rr, cc]);
  // Dedup
  const uniq = new Set(ps.map(([rr,cc]) => rr*9+cc));
  return [...uniq].map(k => [Math.floor(k/9), k%9]);
}

function isAllowed(board, r, c, v) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === v) return false;
    if (board[i][c] === v) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let rr = br; rr < br+3; rr++) for (let cc = bc; cc < bc+3; cc++) {
    if (board[rr][cc] === v) return false;
  }
  return true;
}

function lcvScore(domains, r, c, v) {
  // Count how many peers include 'v' in their domain
  let score = 0;
  for (const [pr, pc] of peers(r, c)) {
    if (pr === r && pc === c) continue;
    if (domains[pr][pc].has(v)) score++;
  }
  return score;
}

function snapshotDomains(domains) {
  return domains.map(row => row.map(set => new Set(set)));
}
function restoreDomains(domains, snapshot) {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    domains[r][c] = snapshot[r][c];
  }
}
function copyBoard(board) {
  return board.map(row => row.slice());
}

// ---------- Actions ----------
function undoClicked(state) {
  const last = state.undoStack.pop();
  if (!last) { announce(state, 'Nothing to undo.'); return; }
  state.board[last.r][last.c] = last.prev;
  renderBoard(state);
}

function clearBoard(state, resetMask = true) {
  state.undoStack = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (!state.givenMask[r][c]) state.board[r][c] = 0;
    if (resetMask) state.givenMask[r][c] = false;
  }
  renderBoard(state);
}

function clearClicked(state) {
  clearBoard(state, state.mode === 'manual');
  announce(state, 'Cleared user entries.');
}

function saveClicked(state) {
  const payload = {
    board: state.board,
    givenMask: state.givenMask,
    mode: state.mode,
    difficulty: state.difficulty
  };
  localStorage.setItem('sudoku_saved', JSON.stringify(payload));
  announce(state, 'Puzzle saved to device.');
}

function loadClicked(state) {
  const data = localStorage.getItem('sudoku_saved');
  if (!data) { announce(state, 'No saved puzzle found.'); return; }
  try {
    const payload = JSON.parse(data);
    state.board = payload.board;
    state.givenMask = payload.givenMask;
    state.mode = payload.mode || 'manual';
    state.difficulty = payload.difficulty || 'medium';
    document.querySelectorAll('input[name="mode"]').forEach(r => r.checked = (r.value === state.mode));
    document.getElementById('difficulty').value = state.difficulty;
    renderBoard(state);
    announce(state, 'Puzzle loaded.');
  } catch {
    announce(state, 'Failed to load saved puzzle.');
  }
}

// ---------- URL param ----------
function applyURLPuzzle(state) {
  const params = new URLSearchParams(window.location.search);
  const puzzle = params.get('puzzle');
  if (puzzle) {
    loadPuzzleString(state, puzzle);
    announce(state, 'Loaded puzzle from URL parameter.');
  }
}

// ---------- Status ----------
function announce(state, msg) {
  state.statusEl.textContent = msg;
}

// ---------- Public API ----------
function exposeAPI(state) {
  window.getBoard = () => copyBoard(state.board);
  window.setBoard = (board) => {
    if (!Array.isArray(board) || board.length !== 9 || board.some(row => !Array.isArray(row) || row.length !== 9)) {
      throw new Error('setBoard expects a 9x9 array of numbers (0-9).');
    }
    clearGivenMask(state);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const v = Number(board[r][c]) || 0;
      state.board[r][c] = v;
      state.givenMask[r][c] = v !== 0;
    }
    renderBoard(state);
    announce(state, 'Board set via API.');
  };
  window.solveBoard = () => {
    const boardCopy = copyBoard(state.board);
    const res = solveSudoku(boardCopy, { multi: true });
    return { status: res.status, solutionsFound: res.solutionsFound };
  };
}
