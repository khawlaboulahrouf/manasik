<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    //
    protected $fillable = [
        'titre',
        'type',
        'description',
        'image',
    ];

    public function departures()
    {
        return $this->hasMany(Departure::class);
    }
}
