<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ConfirmationEmail;
use App\Models\Role;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Google_Client;
use Carbon\Carbon;
use Illuminate\Auth\Notifications\VerifyEmail;
use Firebase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

use App\Models\User;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
   

   



}
