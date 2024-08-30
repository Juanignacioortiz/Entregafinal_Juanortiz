const productos = [
    { nombre: 'toji', altoCm: 60, anchoCm: 25, minutosUtilizados: 20, precioVenta: 790 },
    { nombre: 'berserk', altoCm: 60, anchoCm: 50, minutosUtilizados: 15, precioVenta: 790 },
    { nombre: 'nanami', altoCm: 60, anchoCm: 35, minutosUtilizados: 16, precioVenta: 790 },
    { nombre: 'goku', altoCm: 60, anchoCm: 45, minutosUtilizados: 22, precioVenta: 890 },
    { nombre: 'hisoka', altoCm: 55, anchoCm: 40, minutosUtilizados: 12, precioVenta: 790 },
    { nombre: 'roger', altoCm: 50, anchoCm: 40, minutosUtilizados: 21, precioVenta: 890 },
    { nombre: 'zenitsu', altoCm: 40, anchoCm: 40, minutosUtilizados: 16, precioVenta: 790 },
    { nombre: 'senkuu', altoCm: 60, anchoCm: 35, minutosUtilizados: 13, precioVenta: 790 },
    { nombre: 'mugiwaras', altoCm: 60, anchoCm: 40, minutosUtilizados: 11, precioVenta: 790 },
    { nombre: 'zoro', altoCm: 60, anchoCm: 30, minutosUtilizados: 19, precioVenta: 790 }
];

function inicializarDropdown() {
    const dropdown = document.getElementById('object-dropdown');
    productos.forEach((producto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = producto.nombre;
        dropdown.appendChild(option);
    });
}

function mostrarDetallesProducto(index) {
    const producto = productos[index];
    if (producto) {
        document.getElementById('object-details').innerHTML = `
            Nombre: ${producto.nombre} <br>
            Altura: ${producto.altoCm} cm <br>
            Anchura: ${producto.anchoCm} cm <br>
            Tiempo de Producción: ${producto.minutosUtilizados} minutos <br>
            Precio de Venta: $${producto.precioVenta}
        `;
        document.getElementById('height').value = producto.altoCm;
        document.getElementById('width').value = producto.anchoCm;
        document.getElementById('production-time').value = producto.minutosUtilizados;
        document.getElementById('price').value = producto.precioVenta;
    }
}

function calcularGastoPorDimensiones(altoCm, anchoCm, valorPorCm2) {
    const areaCm2 = altoCm * anchoCm;
    return parseFloat((areaCm2 * valorPorCm2).toFixed(2));
}

function calcularGastoVidaUtilEnPesos(minutosUtilizados, costoPorMinuto) {
    return parseFloat((minutosUtilizados * costoPorMinuto).toFixed(2));
}

function calcularGastoPackaging(cantidadProductos, gastoInicial, gastoVariablePorUnidad) {
    let gastoPackaging = gastoInicial;
    if (cantidadProductos > 1) {
        gastoPackaging += (cantidadProductos - 1) * gastoVariablePorUnidad;
    }
    return parseFloat(gastoPackaging.toFixed(2));
}

function sumarResultados(altoCm, anchoCm, valorPorCm2, minutosUtilizados, costoPorMinuto, cantidadProductos, gastoInicial, gastoVariablePorUnidad, precioVenta) {
    const resultado1 = calcularGastoPorDimensiones(altoCm, anchoCm, valorPorCm2);
    const resultado2 = calcularGastoVidaUtilEnPesos(minutosUtilizados, costoPorMinuto);
    const resultado3 = calcularGastoPackaging(cantidadProductos, gastoInicial, gastoVariablePorUnidad);

    const total = resultado1 + resultado2 + resultado3;
    const ganancia = parseFloat((precioVenta - total).toFixed(2));
    const cincuentaPorCientoPrecioVenta = precioVenta * 0.5;
    let mensaje = '';

    if (ganancia > cincuentaPorCientoPrecioVenta) {
        mensaje = `La ganancia ($${ganancia}) fue mayor al 50% del precio de venta ($${precioVenta}) por ende fue buena.`;
    } else {
        mensaje = `La ganancia ($${ganancia}) fue igual o menor al 50% del precio de venta ($${precioVenta}) por ende fue mala.`;
    }

    switch (true) {
        case (ganancia > 600):
            mensaje += ' ¡Excelente ganancia!';
            break;
        case (ganancia > 400):
            mensaje += ' ¡Buena ganancia!';
            break;
        case (ganancia > 200):
            mensaje += ' ¡Ganancia aceptable!';
            break;
        case (ganancia > 0):
            mensaje += ' ¡Ganancia mínima!';
            break;
        default:
            mensaje += ' ¡No hubo ganancia!';
    }

    return {
        mensaje: mensaje,
        resultadoTotal: parseFloat(total.toFixed(2))
    };
}

