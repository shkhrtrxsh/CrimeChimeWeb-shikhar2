<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Http\Requests\V1\ReportRequest;
use App\Models\Report;
use App\Models\ReportNote;
use App\Models\ReportImage;
use App\Models\reportUser;
use App\Models\Crime;
use App\Models\User;
use App\Models\reportNotification;
use App\Models\SpecificCrime;
use Validator;
use Auth;
use Carbon\Carbon;
use DB;
use DateTime;
use Illuminate\Support\Facades\Queue;
use App\Models\UserAddress;
use Illuminate\Support\Facades\Notification;
use App\Jobs\SendFCMPushNotification;

class ReportController extends ApiController
{

    public function index(Request $request){
        try{
            $login = Auth::id();
            if(!empty($login)){
                $user_role = DB::table('user_role')->where('user_id',$login)->first();
                $data['admin'] = $user_role;
                $data['user'] = User::where('id',$login)->first();
            } else {
                $data['admin'] = null;
                $data['user'] = null;
            }

            $per_page = $request->per_page ? $request->per_page : 100;
            $qry = Report::with(["report_images","user.corporate"]);
            if (isset($request->search)) {
                $qry->whereLike(['location', 'crime.name', 'specific_crime.name', "user.name"], $request->search);
            }
            if (isset($request->status)) {
                $qry->where('status', $request->status);
            }
            if ($request->order_by == 'asc' || $request->order_by == 'desc') {
                $qry->orderBy('name', $request->order_by);
            }elseif($request->order_by == 'oldest'){
                $qry->orderBy('id', 'asc');
            }else{
                $qry->orderBy('id', 'desc');
            }
            $currentMonth = date('m');
            // $qry->whereRaw('MONTH(created_at) = ?',[$currentMonth])->orderBy('id', 'desc');
            $qry->orderBy('id', 'desc');
            $data['report'] = $qry->paginate($per_page);

            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Report lists',
                'data' =>  $data,
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function status(Request $request){
        try{
            $rules = array(
                'id' => ['required'],
                'status' => ['required']
            );

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->responseValidationError('Fields Validation Failed.', $validator);
            }

            $report = Report::find($request->id);
            $report->status = $request->status;
            $report->save();

            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Report update successfully',
                'data' =>  $report,
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function delete($id){
        try{

            $report = Report::find($id);
            $report->delete();

            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Report delete successfully',
                'data' =>  $report,
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function crimeIndex()
    {
        try{
            $crime = Crime::all();
            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Crime list',
                'data' =>  $crime,
            ]);
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function crimeShow($id)
    {
        try{
            if(!isset($id)){
                $id = 1;
            }

            $crime = SpecificCrime::Where('crime_id', $id)->get();
            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Crime show',
                'data' =>  $crime,
            ]);
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function store(ReportRequest $request)
    {
        try{
            if($request->weapons==0 && $request->murders==0 && $request->rape==0 && $request->assault==0 && $request->vehicle_theft==4 && $request->burglary==0 && $request->robbery==0 && $request->kidnapping==0 && $request->bribery==0 && $request->various==[2] && $request->police_reporting==0 && $request->shoplifting==0){
                return $this->response([
                    'success' => false,
                    'code' => 202,
                    'message' => 'Please select a crime before submitting your report.',
                    'data' =>  null,
                ]);
            }
            $report =  new Report;
            $report->location  =  $request->location;
            $report->short_address  =  $request->short_address;
            $report->longitude  =  $request->longitude;
            $report->latitude  =  $request->latitude;
            // $report->crime_id  =  $request->crime;
            $report->google_place_id = $request->google_place_id;
            // $report->specific_crime_id  =  $request->specific_crime;
            $report->description  =  $request->description;
            $report->user_id = Auth::id();
            $report->perpetrators = $request->perpetrators;
            $report->perpetrators_des = $request->perpetrators_des;
            $report->weapons = $request->weapons;
            $report->fully_auto_weapons = $request->fully_auto_weapons;
            $report->semi_auto_weapons = $request->semi_auto_weapons;
            $report->knife_weapons = $request->knife_weapons;
            $report->other_weapons = $request->other_weapons;
            $report->murders = $request->murders;
            $report->murders_people = $request->murders_people;
            $report->farm_murder = $request->farm_murder;
            $report->victim_name = json_encode($request->victim_name);
            $report->rape = $request->rape;
            $report->rape_people = $request->rape_people;
            $report->assault = $request->assault;
            $report->assault_people = $request->assault_people;
            $report->vehicle_theft = $request->vehicle_theft;
            $report->vehicle_make = $request->vehicle_make;
            $report->vehicle_model = $request->vehicle_model;
            $report->vehicle_colour = $request->vehicle_colour;
            $report->vehicle_year = $request->vehicle_year;
            $report->burglary = $request->burglary;
            $report->burglary_type = $request->burglary_type;
            $report->robbery = $request->robbery;
            $report->robbery_type = $request->robbery_type;
            $report->kidnapping = $request->kidnapping;
            $report->kidnapping_people = $request->kidnapping_people;
            $report->bribery = $request->bribery;
            $report->shoplifting = $request->shoplifting;
            $report->various = json_encode($request->various);
            $report->police_reporting = $request->police_reporting;
            $report->reported_to_the_police = $request->reported_to_the_police;
            $report->police_case_num = $request->police_case_num;
            $report->date_time = date('Y-m-d H:i',strtotime($request->date_time));
            $report->user_count = 1;
            $report->save();

            $inreport = reportUser::create([
                'user_id' => Auth::id(),
                'report_id' => $report->id,
                'lat' => $request->latitude,
                'long' => $request->longitude,
                'date&time' => date('Y-m-d H:i',strtotime($request->date_time)),
                'is_first' => 1,
            ]);

            foreach($request->files as $file){
                
                $allowedfileExtension=['jpeg','jpg','png','gif'];
                $allowedvideofileExtension=['mkv','mp4','MOV','WMV','AVI','WEBM'];

                $image = $file;
                $fileInfo = $image->getClientOriginalName();
                $filename = pathinfo($fileInfo, PATHINFO_FILENAME);
                $extension = pathinfo($fileInfo, PATHINFO_EXTENSION);
                
                $check=in_array($extension,$allowedfileExtension);
                $videocheck=in_array($extension,$allowedvideofileExtension);
                
                if($check==true)
                {
                    $file_name= $filename.'-'.time().'.'.$extension;
                    $image->move(public_path('upload/report/'.Auth::id().'/'),$file_name);
    
                    $report_image = new ReportImage;
                    $report_image->path = 'upload/report/'.Auth::id().'/'.$file_name;
                    $report_image->report_id = $report->id;
                    $report_image->user_id = Auth::id();
                    $report_image->save();

                } elseif($videocheck==true) {

                    $file_name= $filename.'-'.time().'.'.$extension;
                    $image->move(public_path('upload/report/'.Auth::id().'/'),$file_name);
    
                    $report_image = new ReportImage;
                    $report_image->path = 'upload/report/'.Auth::id().'/'.$file_name;
                    $report_image->report_id = $report->id;
                    $report_image->user_id = Auth::id();
                    $report_image->save();
                    
                } else {
                    return $this->response([
                        'status' => 'false',
                        'message' => 'Uploaded file type was not support!',
                        'data' =>  $extension,
                    ]);
                }

            }

            $lat = $request->latitude;
            $long = $request->longitude;
            $userList = [];
            $user = UserAddress::select("user_addresses.*","user_addresses.latitude","user_addresses.longitude", \DB::raw("6371 * acos(cos(radians(" . $lat . "))
                * cos(radians(user_addresses.latitude)) 
                * cos(radians(user_addresses.longitude) - radians(" . $long . ")) 
                + sin(radians(" .$lat. ")) 
                * sin(radians(user_addresses.latitude))) AS distance"))
                ->having('distance', '<', 500)
                ->with('user')
                ->get();
                
            array_push($userList,$user);

            SendFCMPushNotification::dispatch($userList,$lat,$long);

            return $this->response([
                'success' => true,
                'code' => 200,
                'message' => 'Crime report added.',
                'data' =>  $report->with(["report_images"])->find($report->id),
            ]);

        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }


    public function update(Request $request,$id){

        try{
            if($request->weapons==0 && $request->murders==0 && $request->rape==0 && $request->assault==0 && $request->vehicle_theft==4 && $request->burglary==0 && $request->robbery==0 && $request->kidnapping==0 && $request->bribery==0 && $request->various==2 && $request->police_reporting==0 && $request->shoplifting==0){
                return $this->response([
                    'success' => false,
                    'code' => 202,
                    'message' => 'Please select a crime before submitting your report.',
                    'data' =>  null,
                ]);
            }
            $report =  Report::where('id',$id)->first();
            $report->location  =  $request->location;
            $report->short_address  =  $request->short_address;
            $report->longitude  =  $request->longitude;
            $report->latitude  =  $request->latitude;
            // $report->crime_id  =  $request->crime;
            $report->google_place_id = $request->google_place_id;
            // $report->specific_crime_id  =  $request->specific_crime;
            $report->description  =  $request->description;
            $report->user_id = Auth::id();
            $report->perpetrators = $request->perpetrators;
            $report->perpetrators_des = $request->perpetrators_des;
            $report->weapons = $request->weapons;
            $report->fully_auto_weapons = $request->fully_auto_weapons;
            $report->semi_auto_weapons = $request->semi_auto_weapons;
            $report->knife_weapons = $request->knife_weapons;
            $report->other_weapons = $request->other_weapons;
            $report->murders = $request->murders;
            $report->murders_people = $request->murders_people;
            $report->farm_murder = $request->farm_murder;
            $report->victim_name = json_encode($request->victim_name);
            $report->rape = $request->rape;
            $report->rape_people = $request->rape_people;
            $report->assault = $request->assault;
            $report->assault_people = $request->assault_people;
            $report->vehicle_theft = $request->vehicle_theft;
            $report->vehicle_make = $request->vehicle_make;
            $report->vehicle_model = $request->vehicle_model;
            $report->vehicle_colour = $request->vehicle_colour;
            $report->vehicle_year = $request->vehicle_year;
            $report->burglary = $request->burglary;
            $report->burglary_type = $request->burglary_type;
            $report->robbery = $request->robbery;
            $report->robbery_type = $request->robbery_type;
            $report->kidnapping = $request->kidnapping;
            $report->kidnapping_people = $request->kidnapping_people;
            $report->bribery = $request->bribery;
            $report->shoplifting = $request->shoplifting;
            $report->various = json_encode($request->various);
            $report->police_reporting = $request->police_reporting;
            $report->reported_to_the_police = $request->reported_to_the_police;
            $report->police_case_num = $request->police_case_num;
            $report->date_time = date('Y-m-d H:i',strtotime($request->date_time));
            $report->user_count = 1;
            $report->is_updated = 1;
            $report->save();

            foreach($request->files as $file){
                
                $allowedfileExtension=['jpeg','jpg','png','gif'];
                $allowedvideofileExtension=['mkv','mp4','MOV','WMV','AVI','WEBM'];

                $image = $file;
                $fileInfo = $image->getClientOriginalName();
                $filename = pathinfo($fileInfo, PATHINFO_FILENAME);
                $extension = pathinfo($fileInfo, PATHINFO_EXTENSION);
                
                $check=in_array($extension,$allowedfileExtension);
                $videocheck=in_array($extension,$allowedvideofileExtension);
                
                if($check==true)
                {
                    $file_name= $filename.'-'.time().'.'.$extension;
                    $image->move(public_path('upload/report/'.Auth::id().'/'),$file_name);
    
                    $report_image = new ReportImage;
                    $report_image->path = 'upload/report/'.Auth::id().'/'.$file_name;
                    $report_image->report_id = $report->id;
                    $report_image->user_id = Auth::id();
                    $report_image->save();

                } elseif($videocheck==true) {

                    $file_name= $filename.'-'.time().'.'.$extension;
                    $image->move(public_path('upload/report/'.Auth::id().'/'),$file_name);
    
                    $report_image = new ReportImage;
                    $report_image->path = 'upload/report/'.Auth::id().'/'.$file_name;
                    $report_image->report_id = $report->id;
                    $report_image->user_id = Auth::id();
                    $report_image->save();
                    
                } else {
                    return $this->response([
                        'status' => 'flase',
                        'message' => 'Uploaded file type was not support!',
                        'data' =>  $extension,
                    ]);
                }

            }

            return $this->response([
                'success' => true,
                'code' => 200,
                'message' => 'Crime report updated.',
                'data' =>  $report->with(["report_images"])->find($report->id),
            ]);
        } catch(\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function checkReport(Request $request){
        
        try{
            $inreport = reportUser::create([
                'user_id' => Auth::id(),
                'report_id' => $request->report_id,
                'lat' => $request->latitude,
                'long' => $request->longitude,
                'date&time' => date('Y-m-d H:i',strtotime($request->date_time)),
                'is_first' => 0,
            ]);

            $reportUpdate = Report::where('id',$request->report_id)->first();
            $reportUpdate->update([
                'user_count' => $reportUpdate->user_count + 1
            ]);

            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Crime report added.',
                'data' =>  $inreport,
            ]);

        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function getNearByReport(Request $request){

        $lat = $request->latitude;
        $long = $request->longitude;
        
        $report = Report::where('created_at', '>=', Carbon::now()->subHours(1)->toDateTimeString())
                ->select("reports.*","reports.latitude","reports.longitude", \DB::raw("6371 * acos(cos(radians(" . $lat . "))
                * cos(radians(reports.latitude)) 
                * cos(radians(reports.longitude) - radians(" . $long . ")) 
                + sin(radians(" .$lat. ")) 
                * sin(radians(reports.latitude))) AS distance"))
                ->having('distance', '<', 0.25)
                ->with('report_images')
                ->orderBy('id','desc')
                ->get();
        if(count($report) > 0){
                return response()->json([
                    'success' => true,
                    'code' => 200,
                    'message' => 'Crime report.',
                    'data' => $report,
                ]);
        } else {
            return $this->response([
                'success' => false,
                    'code' => 202,
                    'message' => 'No data found!',
                    'data' => null,
            ]);
        }
        
    }

    public function getReportByArea(Request $request){
        try{

            $per_page = $request->per_page ? $request->per_page : 100;
            $report = Report::with(["report_images","user.corporate"]);
            if (isset($request['id'])) {
                $report->where('id', $request['id']);
            }else{
                $report->where('status', 1);
            }
            if (isset($request['murders']) && $request['murders'] != null) {
                $report->where('murders','!=', 0);
            }
            if (isset($request['rape']) && $request['rape'] != null) {
                $report->where('rape','!=', 0);
            }
            if (isset($request['assault']) && $request['assault'] != null) {
                $report->where('assault','!=', 0);
            }
            if (isset($request['burglary']) && $request['burglary'] != null) {
                $report->where('burglary','!=', 0);
            }
            if (isset($request['robbery']) && $request['robbery'] != null) {
                $report->where('robbery','!=', 0);
            }
            if (isset($request['kidnapping']) && $request['kidnapping'] != null) {
                $report->where('kidnapping','!=', 0);
            }
            if (isset($request['bribery']) && $request['bribery'] != null) {
                $report->where('bribery','!=', 0);
            }
            if (isset($request['shoplifting']) && $request['shoplifting'] != null) {
                $report->where('shoplifting','!=', 0);
            }
            if (isset($request['from_date']) && isset($request['to_date'])) {
                $fromDate =Carbon::parse($request->from_date); 
                $toDate = Carbon::parse($request->to_date);  
                $report->whereDate('created_at', '>=', $request['from_date'])->whereDate('created_at', '<=', $request['to_date']);
            }
            if (isset($request['search'])) {
                $report->whereLike(['victim_name','vehicle_make','vehicle_model','vehicle_colour','location','description', 'crime.name', 'specific_crime.name', "user.name"], $request['search']);
            } 
            if (isset($request['longitude']) && isset($request['latitude'])) {
                $lat = $request['latitude'];
                $long = $request['longitude'];
                $report->select("reports.*","reports.latitude","reports.longitude", \DB::raw("6371 * acos(cos(radians(" . $lat . "))
                        * cos(radians(reports.latitude)) 
                        * cos(radians(reports.longitude) - radians(" . $long . ")) 
                        + sin(radians(" .$lat. ")) 
                        * sin(radians(reports.latitude))) AS location"))
                ->having('location', '<', 20);
            }

            $report = $report->select("reports.*")->orderBy('id', 'desc')->paginate($per_page);

            if (count($report) > 0) {
                return $this->response([
                    'status' => $this->getStatusCode(),
                    'message' => 'Report lists',
                    'data' =>  $report,
                ]); 
            } else {

                if (isset($request['longitude']) && isset($request['latitude']) && isset($request['from_date']) && isset($request['to_date'])) {
                    return $this->response([
                        'status' => $this->getStatusCode(),
                        'message' => 'No Crime is being reported nearby this location for '.$request['from_date'].' to '.$request['to_date'],
                        'data' =>  null,
                    ]);
                }

                if (isset($request['from_date']) && isset($request['to_date'])) {
                    return $this->response([
                        'status' => $this->getStatusCode(),
                        'message' => 'No Crime is being reported for '.$request['from_date'].' to '.$request['to_date'].'.',
                        'data' =>  null,
                    ]);
                }

                if(isset($request['longitude']) && isset($request['latitude'])){
                    return $this->response([
                        'status' => $this->getStatusCode(),
                        'message' => 'No Crime is being reported nearby this location recently.',
                        'data' =>  null,
                    ]);
                }

                return $this->response([
                    'status' => $this->getStatusCode(),
                    'message' => 'No Crime is being reported recently you can filter Crime reported by selecting the proper dates in Filter section',
                    'data' =>  null,
                ]);
            }
            
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function allReport(Request $request){
        try{

            $per_page = $request->per_page ? $request->per_page : 100;

            $report = Report::with(["report_images","user.corporate"]);
            if (isset($request['id'])) {
                $report->where('id', $request['id']);
            }else{
                $report->where('status', 1);
            }
            if (isset($request['is_verify_corporate']) && $request['is_verify_corporate'] != 0) {
                $report->whereHas('user.corporate', function ($query) {
                    $query->where('is_verify', 1);
                });
            }
            if (isset($request['murders']) && $request['murders'] != 0) {
                $report->where('murders','!=', 0);
            }
            if (isset($request['rape']) && $request['rape'] != 0) {
                $report->where('rape','!=', 0);
            }
            if (isset($request['assault']) && $request['assault'] != 0) {
                $report->where('assault','!=', 0);
            }
            if (isset($request['burglary']) && $request['burglary'] != 0) {
                $report->where('burglary','!=', 0);
            }
            if (isset($request['robbery']) && $request['robbery'] != 0) {
                $report->where('robbery','!=', 0);
            }
            if (isset($request['kidnapping']) && $request['kidnapping'] != 0) {
                $report->where('kidnapping','!=', 0);
            }
            if (isset($request['bribery']) && $request['bribery'] != 0) {
                $report->where('bribery','!=', 0);
            }
            if (isset($request['shoplifting']) && $request['shoplifting'] != 0) {
                $report->where('shoplifting','!=', 0);
            }
            if (isset($request['from_date']) && isset($request['to_date'])) {
                $fromDate =Carbon::parse($request->from_date); 
                $toDate = Carbon::parse($request->to_date);  
                $report->whereDate('created_at', '>=', $request['from_date'])->whereDate('created_at', '<=', $request['to_date']);
            }
            if (isset($request['search']) && $request['search'] != null) {
                $report->whereLike(['victim_name','vehicle_make','vehicle_model','vehicle_colour','location','description', 'crime.name', 'specific_crime.name', "user.name"], $request['search']);
            } 
            if (isset($request['longitude']) && isset($request['latitude'])) {
                $lat = $request['latitude'];
                $long = $request['longitude'];
                $report->select("reports.location","reports.latitude","reports.longitude", \DB::raw("6371 * acos(cos(radians(" . $lat . "))
                        * cos(radians(reports.latitude)) 
                        * cos(radians(reports.longitude) - radians(" . $long . ")) 
                        + sin(radians(" .$lat. ")) 
                        * sin(radians(reports.latitude))) AS location"))
                ->having('location', '<=', 20);
            }

            $report = $report->select("reports.*")->orderBy('id', 'desc')->get();
            
            if (count($report) > 0) {
                return $this->response([
                    'status' => $this->getStatusCode(),
                    'message' => 'Report lists',
                    'data' =>  $report,
                ]); 
            } else {

                if (isset($request['longitude']) && isset($request['latitude']) && isset($request['from_date']) && isset($request['to_date'])) {
                    return $this->response([
                        'status' => $this->getStatusCode(),
                        'message' => 'No Crime is being reported nearby this location for '.$request['from_date'].' to '.$request['to_date'],
                        'data' =>  null,
                    ]);
                }

                if (isset($request['from_date']) && isset($request['to_date'])) {
                    return $this->response([
                        'status' => $this->getStatusCode(),
                        'message' => 'No Crime is being reported for '.$request['from_date'].' to '.$request['to_date'].'.',
                        'data' =>  null,
                    ]);
                }

                if(isset($request['longitude']) && isset($request['latitude'])){
                    return $this->response([
                        'status' => $this->getStatusCode(),
                        'message' => 'No Crime is being reported nearby this location recently.',
                        'data' =>  null,
                    ]);
                }

                return $this->response([
                    'status' => $this->getStatusCode(),
                    'message' => 'No Crime is being reported recently you can filter Crime reported by selecting the proper dates in Filter section',
                    'data' =>  null,
                ]);
            }
            
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function getMyReport(Request $request){
        try{

            $report = Report::with(["crime", "specific_crime", "report_image"])
                ->where('user_id', Auth::id())->orderBy('id', 'desc')->paginate(100);

            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Report lists',
                'data' =>  $report,
            ]); 
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function get_note(Request $request,$id){
        try{
            $note = ReportNote::where('report_id', $id)->first();
            return $this->response([
                'status' => $this->getStatusCode(),
                'message' => 'Note data',
                'data' =>  $note,
            ]); 
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function add_not(Request $request,$id){
        try{
            $note = ReportNote::where('id', $id)->first();
            if($note){
                $note->note = $request->note;
                $note->report_id = $id;
                $note->save();
    
                return $this->response([
                    'status' => $this->getStatusCode(),
                    'message' => 'Update Note Successfully!',
                    'data' =>  $note,
                ]);
            } else {
                $note = new ReportNote;
                $note->note = $request->note;
                $note->report_id = $id;
                $note->save();
    
                return $this->response([
                    'status' => $this->getStatusCode(),
                    'message' => 'Add Note Successfully!',
                    'data' =>  $note,
                ]);
            }
            
        }catch(\Exception $e){
            return $this->errorResponse($e->getMessage());
        }
    }

    public function burglary(){

        $burglary = [
            'Bicycle',
            'Handbag',
            'Watch',
            'Jewellery',
            'Phone',
            'Credit/Debit/Bank Card',
            'Wallet/Purse',
            'Passport',
            'ID-document',
            'General Documents',
            'Backpack',
            'Suitcase',
            'Copper/Cable',
            'Missing Crops',
            'Missing Livestocks',
            'Other',
        ];

        return $this->response([
            'status' => $this->getStatusCode(),
            'message' => 'Burglary list',
            'data' =>  $burglary,
        ]);
    }
    
    public function robbery(){

        $robbery = [
            'Bicycle',
            'Handbag',
            'Watch',
            'Jewellery',
            'Phone',
            'Credit/Debit/Bank Card',
            'Wallet/Purse',
            'Passport',
            'ID-document',
            'General Documents',
            'Backpack',
            'Suitcase',
            'Cash',
            'Cash-in-transit vehicle',
            'Copper/Cable',
            'Missing Crops',
            'Missing Livestocks',
            'Other',
        ];

        return $this->response([
            'status' => $this->getStatusCode(),
            'message' => 'Robbery list',
            'data' =>  $robbery,
        ]);
    }

    public function carMake(){

        $carMake = [
            'Abarth','Acura','Alfa Romeo','Alpine','Ariel','Aston Martin','Audi',
            'BAC','Bentley','BMW','Bugatti','Buick','Cadillac','Caterham','Chevrolet',
            'Chrysler','Citron','Cupra','Dacia','Daihatsu','Datsun','Dodge','DS Automobiles',
            'Ferrari','Fiat','Ford','Genesis','GMC','Gumpert','Holden','Honda','Hummer','Hyundai',
            'Infiniti','Isuzu','Jaguar','Jeep','Kia','Koenigsegg','Lada','Lamborghini','Lancia','Land Rover',
            'Lexus','Ligier','Lincoln','Lotus','Lucid Motors','Mahindra','Maserati','Maybach','Mazda','McLaren','Mercedes-Benz','MG','Mini','Mitsubishi','Morgan',
            'Mosler','Nissan','Noble','Opel','Pagani','Peugeot','Pininfarina','Polestar','Pontiac','Porsche','Proton','RAM','Renault','Rimac','Rolls-Royce','Rover',
            'Ruf','Saab','Saleen','Saturn','Scion','SEAT','Skoda','Smart','Spyker','SsangYong','SSC','Subaru','Suzuki','Talbot','Tata','Tatra','Tesla',
            'Toyota','Trabant','Triumph','TVR','Vauxhall','Venturi','Volkswagen','Volvo','Wiesmann','Zastava','Zenvo'
        ];

        return $this->response([
            'status' => $this->getStatusCode(),
            'message' => 'Car make list',
            'data' =>  $carMake,
        ]);
    }

    public function carColor(){

        $carMake = [
            'White','Gray','Black','Silver','Red','Blue','Brown',
            'Beige','Yellow','Orange','Teal','Green',
        ];

        return $this->response([
            'status' => $this->getStatusCode(),
            'message' => 'Car color list',
            'data' =>  $carMake,
        ]);
    }
    
    public function CarModel($carMake){
        return redirect('https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/'.$carMake.'?format=json');
    }
    
    public function getCarModel(Request $request){

        $rules = array(
            'carModel' => ['required'],
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->responseValidationError('Fields Validation Failed.', $validator);
        }
        
        return redirect('https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/'.$request->carModel.'?format=json');
    }
}