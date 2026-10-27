<?php

namespace App\Services;
use App\Models\Package;


class PackageService
{
    // Récupérer tous les packages
    public function getAllPackages()
    {
        return Package::latest()->get();
    }

    // Récupérer un seul package
    public function getPackageById(Package $package)
    {
        return $package;
    }

    // Créer un package
    public function createPackage(array $data)
    {
        return Package::create($data);
    }

    // Modifier un package
    public function updatePackage(Package $package, array $data)
    {
        $package->update($data);

        return $package->refresh();
    }

    // Supprimer un package
    public function deletePackage(Package $package)
    {
        return $package->delete();
    }
}
