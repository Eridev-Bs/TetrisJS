// Configuración del tablero y canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const bloque = 20; // Tamaño del bloque
const tablero_Ancho = 21; // Filas del tablero
const tablero_largo = 14; // Columnas del tablero
var puntaje = 0
var Puntostiempo = 200;
var tiempo;
canvas.width = bloque * tablero_largo;
canvas.height = bloque * tablero_Ancho;
context.scale(bloque, bloque);

const board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
];

// Definición de piezas
const piezas = [
    { forma: [[1, 1], [1, 1]], color: 'yellow' }, // Cuadrado (O)
    { forma: [[1, 1, 1, 1]], color: 'cyan' }, // Línea (I)
    { forma: [[1, 0, 0], [1, 1, 1]], color: 'blue' }, // L invertida (J)
    { forma: [[0, 0, 1], [1, 1, 1]], color: 'orange' }, // L normal (L)
    { forma: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // S
    { forma: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Z
    { forma: [[1, 1, 1], [0, 1, 0]], color: 'purple' } // T
];

// la pieza puede rotar
function puedeRotar(nuevaForma) {
    return nuevaForma.every((row, y) => {
        return row.every((value, x) => {
            const newX = x + pieza.position.x;
            const newY = y + pieza.position.y;
            return (
                value === 0 ||
                (newX >= 0 && newX < tablero_largo && newY >= 0 && newY < tablero_Ancho && board[newY][newX] === 0)
            );
        });
    });
}

let pieza = crearPiezaAleatoria();

// Crear pieza aleatoria
function crearPiezaAleatoria() {
    const randomIndex = Math.floor(Math.random() * piezas.length);
    const nuevaPieza = piezas[randomIndex];
    return {
        position: { x: Math.floor(tablero_largo / 2) - 1, y: 0 },
        forma: nuevaPieza.forma,
        color: nuevaPieza.color
    };
}

function update() {
    mostrarPuntaje();
    draw();
    window.requestAnimationFrame(update);
}

// Dibujar el tablero y las piezas
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja el tablero
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = 'gray';
                context.fillRect(x, y, 1, 1);
            }
        });
    });

    // Dibuja la pieza actual
    pieza.forma.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = pieza.color;
                context.fillRect(x + pieza.position.x, y + pieza.position.y, 1, 1);
            }
        });
    });
}

// Función para rotar la pieza
function rotarPieza() {
    // Transponer la matriz de la pieza
    const nuevaForma = pieza.forma[0].map((_, index) => pieza.forma.map(row => row[index])).reverse();
    
    // Verifica si la nueva forma se puede colocar
    if (puedeRotar(nuevaForma)) {
        pieza.forma = nuevaForma; // Si puede rotar, actualiza la forma
    }
}

// Manejo de movimientos y colisiones
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        pieza.position.x--;
        if (colisiones()) {
            pieza.position.x++;
        }
    }
    if (event.key === 'ArrowRight') {
        pieza.position.x++;
        if (colisiones()) {
            pieza.position.x--;
        }
    }
    if (event.key === 'ArrowDown') {
        if (canMove(0, 1)) {
            pieza.position.y++;
        } else {
            fijarPieza();
        }
    }
    if (event.key === 'ArrowUp') {
        rotarPieza();
    }
});

// Verificación de colisiones con el tablero y otras piezas
function colisiones() {
    return pieza.forma.some((row, y) => {
        return row.some((value, x) => {
            const newX = x + pieza.position.x;
            const newY = y + pieza.position.y;
            return value !== 0 && (board[newY]?.[newX] !== 0 || newY >= tablero_Ancho);
        });
    });
}

function canMove(deltaX, deltaY) {
    return pieza.forma.every((row, y) => {
        return row.every((value, x) => {
            const newX = x + pieza.position.x + deltaX;
            const newY = y + pieza.position.y + deltaY;
            return (
                value === 0 ||
                (newX >= 0 && newX < tablero_largo && newY >= 0 && newY < tablero_Ancho && board[newY][newX] === 0)
            );
        });
    });
}

//TETRISSS
function eliminarFilasCompletas() {
    for (let y = tablero_Ancho - 1; y >= 0; y--) {
        if (board[y].every(value => value !== 0)) {
            // Elimina la fila completa
            board.splice(y, 1);
            // Agrega una nueva fila vacía en la parte superior
            board.unshift(Array(tablero_largo).fill(0));
            puntaje += 1000; // Sumar el valor al puntaje
            mostrarPuntaje(); // Actualiza la visualización del puntaje
        }
    }
}

function mostrarPuntaje() {
    const puntajeElemento = document.getElementById("Puntaje");
    puntajeElemento.textContent = "Puntaje: " + puntaje; // Actualiza el contenido
}

// Fija la pieza al tablero cuando ya no puede moverse hacia abajo
function fijarPieza() {
    pieza.forma.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[y + pieza.position.y][x + pieza.position.x] = value;
            }
        });
    });
    eliminarFilasCompletas();
    pieza = crearPiezaAleatoria();
}

//TIEMPO

function bajarPieza() {
    if (canMove(0, 1)) {
        pieza.position.y++;
    } else {
        fijarPieza(); // Fija la pieza al tablero si no se puede mover hacia abajo
        pieza = crearPiezaAleatoria(); // Crea una nueva pieza
    }
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
    interval = setInterval(() => {
        if(interval == 200){
            puntaje += Puntostiempo;
            mostrarPuntaje();
        }
        bajarPieza(); // Llama a la función que baja la pieza
        draw(); // Vuelve a dibujar el tablero y las piezas
    }, 1500); // 1000 milisegundos (1 segundos)
}

//QUE COMIENSE EL JUEGO
iniciarTemporizador();


// Inicia el bucle de actualización
update();
