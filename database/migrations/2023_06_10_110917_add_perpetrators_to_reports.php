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
        Schema::table('reports', function (Blueprint $table) {
            $table->string('perpetrators')->nullable()->comment('-1=unknown');
            $table->string('perpetrators_des')->nullable();
            $table->integer('weapons')->nullable()->comment('0=unknown,1=none');
            $table->integer('fully_auto_weapons')->nullable();
            $table->integer('semi_auto_weapons')->nullable();
            $table->integer('knife_weapons')->nullable();
            $table->integer('other_weapons')->nullable();
            $table->integer('murders')->nullable()->comment('0=unknown,1=yes,3=no');
            $table->integer('murders_people')->nullable();
            $table->integer('rape')->nullable()->comment('0=dose not apply,1=attempted rape,2=rape');
            $table->integer('rape_people')->nullable();
            $table->integer('assault')->nullable()->comment('0=unknown,1=yes,2=no');
            $table->integer('assault_people')->nullable();
            $table->integer('vehicle_theft')->nullable()->comment('0=hijacking, 1=attempted hijacking, 2=vehice thelt, 3=atempted vehicle theft, 4=does not apply');
            $table->string('vehicle_make')->nullable();
            $table->string('vehicle_model')->nullable();
            $table->string('vehicle_colour')->nullable();
            $table->integer('vehicle_year')->nullable();
            $table->integer('burglary')->nullable()->comment('0=does not apply, 1=attempted burglary, 2= burglary');
            $table->string('burglary_type')->nullable();
            $table->integer('robbery')->nullable()->comment('0=does not apply, 1=attempted robbery, 2=robbery');
            $table->integer('robbery_type')->nullable()->comment('0=unknown,1=yes,3=no');
            $table->integer('kidnapping')->nullable()->comment('0=does not apply, 1=attempted kidnapping, 2=kidnapping');
            $table->integer('kidnapping_people')->nullable();
            $table->integer('bribery')->nullable()->comment('0=does not apply, 1=bribe request by polic officer, 2=bribe request by civil servant, 3=bribe request by politician');
            $table->string('various')->nullable()->comment('2=Does not apply,1=crime occured at ATM, 0=i believe crime to be drug-related, 3=i believe crime to be gang-related, 4=Arson was involed, 5=Vandalism was involed, 6=social an unrest,7=Bombs were involved');
            $table->integer('police_reporting')->nullable()->comment('0=unknown,1=yes,2=no');
            $table->integer('reported_to_the_police')->nullable()->comment('1=yes, 2=no');
            $table->string('police_case_num')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('reports', function (Blueprint $table) {
            //
        });
    }
};
