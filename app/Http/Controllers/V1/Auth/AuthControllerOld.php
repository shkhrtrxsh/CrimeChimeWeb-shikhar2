<?php
namespace App\Http\Controllers\V1\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\RolePermission;
use App\Models\Role;
use Validator;
use App\Http\Controllers\ApiController;
use App\Exceptions\ApiException;
use App\Http\Requests\V1\Auth\LoginRequest;
use App\Http\Requests\V1\Auth\RegisterRequest;

class AuthController extends ApiController
{

    public function login(LoginRequest $request){

        try {
            
            return $this->auth($request, 'User login successfully');

        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }


    public function register(RegisterRequest $request) {

        try{

            $user = new User;
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->save();

            $user->roles()->attach(4);

            return $this->auth($request, 'User registered successfully');

        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }

    }


    private function auth($request, $message){
        $credentials = $request->only('email', 'password');

        if (! $token = auth()->attempt($credentials)) {
            return $this->errorResponse('Username and password not found', 201);
        }

        $data['user'] = auth()->user();
        $data['routes'] = $this->routes();

        return $this->response([
            'status' => $this->getStatusCode(),
            'message' => $message,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'data' => $data
        ]);

    }


    public function logout() {
        try{
            auth()->logout();

            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'User logout successfully',
            ]);

        } catch (ApiException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }




    public function refresh() {
        try{

            return $this->response([
                'access_token' => auth()->refresh(),
                'token_type' => 'Bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
            ], 'Token refresh successfully');

        } catch (ApiException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }


    public function userProfile() {
        return $this->response([
            'user' => auth()->user()
        ], 'Get current user details');
    }

    public function routes()
    {
        $user = User::with('roles')->find(Auth::id());
        $roles = [];
        foreach ($user->roles as $key => $role) {
            $roles[] = $role->id;
        }
        $permissions = RolePermission::with(['permission'])
            ->whereIn('role_id', $roles)->get();

        $permission = [];
        $in_arr = [];
        foreach ($permissions as $key => $per) {
            if ($per->status == 1) {
                if(!in_array($per->permission->url, $in_arr)){
                    $in_arr[] = $per->permission->url;
                    $permission[] = $per->permission->url;
                }                        
            }
        }
        return $permission;
    }

}