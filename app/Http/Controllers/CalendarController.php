<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    // GET ALL EVENTS
    public function index(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');

        $events = CalendarEvent::when($start && $end, function ($query) use ($start, $end) {
            return $query->whereBetween('start_datetime', [$start, $end]);
        })->get();

        return response()->json($events);
    }

    // CREATE EVENT
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start_datetime' => 'required|date',
            'end_datetime' => 'nullable|date|after:start_datetime',
            'description' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $event = CalendarEvent::create([
            'title' => $request->title,
            'start_datetime' => $request->start_datetime,
            'end_datetime' => $request->end_datetime,
            'user_id' => Auth::id(),
        ]);

        return response()->json($event, 201);
    }

    // UPDATE EVENT
    public function update(Request $request, $id)
    {
        $event = CalendarEvent::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'start_datetime' => 'sometimes|date',
            'end_datetime' => 'nullable|date|after:start_datetime',
            'description' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $event->update($request->all());

        return response()->json($event);
    }

    // DELETE EVENT
    public function destroy($id)
    {
        $event = CalendarEvent::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    // GET SINGLE EVENT
    public function show($id)
    {
        $event = CalendarEvent::findOrFail($id);
        return response()->json($event);
    }
}