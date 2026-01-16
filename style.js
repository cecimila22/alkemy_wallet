$(document).ready(function () {

    // LOGIN
    if ($("#loginForm").length) {
        $("#loginForm").submit(function (e) {
            e.preventDefault();
            const email = $("#email").val().trim();
            const password = $("#password").val().trim();

            if (email !== '' && password !== '') {
                mostrarAlerta("Credenciales correctas, redirigiendo...", "success");

                if (!localStorage.getItem("saldo")) {
                    localStorage.setItem("saldo", 10000);
                    localStorage.setItem("contactos", JSON.stringify([]));
                    localStorage.setItem("transacciones", JSON.stringify([]));
                }

                setTimeout(() => {
                    window.location.href = "menu.html";
                }, 800);

            } else {
                mostrarAlerta("Credenciales incorrectas", "danger");
            }
        });
    }

    // MENÚ
    if ($(".redireccion").length) {

        const saldo = Number(localStorage.getItem("saldo")) || 10000;
        $("#saldoMenu").text(saldo);

        $(".redireccion").on("click", function (e) {
            e.preventDefault();

            const destino = $(this).text();
            const url = $(this).attr("href");
            console.log(url)

            mostrarAlerta(`Redirigiendo a ${destino}...`, "success");

            setTimeout(() => {
                window.location.href = url;
            }, 800);
        });
    }

    // DEPÓSITO
    if ($("#botonDepositar").length) {
        let saldo = Number(localStorage.getItem("saldo")) || 10000;
        $("#saldo").text(saldo);

        $("#botonDepositar").click(function (e) {
            e.preventDefault();
            const monto = Number($("#monto").val());

            if (monto <= 0) {
                mostrarAlerta("Ingresa un monto válido", "danger");
                return;
            }

            saldo += monto;
            localStorage.setItem("saldo", saldo);
            $("#saldo").text(saldo);
            $("#monto").val('');

            guardarTransaccion("Deposito", monto, "Depósito en cuenta");

            $("#leyenda").text(`Depositaste $${monto}`);

            mostrarAlerta("Depósito realizado con éxito", "success");

        });



    }

    // ENVIAR DINERO
    if ($("#btnEnviar").length) {
        let saldo = Number(localStorage.getItem("saldo"));
        let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
        let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

        mostrarContactos();

        $("#mostrar").click(function (e) {
            e.preventDefault();
            $("#formbanco").toggleClass("d-none");
        });

        $("#formbanco").submit(function (e) {
            e.preventDefault();

            const contacto = {
                nombre: $("#nombre").val(),
                banco: $("#banco").val(),
                alias: $("#alias").val(),
                cbu: $("#cbu").val()
            };

            if (Object.values(contacto).some(valor => valor === "")) {
                mostrarAlerta("Completa todos los campos", "danger");
                return;
            }


            contactos.push(contacto);
            localStorage.setItem('contactos', JSON.stringify(contactos));
            mostrarAlerta('Contacto guardado', 'success');
            mostrarContactos();
            this.reset();
            $('#formbanco').addClass('d-none');
        });

        $('#contactoSelect').change(function () {
            $('#btnEnviar').toggle($(this).val() !== '');
        });

        $('#btnEnviar').click(function () {

            const contacto = $('#contactoSelect').val();
            const monto = Number($('#montoEnviar').val());

            if (monto <= 0 || monto > saldo) {
                mostrarAlerta('Monto inválido o insuficiente', 'danger');
                return;
            }

            if (!contacto) {
                mostrarAlerta("Debes seleccionar un contacto para enviar dinero", "warning");
                return;
            }


            saldo -= monto;
            localStorage.setItem("saldo", saldo);

            guardarTransaccion("Transferencia", monto, `Transferencia a ${contacto}`);

            $("#mensaje").text(`Enviaste $${monto} a ${contacto}`);
            $("#montoEnviar").val("");
            $("#contactoSelect").val("");

            mostrarAlerta(`Transferencia a ${contacto} realizada con éxito`, 'success');


        });

        function mostrarContactos() {
            $("#listaContactos").empty();
            $("#contactoSelect").html('<option value="">Selecciona un contacto</option>');

            contactos.forEach(c => {
                $("#listaContactos").append(`
        <div class="card mb-2">
          <div class="card-body">
            <strong>${c.nombre}</strong><br>
            ${c.alias} - ${c.banco}
          </div>
        </div>
      `);

                $("#contactoSelect").append(`
        <option value="${c.alias}">${c.alias}</option>
      `);
            });
        }

    }

    // TRANSACCIONES
    if ($("#listaTransacciones").length) {
        const transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

        if ($("#listaTransacciones").length) {
            $("#listaTransacciones").empty();

            transacciones.forEach(t => {

                let clase = '';
                let texto = '';

                if (t.tipo === 'Deposito') {
                    clase = 'transaccion-deposito';
                    texto = `${t.detalle} - $${t.monto}`;
                }

                if (t.tipo === 'Transferencia') {
                    clase = 'transaccion-transferencia';
                    texto = ` ${t.detalle} - $${t.monto}`;
                }

                $('#listaTransacciones').append(`
                <li class="list-group-item ${clase}">${texto} </li>`);
            });

        }
    }

    function mostrarAlerta(mensaje, tipo) {
        $('#alert-container').html(`
      <div class="alert alert-${tipo}" role="alert">
        ${mensaje}
      </div>
    `);
    }

    function guardarTransaccion(tipo, monto, detalle) {
        const transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

        const transaccion = {
            tipo: tipo,
            monto: monto,
            detalle: detalle,
            fecha: new Date().toLocaleString()
        };

        transacciones.push(transaccion);
        localStorage.setItem("transacciones", JSON.stringify(transacciones));
    }
});
