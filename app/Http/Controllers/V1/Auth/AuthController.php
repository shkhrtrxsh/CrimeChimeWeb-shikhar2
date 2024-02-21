<?php
namespace App\Http\Controllers\V1\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\RolePermission;
use App\Models\Role;
use App\Models\VerificationCode;
use Validator;
use App\Http\Controllers\ApiController;
use App\Exceptions\ApiException;
use App\Http\Requests\V1\Auth\LoginRequest;
use App\Http\Requests\V1\Auth\RegisterRequest;
use App\Http\Requests\V1\Auth\OtpRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class AuthController extends ApiController
{

    public function login(LoginRequest $request){

        try {
            
	        $user = User::where('phone', $request->phone)->where('is_remove',0)->first();
            if(!$user) {
                return response()->json([
                    'status' => false,
                    'code' => 202,
                    'message' => 'This user account was deleted.',
                ], 202);
            }
            
            $user->device_id = $request->device_id;
            $user->save();
            
	        $verificationCode = VerificationCode::where('user_id', $user->id)->latest()->first();
	        $now = Carbon::now();

	        if($verificationCode && $now->isBefore($verificationCode->expire_at)){
				return $this->response([	            	
					'status' => true,
					'code' => 200,
					'message' => 'Otp Send',
					'data' => [
						'id'	=>	$user->id,
						'otp'	=>	(int)$verificationCode->otp
					]
				]);
			}

        	$verificationCode = VerificationCode::create([
	            'user_id' => $user->id,
	            'otp' => rand(123456, 999999),
	            'expire_at' => Carbon::now()->addMinutes(10)
	        ]);

	        return $this->response([
	            'status' => true,
    		    'code' => 200,
	            'message' => 'Otp Send',
	            'data' => [
		            	'id'	=>	$user->id,
		            	'otp'	=>	(int)$verificationCode->otp
		            ]
	        ]);

        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }


    public function register(Request $request) {

        try{
            $usrData = User::where([['phone',$request->phone],['is_remove',1]])->first();
            $isveryfy = User::where([['phone',$request->phone],['is_verify',0]])->first();

            if($usrData && $isveryfy){
                $validator = Validator::make($request->all(), [
                    'name' => 'required|string|between:2,100',
                    'phone' => 'required',
                    'email' => 'required',
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'name' => 'required|string|between:2,100',
                    'phone' => 'required|unique:users',
                    'email' => 'required|unique:users',
                ]);
            }

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'code' => 202,
                    'message' => $validator->errors()->first(),
                ], 202);
            }
            $lastSixDigits = substr($request->phone, -2);
            $letters = substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 3);
            $numbers = substr(str_shuffle("0123456789"), 0, 3);
            $username = $letters . $numbers;
            if($isveryfy){
                $isveryfy->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'device_id' => $request->device_id,
                    'phone' => $request->phone,
                    'username' => $username,
                ]);

                $user->roles()->attach(2);
            } else {
                $user = new User;
                $user->name = $request->name;
                $user->email = $request->email;
                $user->device_id = $request->device_id;
                $user->phone = $request->phone;
                $user->username = $username;
                $user->save();
    
                $user->roles()->attach(2);
            }

	        $verificationCode = VerificationCode::where('user_id', $user->id)->latest()->first();
	        $now = Carbon::now();

	        if($verificationCode && $now->isBefore($verificationCode->expire_at)){
	           	return $this->response([
                    'status' => true,
                    'code' => 200,
                    'message' => 'Otp Send',
                    'data' => [
                        'id'	=>	$user->id,
                        'otp'	=>	(int)$verificationCode->otp
                    ]
    	        ]);
	        }

	        $verificationCode = VerificationCode::create([
	            'user_id' => $user->id,
	            'otp' => rand(123456, 999999),
	            'expire_at' => Carbon::now()->addMinutes(10)
	        ]);

           	return $this->response([
                'status' => true,
                'code' => 200,
                'message' => 'Otp Send',
                'data' => [
                    'id'	=>	$user->id,
                    'otp'	=>	(int)$verificationCode->otp
                ]
	        ]);

        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }

    }


    public function otp_verify(OtpRequest $request){
       $verificationCode   = VerificationCode::where('user_id', $request->id)
       			->where('otp', $request->otp)->first();

       	$now = Carbon::now();
		if (!$verificationCode) {
			return $this->response([
	            'status' => 401,
	            'message' => 'Your OTP is not correct',
	        ]);
        }elseif($verificationCode && $now->isAfter($verificationCode->expire_at)){
        	return $this->response([
	            'status' => 401,
	            'message' => 'Your OTP has been expired',
	        ]);
        }       

        $user = User::with('roles')->whereId($request->id)->first();

        if($user){
            $verificationCode->delete();
            $user->update([
                'is_verify' => 1
            ]);

            $token = Auth::login($user);

         	return $this->response([
	            'status' => $this->getStatusCode(),
	            'message' => 'Login Successful',
	            'access_token' => $token,
	            'token_type' => 'Bearer',
	            'expires_in' => auth()->factory()->getTTL() * 60,
	            'data' => $user
	        ]);
        }
    }


    public function refresh() {
        try{

        	return $this->response([
	            'status' => $this->getStatusCode(),
	            'message' => 'Token Refresh',
	            'access_token' => auth()->refresh(),
	            'token_type' => 'Bearer',
	            'expires_in' => auth()->factory()->getTTL() * 60,
	        ]);

        } catch (ApiException $e) {
            return $this->errorResponse($e->getMessage());
        }
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

	public function verifytoken(Request $request) {
        $data = array('secret' => env('GOOGLE_RECAPTCHA_SECRET'),'response' => $request->token);
        try {
            $verify = \curl_init();
            curl_setopt($verify, CURLOPT_URL,"https://www.google.com/recaptcha/api/siteverify");
            curl_setopt($verify, CURLOPT_POST, true);
            curl_setopt($verify, CURLOPT_POSTFIELDS,http_build_query($data));
            curl_setopt($verify, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($verify, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($verify);
            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Request send Successfully!',
                'data' =>  json_decode($response),
            ]);
        }
        catch (\Exception $e) {
            return false;
        }
    }





    // public function userProfile() {
    //     return $this->response([
    //         'user' => auth()->user()
    //     ], 'Get current user details');
    // }

    // public function routes()
    // {
    //     $user = User::with('roles')->find(Auth::id());
    //     $roles = [];
    //     foreach ($user->roles as $key => $role) {
    //         $roles[] = $role->id;
    //     }
    //     $permissions = RolePermission::with(['permission'])
    //         ->whereIn('role_id', $roles)->get();

    //     $permission = [];
    //     $in_arr = [];
    //     foreach ($permissions as $key => $per) {
    //         if ($per->status == 1) {
    //             if(!in_array($per->permission->url, $in_arr)){
    //                 $in_arr[] = $per->permission->url;
    //                 $permission[] = $per->permission->url;
    //             }                        
    //         }
    //     }
    //     return $permission;
    // }

}