<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class ReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'location' => 'required',
            'longitude' => 'required',
            'latitude' => 'required',
            'google_place_id' => 'required',
            'crime' => 'required',
            'specific_crime' => 'required',
            // 'files' => 'required',
            // 'description' => 'required'
        ];
    }

    public function failedValidation(Validator $validator){
       throw new HttpResponseException(response()->json([        
         'success'   =>  422,
         'message'   => 'Validation errors',
         'data'      => $validator->errors()
       ]));
    }
}
