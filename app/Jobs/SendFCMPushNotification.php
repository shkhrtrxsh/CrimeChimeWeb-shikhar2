<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\UserAddress;
use App\Models\reportNotification;

class SendFCMPushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $lat;
    protected $long;
    protected $userList;

    public function __construct($userList,$lat,$long)
    {
        $this->userList = $userList;
        $this->lat = $lat;
        $this->long = $long;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ($this->userList as $value) {
                
            foreach ($value as $user) {

                $firebaseToken = $user->user->device_id;
            
                $SERVER_API_KEY = 'AAAA9dg49so:APA91bEDd_7fMsucmn1w2ZTmgtCRnUqfQVEALyP7QvfGyBbKbAUvsjPOMFRuAjqIwsnKl2RTwJdk8EIJzeECP2T21xfJBiReJwNutnB9QztgZwh8KIEGn6nJvGi0iD9uSxMPYIIGqhca';
        
                $data = [
                    "to" => $firebaseToken,
                    "notification" => [
                        "title" => 'Crime Report',
                        "body" => 'Crime reported in nearby your location.',  
                    ]
                ];
                $dataString = json_encode($data);
            
                $headers = [
                    'Authorization: key=' . $SERVER_API_KEY,
                    'Content-Type: application/json',
                ];
            
                $ch = curl_init();
            
                curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
                   
                $response = curl_exec($ch);
                $res = json_decode($response);
                
                reportNotification::create([
                    'user_id' => $user->user_id,
                    'latitude' => $this->lat,
                    'longitude' => $this->long,
                    'address' => $user->address,
                    'distance' => $user->distance,
                    'location_name' => $user->name_location,
                ]);
            }
        }
    }
}
