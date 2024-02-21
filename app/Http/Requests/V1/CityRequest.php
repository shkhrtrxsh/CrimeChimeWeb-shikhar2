<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class CityRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'name'  =>  'required',
			'country_id'  =>  'required',
			'state_id'  =>  'required',
			'latitude'  =>  'required',
			'longitude'  =>  'required',
			'status'  =>  '',
        ];
    }

    public function failedValidation(Validator $validator){
       throw new HttpResponseException(response()->json([
         'success'   => 422,
         'message'   => 'Validation errors',
         'data'      => $validator->errors()
       ]));
    }

}
