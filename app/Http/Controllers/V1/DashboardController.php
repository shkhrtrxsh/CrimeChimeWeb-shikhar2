<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Models\User;
use App\Models\Report;
use App\Models\UserAddress;
use App\Models\reportNotification;
use Auth;
use App\Models\VerificationCode;
use Carbon\Carbon;

class DashboardController extends ApiController
{

    public function index(){
        try{
            $user = [];
            $user['total'] = User::get()->count();
            $user['active'] = User::where('status', 1)->get()->count();
            $user['inactive'] = User::where('status', 0)->get()->count();

            $report['total'] = Report::get()->count();
            $report['active'] = Report::where('status', 1)->get()->count();
            $report['inactive'] = Report::where('status', 0)->get()->count();

            $report['violent_crime'] = Report::where('crime_id', 1)->get()->count();
            $report['theft'] = Report::where('crime_id', 2)->get()->count();
            $report['property_damage'] = Report::where('crime_id', 3)->get()->count();


            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Dashboard Lists',
                'data' =>  [
                    "user"  =>  $user,
                    "report"    =>  $report
                ],
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }

    }
    
    public function listAddress(){
        $list = UserAddress::where('user_id',auth()->user()->id)->orderBy('id','desc')->get();
        
        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'User address details.',
            'data' => $list,
        ]);
    }

    public function updateAddress(Request $request){

        try{
            
            $user = UserAddress::where([['user_id',auth()->user()->id],['id',$request->id]])->first();
            $user->user_id = auth()->user()->id;
            $user->name_location = $request->name_location;
            $user->latitude = $request->latitude;
            $user->longitude = $request->longitude;
            $user->address = $request->address;
            $user->save();

            return response()->json([
                'success' => true,
                'code' => 200,
                'message' => 'User address updated successfully.',
                'data' => $user,
            ]);

        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
    
    public function deleteAddress($id){
        $user = UserAddress::where('id',$id)->first();
        $user->delete();

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'User address deleted successfully.',
            'data' => null,
        ]);
    }
    
    public function notificationList(){
        
        $now = Carbon::now();
        $twentyFourHoursAgo = $now->subHours(24);

        $list = reportNotification::where('user_id',auth()->user()->id)->where('created_at', '>=', $twentyFourHoursAgo)->orderBy('id','desc')->get();

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'User Notification list',
            'data' => $list,
        ]);
    }

    public function readNotification(Request $request){
        
        $list = reportNotification::where('user_id',auth()->user()->id)->update(['is_read' => 1]);

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'All notification as a read.',
            'data' => null,
        ]);
    }
    
    public function reportList(){
        $list = Report::where('user_id',auth()->user()->id)->with(["report_images"])->orderBy('id','desc')->get();

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'User Report list',
            'data' => $list,
        ]);

    }
    
    public function removeReport($id){

        $report = Report::find($id);
        $report->delete();

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'Report data removed successfully!',
            'data' => null,
        ]);
    }
    
    public function getProfile(){

        $user = User::where('id',auth()->user()->id)->with(['roles','corporate'])->first();

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'User details.',
            'data' => $user,
        ]);
    }
    
    public function removeAccount(){

        $user = User::where('id',auth()->user()->id)->first();
        $user->is_remove = 1;
        $user->save();

        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'User details remove successfully!',
            'data' => $user,
        ]);
    }
    
    public function resendOtp(Request $request){

        $otp = mt_rand(100000, 999999);
        $phoneNumber = $request->phone;
        
        $user = User::where('phone', $request->phone)->where('is_remove',0)->first();
        
        $verificationCode = VerificationCode::where('user_id', $user->id)->delete();
        
        $verificationCode = VerificationCode::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'expire_at' => Carbon::now()->addMinutes(10)
        ]);
        
        if(!$user){
            return response()->json([
                'success' => false,
                'code' => 202,
                'message' => 'This number is not registered!',
                'data' => null,
            ]);
        }
        
        $sms_text = 'Crimechime login OTP '.$verificationCode->otp;
        //the connet URL
        $url = 'https://sms.connect-mobile.co.za/submit/single/';
        
        $api_token = "RyNscWsBzOVz0yRdPDd2tAyiUaGKK42GgrdXeZF9GOsTCwubKMoqDymTQxAbZdYq";
        $mobile = '27'.$request->phone;
        //setup the required vars for the connet sms system
        $fields = array(
           'da' => (string)$mobile, //destination addresses
           'ud' => $sms_text, //string for the sms
           'id' => $user->id //optional id to map mtsms to delivery reports
        );
        
        //open connection
        $ch = curl_init();
        
        //set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $api_token]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        
        //execute post
        $result = curl_exec($ch);
        
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'OTP sent successfully',
            'data' => $otp,
        ]);
    }
}