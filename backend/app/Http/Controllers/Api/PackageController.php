<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Models\Package;
use App\Services\PackageService;

class PackageController extends Controller
{
    protected PackageService $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index()
    {
        $packages = $this->packageService->getAllPackages();

        return response()->json($packages);
    }

    public function show(Package $package)
    {
        $package = $this->packageService->getPackageById($package);

        return response()->json($package);
    }

    public function store(StorePackageRequest $request)
    {
        $package = $this->packageService->createPackage(
            $request->validated()
        );

        return response()->json([
            'message' => 'Package créé avec succès',
            'package' => $package,
        ], 201);
    }

    public function update(UpdatePackageRequest $request, Package $package)
    {
        $package = $this->packageService->updatePackage(
            $package,
            $request->validated()
        );

        return response()->json([
            'message' => 'Package modifié avec succès',
            'package' => $package,
        ]);
    }

    public function destroy(Package $package)
    {
        $this->packageService->deletePackage($package);

        return response()->json([
            'message' => 'Package supprimé avec succès',
        ]);
    }
}