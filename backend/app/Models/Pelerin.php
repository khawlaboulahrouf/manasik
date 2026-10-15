<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelerin extends Model
{
    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'date_naissance',
        'numero_passeport',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservations()
    {
        return $this->belongsToMany(
            Reservation::class,
            'reservation_pelerin'
        );
    }
}