<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use App\Models\Corporate;
use App\Models\User;
use App\Models\CorporateUserRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Validator;
use App\Models\VerificationCode;
use Carbon\Carbon;

class CorporateController extends Controller
{
    public function corporateList(){

        $list = Corporate::get();

        if(count($list) > 0){
            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Corporate List.',
                'data' => $list,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'No data found!.',
                'data' => null,
            ]);
        }
        
    }

    public function addCorAdmin(Request $request){

        $userId = auth()->user()->id;
        $admin = User::where('id',$userId)
                        ->with(['roles' => function($q) {
                            $q->where('slug', '=', 'administrator');
                        }])
                        ->first();
        if(count($admin['roles']) > 0){

            $validator = Validator::make($request->all(), [
                'corporate_name' => 'required|unique:corporates,name|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'code' => 202,
                    'message' => $validator->errors()->first(),
                ], 202);
            }
            $corAdmin =  new Corporate;
            $corAdmin->name  =  $request->corporate_name;
            $corAdmin->address  =  $request->address;

            if($request->hasFile('logo')){
                $fileInfo = $request->logo->getClientOriginalName();
                $filename = pathinfo($fileInfo, PATHINFO_FILENAME);
                $extension = pathinfo($fileInfo, PATHINFO_EXTENSION);
    
                $allowedfileExtension=['jpeg','jpg','png','gif'];
                $check=in_array($extension,$allowedfileExtension);
    
                if($check==true) {
                    $file_name= $filename.'_'.time().'.'.$extension;
                    $request->logo->move(public_path('/upload/CorAdminLogo/'),$file_name);
                    $corAdmin->logo = $file_name;
                }
            }
            $corAdmin->save();
    
            $usrData = User::where([['phone',$request->phone],['is_remove',1]])->first();

            if($usrData){
                $validator = Validator::make($request->all(), [
                    'user_name' => 'required|string|between:2,100',
                    'phone' => 'required',
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'user_name' => 'required|string|between:2,100',
                    'phone' => 'required|unique:users',
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

            $user = new User;
            $user->name = $request->user_name;
            $user->username = $username;
            $user->phone = $request->phone;
            $user->email = $request->email;
            $user->corporat_id = $corAdmin->id;
            $user->save();
    
            $user->roles()->attach(3);
    
            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Corporate Admin Added successfully.',
                'data' => $corAdmin,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'You can not allow to add data!',
                'data' => null,
            ]);
        }
        
    }

    public function corAdminList(){

        $adminCor = User::with(['roles' => function($q) {
            $q->where('slug', 'cor_admin');
        }])->get();
        $admin = [];
        foreach ($adminCor as $value) {
            if(count($value['roles']) > 0){
                array_push($admin,$value);
            }
        }
       
        if(count($admin) > 0){
            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Corporate Admin List.',
                'data' => $admin,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'No data found!.',
                'data' => null,
            ]);
        }
    }

    public function addCorUser(Request $request){

        $userId = auth()->user()->id;
        $admin = User::where('id',$userId)
                ->with(['roles' => function($q) {
                    $q->Orwhere('slug', '=', 'cor_admin');
                }])
                ->first();
        $usrData = User::where([['phone',$request->phone],['is_remove',1]])->first();

        if($usrData){
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|between:2,100',
                'phone' => 'required',
                'email' => 'required',
                'cor_id' => 'required',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|between:2,100',
                'phone' => 'required|unique:users',
                'email' => 'required|unique:users',
                'cor_id' => 'required',
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

        if(count($admin['roles']) > 0){

            $user = new User;
            $user->name = $request->name;
            $user->username = $username;
            $user->phone = $request->phone;
            $user->email = $request->email;
            $user->corporat_id = $request->cor_id;
            $user->registered_by = $admin['roles'][0]['name'];
            $user->save();
    
            $user->roles()->attach(4);
            
            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Corporate User Added successfully.',
                'data' => $user,
            ]);

        } else {

            $user = new User;
            $user->name = $request->name;
            $user->username = $username;
            $user->phone = $request->phone;
            $user->email = $request->email;
            $user->registered_by = 'self';

            $user->save();

            $user->roles()->attach(2);

            $userrequest = new CorporateUserRequest;
            $userrequest->corporat_id = $request->cor_id;
            $userrequest->user_id = $user->id;
            $userrequest->status = 0;
            $userrequest->save();

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Request send to corporate admin successfully.',
                'data' => $user,
            ]);
        }
        
    }

    public function corporateUserList($cor_id){

        $list = User::where('corporat_id',$cor_id)
                ->with(['roles' => function($q) {
                    $q->where('slug', '=', 'cor_user');
                }])
                ->get();
        $admin = [];
        foreach ($list as $value) {
            if(count($value['roles']) > 0){
                array_push($admin,$value);
            }
        }
        if(count($list) > 0){
            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'corporate user list.',
                'data' => $list,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'No data found!.',
                'data' => null,
            ]);
        }
    }

    public function CorporateRequest($cor_id){

        $userId = auth()->user()->id;

        $admin = User::where([['id',$userId],['corporat_id',$cor_id]])
                ->with(['roles' => function($q) {
                    $q->where('slug', '=', 'administrator');
                    $q->Orwhere('slug', '=', 'cor_admin');
                }])
                ->first();
        if(count($admin['roles']) > 0){
            $userrequest = CorporateUserRequest::where('corporat_id',$cor_id)->get();

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Request list.',
                'data' => $userrequest,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'You can not show this list.',
                'data' => null,
            ]);
        }
        
    }

    public function changeRequestStatus(Request $request){

        $userId = auth()->user()->id;

        $admin = User::where('id',$userId)
                ->with(['roles' => function($q) {
                    $q->where('slug', '=', 'administrator');
                    $q->Orwhere('slug', '=', 'cor_admin');
                }])
                ->first();
        if(count($admin['roles']) > 0){

            $userrequest = CorporateUserRequest::where('id',$request->id)->first();
            $userrequest->update([
                'status' => $request->status
            ]);

            if($request->status==1){
                $user = User::where('id',$userrequest->user_id)->first();
                $user->update([
                    'corporat_id' => $userrequest->corporat_id
                ]);
        
                $user->roles()->attach(4);
            }

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => $request->status==1 ? 'Request accepted successfully.' : 'Request reject!',
                'data' => $userrequest,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'You can not show this list.',
                'data' => null,
            ]);
        }
    }

    public function switchToCorAdmin(Request $request){

        $userId = auth()->user()->id;

        $admin = User::where('id',$userId)
                ->with(['roles' => function($q) {
                    $q->where('slug', '=', 'administrator');
                }])
                ->first();
        if(count($admin['roles']) > 0){

            $user = User::where('id',$request->user_id)->first();
            $user->update([
                'corporat_id' => $request->cor_id
            ]);
            $roledata = Role::where('user_id',$request->user_id)->first();
            $roledata->delete();

            $user->roles()->attach(3);

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'User role updated successfully.',
                'data' => null,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'You can not change user role.',
                'data' => null,
            ]);
        }
    }

    public function switchToCorUser(Request $request){

        $userId = auth()->user()->id;

        $admin = User::where('id',$userId)
                ->with(['roles' => function($q) {
                    $q->where('slug', '=', 'administrator');
                    $q->Orwhere('slug', '=', 'cor_admin');
                }])
                ->first();
        if(count($admin['roles']) > 0){

            $user = User::where('id',$request->user_id)->first();
            $user->update([
                'corporat_id' => $request->cor_id
            ]);
            $roledata = Role::where('user_id',$request->user_id)->first();
            $roledata->delete();

            $user->roles()->attach(4);

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'User role updated successfully.',
                'data' => null,
            ]);

        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'You can not change user role.',
                'data' => null,
            ]);
        }
    }

    public function verifyCorporate($cor_id){

        $userId = auth()->user()->id;

        $admin = User::where('id',$userId)
                ->with(['roles' => function($q) {
                    $q->where('slug', '=', 'administrator');
                }])
                ->first();

        if(count($admin['roles']) > 0){

            $corporate = Corporate::where('id',$cor_id)->first();
            $corporate->update([
                'is_verify' => 1
            ]);

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'Corporate is verify successfully!',
                'data' => null,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'You can not access this api.',
                'data' => null,
            ]);
        }

        
    }
}
