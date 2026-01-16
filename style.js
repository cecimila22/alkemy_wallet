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
});