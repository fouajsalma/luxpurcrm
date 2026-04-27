<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Lead::with(['category','source','assignedTo']);

        // filtres
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }

    // POST /api/leads
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'city' => 'nullable|string|max:255',

        'contact_name' => 'nullable|string|max:255',
        'contact_email' => 'nullable|email|max:255',
        'contact_phone' => 'nullable|string|max:20',

        'priority' => 'required|in:low,medium,high',
        'status' => 'required|in:new,contacted,negotiation,converted,lost',

        'category_id' => 'nullable|exists:categories,id',
        'source_id' => 'nullable|exists:lead_sources,id',
        'assigned_to' => 'nullable|exists:users,id',
    ]);

    $lead = Lead::create($validated);

    return response()->json([
        'message' => 'Lead created successfully',
        'data' => $lead
    ], 201);
}
    // GET /api/leads/{id}
    public function show($id)
    {
        $lead = Lead::with(['category','source','assignedTo'])->findOrFail($id);
        return response()->json($lead);
    }

    // PUT /api/leads/{id}
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $lead->update($request->all());

        return response()->json($lead);
    }

    // DELETE /api/leads/{id}
    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
