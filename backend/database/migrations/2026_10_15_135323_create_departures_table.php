<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('departures', function (Blueprint $table) {
        $table->id();

        $table->foreignId('package_id')
              ->constrained('packages')
              ->cascadeOnDelete();

        $table->date('date_depart');
        $table->date('date_retour');
        $table->decimal('prix', 10, 2);
        $table->integer('capacite');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departures');
    }
};
