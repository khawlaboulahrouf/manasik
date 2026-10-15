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
    Schema::create('pelerins', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')
              ->constrained('users')
              ->restrictOnDelete();

        $table->string('nom');
        $table->string('prenom');
        $table->date('date_naissance');
        $table->string('numero_passeport')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelerins');
    }
};
