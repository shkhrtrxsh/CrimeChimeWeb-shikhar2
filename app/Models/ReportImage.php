<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportImage extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function getPathAttribute($value) {
        if (!$value) {
            return asset('');
        }
        return asset('' . $value);
    }
}