function calcularResultados() {
    const height = parseFloat(document.getElementById('height').value);
    const width = parseFloat(document.getElementById('width').value);
    const productionTime = parseFloat(document.getElementById('production-time').value);
    const price = parseFloat(document.getElementById('price').value);
    const selectedIndex = parseInt(document.getElementById('object-dropdown').value);

    if (isNaN(height) || isNaN(width) || isNaN(productionTime) || isNaN(price)) {
        Toastify({
            text: "Rellene todas las casillas",
            className: "info",
            style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }
        }).showToast();
        return;
    }

    const producto = selectedIndex === -1 ? null : productos[selectedIndex];

    const datos = producto ? {
        altoCm: producto.altoCm,
        anchoCm: producto.anchoCm,
        minutosUtilizados: producto.minutosUtilizados,
        precioVenta: producto.precioVenta,
        nombre: producto.nombre
    } : {
        altoCm: height,
        anchoCm: width,
        minutosUtilizados: productionTime,
        precioVenta: price,
        nombre: 'Personalizado'
    };

    const valorPorCm2 = 0.017; 
    const costoPorMinuto = 0.16; 
    const cantidadProductos = 1; 
    const gastoInicial = 200;
    const gastoVariablePorUnidad = 10; 

    const { mensaje, resultadoTotal } = sumarResultados(
        datos.altoCm, datos.anchoCm, valorPorCm2, datos.minutosUtilizados, costoPorMinuto,
        cantidadProductos, gastoInicial, gastoVariablePorUnidad, datos.precioVenta
    );

    document.getElementById('result').innerHTML = 
        `Gasto Total: $${resultadoTotal} <br>
        ${mensaje}`;

    document.getElementById('height').value = '';
    document.getElementById('width').value = '';
    document.getElementById('production-time').value = '';
    document.getElementById('price').value = '';

    const tarjeta = {
        nombre: datos.nombre,
        alto: datos.altoCm,
        ancho: datos.anchoCm,
        precio: datos.precioVenta,
        tiempoProduccion: datos.minutosUtilizados,
        costo: resultadoTotal,
        ganancia: parseFloat((datos.precioVenta - resultadoTotal).toFixed(2))
    };

    let tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    tarjetas.push(tarjeta);
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

    mostrarTarjetas();

    Toastify({
        text: "Se ha agregado un nuevo elemento",
        className: "info",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    document.getElementById('object-dropdown').selectedIndex = 0; 
}



function mostrarTarjetas() {
    const tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    const container = document.getElementById('tarjetas-container');
    container.innerHTML = '';
    tarjetas.forEach((tarjeta, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${tarjeta.nombre}</h3>
            <p>Altura: ${tarjeta.alto} cm</p>
            <p>Anchura: ${tarjeta.ancho} cm</p>
            <p>Precio: $${tarjeta.precio}</p>
            <p>Tiempo de Producción: ${tarjeta.tiempoProduccion} minutos</p>
            <p>Costo: $${tarjeta.costo}</p>
            <p>Ganancia: $${tarjeta.ganancia}</p>
            <button class="delete-btn" data-index="${index}">Eliminar</button>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        let tarjetas = JSON.parse(localStorage.getItem('tarjetas')) || [];
        tarjetas.splice(index, 1); 
        localStorage.setItem('tarjetas', JSON.stringify(tarjetas));
        mostrarTarjetas();  
        Toastify({
            text: "Se ha eliminado un elemento",
            className: "info",
            style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }
        }).showToast();
    }
});

document.getElementById('delete-all-btn').addEventListener('click', () => {
    localStorage.removeItem('tarjetas');
    mostrarTarjetas(); 
    Toastify({
        text: "Se han eliminado todos los elementos",
        className: "info",
        style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
    }).showToast();
});



document.addEventListener('DOMContentLoaded', () => {
    inicializarDropdown();

    document.getElementById('object-dropdown').addEventListener('change', (event) => {
        const index = parseInt(event.target.value);
        if (index === -1) {
            document.getElementById('object-details').innerHTML = 'Selecciona un objeto para ver sus detalles.';
            document.getElementById('height').value = '';
            document.getElementById('width').value = '';
            document.getElementById('production-time').value = '';
            document.getElementById('price').value = '';
        } else {
            mostrarDetallesProducto(index);
        }
    });

    document.getElementById('calculate-btn').addEventListener('click', calcularResultados);


    mostrarTarjetas();
});

function obtenerCotizacionDolar() {
    const url = 'https://api.exchangerate-api.com/v4/latest/USD'; 

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tasaCambio = data.rates.UYU;
            document.getElementById('exchange-rate').textContent = `1 USD = ${tasaCambio} UYU`;
        })
        .catch(error => {
            console.error('Error al obtener la cotización:', error);
            document.getElementById('exchange-rate').textContent = 'No se pudo obtener la cotización.';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarDropdown();
    obtenerCotizacionDolar(); 

    document.getElementById('object-dropdown').addEventListener('change', (event) => {
        const index = parseInt(event.target.value);
        if (index === -1) {
            document.getElementById('object-details').innerHTML = 'Selecciona un objeto para ver sus detalles.';
            document.getElementById('height').value = '';
            document.getElementById('width').value = '';
            document.getElementById('production-time').value = '';
            document.getElementById('price').value = '';
        } else {
            mostrarDetallesProducto(index);
        }
    });

    document.getElementById('calculate-btn').addEventListener('click', calcularResultados);

    mostrarTarjetas();
});
