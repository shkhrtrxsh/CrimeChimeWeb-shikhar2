<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 40);
            $table->string('slug', 40)->unique();            
            $table->boolean('status')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
        $name = ['Administrator','User','Corporate admin','Corporate user'];
        $slug = ['administrator','user','cor_admin','cor_user'];
        foreach ($name as $key => $value) {
            \DB::table('roles')->insert([
                'name' => $value,
                'slug' => $slug[$key],
            ]);
        }        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('roles');
    }
};
