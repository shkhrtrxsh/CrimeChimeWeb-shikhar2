<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Corporate extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function getLogoAttribute($value)
    {
        return url('/upload/CorAdminLogo/'. $value);
    }
}
