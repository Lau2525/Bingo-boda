// --- Translations Data ---
const translations = {
    es: {
        title: "Boda Bingo",
        instructions: "Marca todos los momentos especiales que observes durante nuestra boda y gana.",
        qrBtn: "Compartir Código QR",
        footerText: "Gracias por acompañarnos en este día tan especial.",
        qrTitle: "Escanea para Jugar",
        qrInstruction: "Muestra este código a otros invitados para que puedan unirse al juego.",
        freeSpace: "Laura & Marcus\n09.05.2026",
        phrases: [
            "Alguno de los novios llora", "La novia lanza el ramo", "El novio lanza el azahar", "Alguien atrapa el ramo",
            "Alguien atrapa el azahar", "La novia se quita el velo", "Los esposos se ríen", "Los esposos se dan un beso",
            "Parten el pastel", "Alguien dice ¡Que vivan los novios!", "Los invitados aplauden", "La ceremonia religiosa ha terminado",
            "Empezó el banquete", "Los esposos se toman de las manos", "Alguien felicita a los novios", "Alguien empieza a bailar",
            "Alguien hace un brindis", "Suena un violín en la celebración", "Los novios hablan en inglés", "El fotógrafo toma foto a los novios",
            "Empieza la música del DJ", "Se abre la mesa de dulces", "Se repartieron los recuerdos", "Se tomó una foto familiar"
        ]
    },
    en: {
        title: "Wedding Bingo",
        instructions: "Mark all the special moments you observe during our wedding and win.",
        qrBtn: "Share QR Code",
        footerText: "Thank you for joining us on this special day.",
        qrTitle: "Scan to Play",
        qrInstruction: "Show this code to other guests so they can join the game.",
        freeSpace: "Laura & Marcus\n09.05.2026",
        phrases: [
            "One of the newlyweds cries", "The bride throws the bouquet", "The groom throws the boutonnière", "Someone catches the bouquet",
            "Someone catches the boutonnière", "The bride takes off her veil", "The spouses laugh", "The spouses kiss",
            "They cut the cake", "Someone says 'Long live the newlyweds!'", "Guests clap", "The religious ceremony has ended",
            "The banquet starts", "The spouses hold hands", "Someone congratulates the couple", "Someone starts dancing",
            "Someone makes a toast", "A violin plays at the celebration", "The couple speaks in English", "Photographer takes a photo of the couple",
            "DJ music starts", "Dessert table opens", "Favors are handed out", "A family photo is taken"
        ]
    }
};

// --- App State ---
let currentLang = 'es';
let playerName = '';
let hasWon = false;
let boardState = Array(25).fill(false); // 5x5 board
// Free space is usually the middle one (index 12)
boardState[12] = true; 

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initBoard();
    setLanguage(currentLang);
    checkName();
});

// --- Functions ---
function initBoard() {
    const board = document.getElementById('bingo-board');
    board.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (i === 12) {
            cell.classList.add('free-space', 'marked');
        } else {
            cell.addEventListener('click', () => toggleCell(i));
        }
        
        const textSpan = document.createElement('span');
        cell.appendChild(textSpan);
        board.appendChild(cell);
    }
}

function updateBoardText() {
    const cells = document.querySelectorAll('.cell span');
    const phrases = [...translations[currentLang].phrases];
    
    // In a real game, you might shuffle phrases here
    // For now, we just map them directly so all boards look the same unless shuffled
    
    let phraseIndex = 0;
    cells.forEach((span, i) => {
        if (i === 12) {
            span.innerText = translations[currentLang].freeSpace;
        } else {
            if (phrases[phraseIndex]) {
                span.innerText = phrases[phraseIndex];
            }
            phraseIndex++;
        }
    });

    // Restore classes based on state
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach((cell, i) => {
        if (boardState[i]) {
            cell.classList.add('marked');
        } else {
            cell.classList.remove('marked');
        }
    });
}

function toggleCell(index) {
    boardState[index] = !boardState[index];
    const cells = document.querySelectorAll('.cell');
    if (boardState[index]) {
        cells[index].classList.add('marked');
    } else {
        cells[index].classList.remove('marked');
    }
    saveState();
    checkWinCondition();
}

