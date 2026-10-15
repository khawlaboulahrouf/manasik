<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'departure_id',
        'montant_total',
        'statut',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function departure()
    {
        return $this->belongsTo(Departure::class);
    }

    public function pelerins()
    {
        return $this->belongsToMany(Pelerin::class,'reservation_pelerin');
    }
}