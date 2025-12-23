<?php

use App\Helpers\ResponseFormatter;
use App\Http\Middleware\ApiRateLimiter;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware
            ->web([
                \Illuminate\Http\Middleware\HandleCors::class,
                \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
            ])
            ->api([
                \Illuminate\Http\Middleware\HandleCors::class,
                \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
                'throttle:api',
                SubstituteBindings::class,
            ])
            ->group('api', [
                \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
                'throttle:api',
                SubstituteBindings::class,
            ])
            ->alias([
                'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
                'api.rate.limit' => ApiRateLimiter::class,
            ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson()) {
                $statusCode = 500;
                $message = 'Server Error';
                
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
                    $statusCode = $e->getStatusCode();
                } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                    $statusCode = 422;
                    $message = 'Validation failed';
                } elseif ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    $statusCode = 401;
                    $message = 'Unauthenticated.';
                } elseif ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                    $statusCode = 403;
                    $message = 'Unauthorized.';
                }
                
                return ResponseFormatter::error(
                    $message,
                    [[
                        'field' => null,
                        'tag' => 'exception',
                        'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong.'
                    ]],
                    $statusCode
                );
            }
        });
    })
    ->create();
