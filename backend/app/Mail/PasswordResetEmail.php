<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetEmail extends Mailable
{
    use Queueable, SerializesModels;
    protected $user;
    protected $token;
    /**
     * Create a new message instance.
     */
    public function __construct(User $user,string $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $lang = $this->user->preferences->lang;
        $subjects = [
            "es" => "Reinicio de contraseña.",
            "ca" => "Reinici de contrasenya.",
            "en" => "Password reset."
        ];
        return new Envelope(
            subject: $subjects[$lang]??$subjects['en'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {   
        $lang = $this->user->preferences->lang??'en';
        $view = 'emails.'.$lang.'_reset_password';
        $view = view()->exists($view) ? $view : 'email.reset_password';
        $url = config('app.urls.frontend').'auth/reset-password?token='.$this->token.'&email='.$this->user->email;
        return (new Content())
        ->view($view)
        ->with([
            "name" => $this->user->nick,
            "url" => $url,
        ]);
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
