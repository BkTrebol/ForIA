<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
</head>
<body>
    <p>Hello {{ $name }},</p>
    <p>Please click on the following link to verify your email address:</p>
    <a href="{{ $verificationUrl }}">Verify Email</a>
</body>
</html>
