<?php

namespace App\Http\Requests;



use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null
            && $this->user()->role === 'client';
    }

    public function rules(): array
    {
        return [
            'departure_id' => [
                'required',
                'integer',
                'exists:departures,id',
            ],
        ];
    }
}
