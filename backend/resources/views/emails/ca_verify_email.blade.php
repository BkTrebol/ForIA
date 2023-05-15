<!DOCTYPE html>
<html>
<head>
    <title>Validar correu electrònic</title>
</head>
<body>
    <p>Hola {{ $name }},</p>
    <p>Si us plau, feu clic a l'enllaç següent per validar la vostra adreça de correu electrònic:</p>
    <a href="{{ $verificationUrl }}">Validar correu electrònic</a>
</body>
</html>
