<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;
class ConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;
    protected $user;
    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation Email',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {    
        $verificationUrl = URL::temporarySignedRoute(
           'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $this->user->getKey(),
                'hash' => sha1($this->user->getEmailForVerification()),
            ],
        );
        $verificationUrl = str_replace(config('app.urls.backend'),config('app.urls.frontend'),$verificationUrl);
        $verificationUrl = str_replace('/api/', '', $verificationUrl);
        
        return (new Content())
        ->view('emails.verify_email')
        ->with([
            "name" => $this->user->nick,
            'verificationUrl' => $verificationUrl
        ]);
    }


    public function build()
    {
        return $this->content();
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