function checkWinCondition() {
    // 5x5 Grid logic
    const winningCombinations = [
        // Rows
        [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
        // Columns
        [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
        // Diagonals
        [0,6,12,18,24], [4,8,12,16,20]
    ];

    let isWin = false;
    for (const combo of winningCombinations) {
        if (combo.every(index => boardState[index])) {
            isWin = true;
            break;
        }
    }

    const winBtn = document.getElementById('win-btn');
    if (isWin && !hasWon) {
        winBtn.style.display = 'block';
    } else {
        winBtn.style.display = 'none';
    }
}

function checkWin() {
    hasWon = true;
    saveState();
    
    // Esconder botón
    document.getElementById('win-btn').style.display = 'none';
    
    // Mostrar anuncio en pantalla local
    announceWinner(playerName);
    
    // Action when they click WIN
    alert(currentLang === 'es' ? "¡Felicidades! Eres el ganador. Muestra tu pantalla a los novios." : "Congratulations! You won. Show your screen to the couple.");
}


function announceWinner(name) {
    const banner = document.getElementById('winner-banner');
    const title = document.getElementById('winner-banner-title');
    const text = document.getElementById('winner-banner-text');
    banner.style.display = 'block';
    
    title.innerText = currentLang === 'es' ? '¡Tenemos un Ganador!' : 'We have a Winner!';
    text.innerText = currentLang === 'es' 
        ? `¡Felicidades a ${name} por completar su tablero primero!` 
        : `Congratulations to ${name} for completing the board first!`;
}

function setLanguage(lang) {
    currentLang = lang;
    
    // Update active button
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    
    // Update texts
    document.getElementById('main-title').innerText = translations[lang].title;
    document.getElementById('instructions').innerText = translations[lang].instructions;
    document.getElementById('footer-text').innerText = translations[lang].footerText;
    
    // Update modal texts if needed
    document.getElementById('name-title').innerText = lang === 'es' ? '¡Bienvenido!' : 'Welcome!';
    document.getElementById('name-instruction').innerText = lang === 'es' ? 'Por favor, ingresa tu nombre para comenzar y guardar tu progreso.' : 'Please enter your name to start and simply save your progress.';
    document.getElementById('guest-name-input').placeholder = lang === 'es' ? 'Tu nombre' : 'Your name';
    document.getElementById('name-submit-btn').innerText = lang === 'es' ? 'Comenzar' : 'Start';
    document.getElementById('reset-btn').innerText = lang === 'es' ? 'Reiniciar Tablero' : 'Restart Board';
    
    if (hasWon && playerName) {
        announceWinner(playerName);
    }
    
    if (playerName) showPlayerName();
    
    updateBoardText();
    saveState();
}

// --- Persistence Logic ---
function loadState() {
    const savedName = localStorage.getItem('weddingBingoName');
    if (savedName) playerName = savedName;

    const savedBoard = localStorage.getItem('weddingBingoBoard');
    if (savedBoard) {
        try {
            boardState = JSON.parse(savedBoard);
        } catch(e) {}
    }

    const savedLang = localStorage.getItem('weddingBingoLang');
    if (savedLang) currentLang = savedLang;
    
    const savedWin = localStorage.getItem('weddingBingoWin');
    if (savedWin === 'true') {
        hasWon = true;
    }
}

function saveState() {
    localStorage.setItem('weddingBingoName', playerName);
    localStorage.setItem('weddingBingoBoard', JSON.stringify(boardState));
    localStorage.setItem('weddingBingoLang', currentLang);
    localStorage.setItem('weddingBingoWin', hasWon ? 'true' : 'false');
}

function checkName() {
    if (!playerName) {
        document.getElementById('name-modal').classList.add('show');
    } else {
        showPlayerName();
    }
}

function saveName() {
    const input = document.getElementById('guest-name-input').value.trim();
    if (input) {
        playerName = input;
        saveState();
        document.getElementById('name-modal').classList.remove('show');
        showPlayerName();
    }
}

function showPlayerName() {
    const display = document.getElementById('player-name-display');
    display.style.display = 'block';
    display.innerText = currentLang === 'es' ? `Jugador: ${playerName}` : `Player: ${playerName}`;
}

function resetGame() {
    let msg = currentLang === 'es' 
        ? "¿Estás seguro de que quieres reiniciar el tablero? Se borrará todo tu progreso." 
        : "Are you sure you want to restart the board? All your progress will be cleared.";
        
    let title = currentLang === 'es' ? '¿Estás seguro?' : 'Are you sure?';
    
    if (hasWon) {
        title = currentLang === 'es' ? '¡Espera, ya ganaste!' : 'Wait, you won!';
        msg = currentLang === 'es' 
            ? "¡Eres un ganador! ¿Estás SEGURO de reiniciar tu tablero desde cero? Perderás tu letrero de victoria." 
            : "You are a winner! Are you SURE you want to restart your board from zero? You will lose your victory banner.";
    }

    document.getElementById('confirm-title').innerText = title;
    document.getElementById('confirm-text').innerText = msg;
    document.getElementById('confirm-cancel-btn').innerText = currentLang === 'es' ? 'Cancelar' : 'Cancel';
    document.getElementById('confirm-ok-btn').innerText = currentLang === 'es' ? 'Reiniciar' : 'Restart';
    
    document.getElementById('confirm-modal').classList.add('show');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('show');
}

function executeReset() {
    closeConfirmModal();
    boardState = Array(25).fill(false);
    boardState[12] = true; // Free space
    hasWon = false;
    
    // Hide banner and Win Button
    document.getElementById('winner-banner').style.display = 'none';
    document.getElementById('win-btn').style.display = 'none';
    
    saveState();
    updateBoardText();
    checkWinCondition();
}
