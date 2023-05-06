<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isAdmin = $request->session()->pull('admin',false);
        if($isAdmin){
            $request->session()->put('admin', true);
            return $next($request);
        }
        return response()->json(['error' => 'Unauthorized'],403);
    }
}
