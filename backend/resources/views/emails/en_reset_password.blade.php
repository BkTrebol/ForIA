<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <p>Hello {{ $name }},</p>
    <p>If you didn't request a password reset, please ignore this message.</p>
    <p>Click the following link to reset your password:</p>
    <a href="{{ $url }}">Reset Password</a>
</body>
</html>
