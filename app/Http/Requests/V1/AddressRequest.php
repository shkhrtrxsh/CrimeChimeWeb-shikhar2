<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class AddressRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'address'  =>  'required',
			'city_id'  =>  'required',
			'state_id'  =>  'required',
			'country_id'  =>  'required',
			'pin_code'  =>  'required',
			'user_id'  =>  'required',
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
