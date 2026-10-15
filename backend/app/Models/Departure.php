<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departure extends Model
{
    //
    protected $fillable = [
        'package_id',
        'date_depart',
        'date_retour',
        'prix',
        'capacite',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
