// Número máximo de intentos y colores en la combinación
const MAX_INTENTOS = 10;
const MAX_COMBI_COLORES = 4;

// Colores disponibles y códigos para colores especiales
const COLORS = ['white', 'blue', 'green', 'violet', 'yellow', 'red', 'orange', 'cyan'];
const GREY = "grey";
const WHITE = "white";
const BLACK = "black";

// Arreglo para almacenar la combinación secreta y las combinaciones del usuario
const master = [];
const userCombis = [];

// Contadores y bandera para el estado del juego
let intento = 0;
let juegoTerminado = false;

// Inicialización del juego al cargar la página
function init() {
    CodigoAleatorio();
    CrearFilas();
    ActualizarCombinacion();
}

// Genera una combinación secreta aleatoria
function CodigoAleatorio() {
    for (let i = 0; i < MAX_COMBI_COLORES; i++) {
        let codigoAleatorio = Math.floor(Math.random() * COLORS.length);
        master.push(COLORS[codigoAleatorio]);
    }
    console.log(master);
}

// Crea las filas de la interfaz de juego
function CrearFilas() {
    for (let i = 0; i < MAX_INTENTOS; i++) {
        let contenedor = document.getElementById('contenedor');
        let fila = document.createElement('div');
        fila.className = 'rowResult w100';

        // Añade celdas para la combinación del usuario
        for (let j = 0; j < MAX_COMBI_COLORES; j++) {
            let CeldaUsuario = document.createElement('div');
            CeldaUsuario.className = 'cel celUserCombi';
            fila.appendChild(CeldaUsuario);
        }

        // Añade círculos para mostrar el resultado de la combinación
        for (let k = 0; k < MAX_COMBI_COLORES; k++) {
            let circulo = document.createElement('div');
            circulo.className = 'cercleResult';
            fila.appendChild(circulo);
        }
        contenedor.appendChild(fila);
    }
}

// Crea la sección de selección de colores
function SeleccionColores() {
    // Obtiene el contenedor donde se agregarán los colores seleccionables
    let contenedor = document.getElementById('colores-seleccion');
    
    // Itera sobre cada color en el arreglo COLORS
    for (let color of COLORS) {
        // Crea un nuevo elemento div para representar el color
        let CrearColor = document.createElement('div');
        
        // Asigna la clase 'div' al nuevo elemento
        CrearColor.className = 'div';
        
        // Establece el contenido HTML del nuevo elemento con un div interno
        CrearColor.innerHTML = `<div class="w100 cel flex" style="background-color: ${color}" onclick="añadeColor('${color}')"></div>`;
        
        // Agrega el nuevo color al contenedor de colores seleccionables
        contenedor.querySelector('.w100').appendChild(CrearColor);
    }
}


// Actualiza el estilo de la combinación secreta
function ActualizarCombinacion() {
    // Obtiene el elemento que contiene la combinación secreta
    let SeccionMaster = document.getElementById('master');
    
    // Obtiene todas las celdas que representan la combinación secreta
    let CeldasMaster = SeccionMaster.querySelectorAll('.cel');
    
    // Itera sobre las celdas de la combinación secreta
    for (let i = 0; i < MAX_COMBI_COLORES; i++) {
        // Establece el color de fondo de cada celda como gris
        CeldasMaster[i].style.backgroundColor = GREY;
    }
}

// Añade un color seleccionado por el usuario a la combinación actual
function añadeColor(color) {
    // Verifica si el juego no ha terminado
    if (!juegoTerminado) {
        // Obtiene la fila actual que no ha sido marcada como revisada
        let FilaActual = document.querySelector('.rowResult:not(.checked)');
        
        // Obtiene las celdas de la combinación del usuario en la fila actual
        let CeldasUsuario = FilaActual.querySelectorAll('.celUserCombi');
        
        // Bandera para verificar si se ha encontrado una celda disponible
        let celdaEncontrada = false;

        // Itera sobre las celdas de la combinación del usuario
        for (let i = 0; i < MAX_COMBI_COLORES && !celdaEncontrada; i++) {
            // Verifica si la celda no tiene un color seleccionado
            if (!CeldasUsuario[i].style.backgroundColor) {
                // Añade el color seleccionado por el usuario a la celda
                CeldasUsuario[i].style.backgroundColor = color;
                celdaEncontrada = true;
            }
        }
    }
}


// Comprueba la combinación del usuario y muestra el resultado
function Comprobar() {
    // Obtiene la fila actual que no ha sido marcada como revisada
    let FilaActual = document.querySelector('.rowResult:not(.checked)');
    
    // Obtiene las celdas de la combinación del usuario en la fila actual
    let CeldasUsuario = FilaActual.querySelectorAll('.celUserCombi');
    
    // Obtiene los círculos de resultado en la fila actual
    let ResultadoCirculos = FilaActual.querySelectorAll('.cercleResult');
    
    // Contadores para aciertos correctos e incorrectos
    let aciertosCorrectos = 0;
    let aciertosIncorrectos = 0;
    
    // Almacena los colores seleccionados por el usuario en esta iteración
    let combinacionUsuario = [];

    // Itera sobre las celdas de la combinación del usuario
    for (let i = 0; i < MAX_COMBI_COLORES; i++) {
        // Obtiene el color seleccionado por el usuario en esta celda
        let ColorUsuario = CeldasUsuario[i].style.backgroundColor;
        
        // Agrega el color a la combinación del usuario
        combinacionUsuario.push(ColorUsuario);

        // Compara y actualiza los círculos de resultado
        if (ColorUsuario == master[i]) {
            ResultadoCirculos[i].style.backgroundColor = BLACK;
            aciertosCorrectos++;
        } else if (master.includes(ColorUsuario)) {
            ResultadoCirculos[i].style.backgroundColor = WHITE;
            aciertosIncorrectos++;
        } else {
            ResultadoCirculos[i].style.backgroundColor = GREY;
        }
    }

    // Marca la fila actual como revisada
    FilaActual.classList.add('checked');
    
    // Obtiene el elemento de información en el HTML
    let informacion = document.getElementById('info');
    
    // Actualiza el texto de información con el intento actual y la combinación del usuario
    informacion.textContent = 'Intento ' + (intento + 1) + ': ' + combinacionUsuario.join(', ');

    // Verifica si el usuario ha ganado o ha agotado los intentos
    if (aciertosCorrectos == MAX_COMBI_COLORES) {
        FinalJuego(true);
    }
    intento++;

    if (intento == MAX_INTENTOS) {
        FinalJuego(false);
    }
}


// Finaliza el juego y muestra el mensaje de resultado
function FinalJuego(ganado) {
    juegoTerminado = true;
    let informacion = document.getElementById('info');
    if (ganado) {
        informacion.textContent = "¡Felicidades, Has conseguido adivinar la combinación secreta!🎉";
        let PintarCeldas = document.querySelectorAll('.w25 .cel');

        for (let i = 0; i < MAX_COMBI_COLORES; i++) {
            PintarCeldas[i].style.backgroundColor = master[i];
        }
    } else {
        informacion.textContent = `¡Lo siento, has perdido! La combinación era: ${master.join(', ')}`;
    }
}
