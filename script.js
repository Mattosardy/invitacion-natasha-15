// ============================================
// invitacion 15 años - natasha
// confirmacion real con google apps script
// ============================================
const api_url = "https://script.google.com/macros/s/AKfycbxKkWGUocc-HDMrdEVdIEmDATJFhOut_fmpZJLXVFbVxEGw_nozvKXTPOtH5i2LNu7W/exec";
const admin_phone = "+59891950107";
const confirm_btn = document.getElementById("confirmBtn");
const guest_name_input = document.getElementById("guestName");
const guest_name_display = document.getElementById("guestNameDisplay");
const message_div = document.getElementById("message");
const acceso_banner = document.getElementById("accesoInvalidoBanner");
const welcome_screen = document.getElementById("welcomeScreen");
const main_content = document.getElementById("mainContent");
const musica = document.getElementById("bgMusic");
const boton_musica = document.getElementById("musicToggle");
let musica_activa = false;
let invitado_actual = null;
function get_token_from_url() {
    const url_params = new URLSearchParams(window.location.search);
    return url_params.get("token");
}
function mostrar_mensaje(texto, tipo) {
    message_div.textContent = texto;
    message_div.className = `message ${tipo}`;
    setTimeout(() => {
        message_div.className = "message";
    }, 4000);
}
function verificar_fecha_limite() {
    const fecha_limite = new Date("2026-05-29T23:59:59");
    const ahora = new Date();
    if (ahora > fecha_limite) {
        confirm_btn.disabled = true;
        mostrar_mensaje("⏰ el plazo de confirmación finalizó el 29 de mayo", "error");
        return true;
    }
    return false;
}
function habilitar_boton() {
    if (verificar_fecha_limite()) return;
    confirm_btn.disabled = false;
}
async function cargar_invitado() {
    const token = get_token_from_url();
    if (!token) {
        mostrar_acceso_invalido();
        return;
    }
    try {
        const response = await fetch(`${api_url}?action=get_invitado_by_token&token=${encodeURIComponent(token)}`);
        const data = await response.json();
        if (!data.ok || !data.invitado) {
            mostrar_acceso_invalido();
            return;
        }
        invitado_actual = data.invitado;
        guest_name_display.textContent = `🎸 ${invitado_actual.nombre} 🎸`;
        guest_name_input.value = invitado_actual.nombre;
        if (String(invitado_actual.estado).toLowerCase() === "confirmado") {
            confirm_btn.disabled = true;
            mostrar_mensaje("✅ tu asistencia ya fue confirmada", "success");
        } else {
            habilitar_boton();
        }
        if (acceso_banner) acceso_banner.style.display = "none";
    } catch (error) {
        console.error("error al cargar invitado:", error);
        mostrar_mensaje("❌ error al conectar con la base de datos", "error");
        confirm_btn.disabled = true;
    }
}
function mostrar_acceso_invalido() {
    guest_name_display.textContent = "⚠️ acceso no válido";
    guest_name_display.style.color = "#e94560";
    guest_name_display.style.borderColor = "#e94560";
    confirm_btn.disabled = true;
    if (acceso_banner) acceso_banner.style.display = "block";
    mostrar_mensaje("❌ acceso no válido. usá el enlace que recibiste por whatsapp.", "error");
}
async function confirmar_asistencia() {
    if (verificar_fecha_limite()) return;
    if (!invitado_actual || !invitado_actual.token) {
        mostrar_mensaje("❌ no se pudo identificar tu invitación", "error");
        return;
    }
    try {
        confirm_btn.disabled = true;
        const response = await fetch(`${api_url}?action=confirmar_invitado&token=${encodeURIComponent(invitado_actual.token)}`);
        const data = await response.json();
        if (!data.ok) {
            confirm_btn.disabled = false;
            mostrar_mensaje("❌ no se pudo registrar la confirmación", "error");
            return;
        }
        mostrar_mensaje("✅ Gracias, no faltes!! contigo ese día será especial!", "success");
        } catch (error) {
        console.error("error al confirmar:", error);
        confirm_btn.disabled = false;
        mostrar_mensaje("❌ hubo un problema al confirmar", "error");
    }
}
function actualizar_cuenta_regresiva() {
    const fecha_evento = new Date("2026-06-13T22:00:00");
    const ahora = new Date();
    const diferencia = fecha_evento - ahora;
    if (diferencia <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    document.getElementById("days").textContent = dias.toString().padStart(2, "0");
    document.getElementById("hours").textContent = horas.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutos.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = segundos.toString().padStart(2, "0");
}
function mostrar_contenido_principal() {
    if (welcome_screen) {
        welcome_screen.classList.add("hide");
        setTimeout(() => {
            if (welcome_screen && welcome_screen.parentNode) {
                welcome_screen.style.display = "none";
            }
        }, 1000);
    }
    if (main_content) {
        main_content.classList.remove("hidden");
        main_content.classList.add("visible");
    }
}
function controlar_musica() {
    if (musica_activa) {
        musica.pause();
        boton_musica.textContent = "🎵 activar música";
        musica_activa = false;
    } else {
        musica.play().then(() => {
            boton_musica.textContent = "🔇 silenciar";
            musica_activa = true;
        }).catch(() => {
            mostrar_mensaje("🎵 tocá el botón para activar la música", "error");
        });
    }
}
async function init() {
    actualizar_cuenta_regresiva();
    setInterval(actualizar_cuenta_regresiva, 1000);
    await cargar_invitado();
}
if (confirm_btn) confirm_btn.addEventListener("click", confirmar_asistencia);
if (boton_musica) boton_musica.addEventListener("click", controlar_musica);
init();
const es_movil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const tiempo_espera = es_movil ? 5000 : 7000;
setTimeout(() => {
    mostrar_contenido_principal();
}, tiempo_espera);
console.log("✅ invitación lista - confirmación real con apps script");
