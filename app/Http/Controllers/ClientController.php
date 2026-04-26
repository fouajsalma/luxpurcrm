<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    //  GET ALL CLIENTS (avec category )
public function index(Request $request)
{
    $query = Client::with('category');

    if ($request->status) {
        $query->where('status', $request->status);
    }

    if ($request->city) {
        $query->where('city', $request->city);
    }

    return $query->get();
}

    // CREATE CLIENT
    public function store(Request $request)
    {
        // validation 
        $data = $request->validate([
            'name' => 'required|string',
            'city' => 'nullable|string',
            'contact_name' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'in:active,inactive'
        ]);

        return Client::create($data);
    }

    // SHOW SINGLE CLIENT
    public function show($id)
    {
        return Client::with('category')->findOrFail($id);
    }

    //  UPDATE CLIENT
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string',
            'city' => 'nullable|string',
            'contact_name' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'in:active,inactive'
        ]);

        $client->update($data);

        return $client;
    }

    // DELETE CLIENT
    public function destroy($id)
    {
        return Client::destroy($id);
    }
}