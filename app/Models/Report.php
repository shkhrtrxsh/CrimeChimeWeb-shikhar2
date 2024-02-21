<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function crime(){
        return $this->belongsTo(Crime::class);
    }


    public function specific_crime(){
        return $this->belongsTo(SpecificCrime::class);
    }

    public function report_image(){
        return $this->hasOne(ReportImage::class);
    }

    public function report_images(){
        return $this->hasMany(ReportImage::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

}
