<?php
session_start();

if (isset($_SESSION['usuario_id'])) {
    header("Location: cotizador.php");
} else {
    header("Location: index.php");
}
exit;