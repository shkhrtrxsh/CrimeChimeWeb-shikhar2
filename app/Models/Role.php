<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'name',
        'slug',
        'status'
    ];


    public function users(){
        return $this->belongsToMany(User::class, 'user_role', 'user_id', 'role_id');
    }

    public function permissions(){
        return $this->belongsToMany(User::class, 'role_permission', 'role_id', 'permission_id');
    }

}
