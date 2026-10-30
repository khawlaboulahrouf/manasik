<?php

namespace App\Http\Requests;



use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'package_id' => 'sometimes|required|exists:packages,id',
            'date_depart' => 'sometimes|required|date|after_or_equal:today',
            'date_retour' => 'sometimes|required|date|after_or_equal:date_depart',
            'prix' => 'sometimes|required|numeric|min:0',
            'capacite' => 'sometimes|required|integer|min:1',
        ];
    }
}
