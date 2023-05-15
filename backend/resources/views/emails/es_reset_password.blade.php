<!DOCTYPE html>
<html>
<head>
    <title>Reinicio de contraseña</title>
</head>
<body>
    <p>Hola {{ $name }},</p>
    <p>Si no ha solicitado reiniciar su contraseña no hace falta que haga nada.</p>
    <p>Haga click en el siguiente enlace para reiniciar su contraseña:</p>
    <a href="{{ $url }}">Reiniciar contraseña</a>
</body>
</html>