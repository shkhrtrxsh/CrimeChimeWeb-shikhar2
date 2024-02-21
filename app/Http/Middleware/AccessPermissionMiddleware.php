<?php

namespace App\Http\Middleware;

use Closure;
use Route;
use GovindTomar\Permission\Models\RolePermission;
use Auth;

class AccessPermissionMiddleware
{
    public function handle($request, Closure $next)
    {

        $permission = RolePermission::Where('route', Route::currentRouteName())
            ->where('role_id', Auth::user()->role_id)->first();

        $status = $permission ? $permission->status : 0 ;

        if ($status == 1) {
            return $next($request);
        }else{
            return redirect('/');
        }
    }

}
