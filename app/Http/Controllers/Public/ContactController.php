<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email_whatsapp' => 'required|string|max:255',
            'service_category' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        Contact::create([
            'full_name' => $validated['full_name'],
            'email_whatsapp' => $validated['email_whatsapp'],
            'service_category' => $validated['service_category'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        return redirect()->back()->with('success', 'Pesan Anda telah terkirim. Kami akan segera merespons!');
    }

    public function index()
    {
        $contacts = Contact::latest()->paginate(20);
        return inertia('Admin/Contacts/Index', ['contacts' => $contacts]);
    }

    public function show(Contact $contact)
    {
        return inertia('Admin/Contacts/Show', ['contact' => $contact]);
    }

    public function update(Contact $contact, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,replied',
        ]);

        $contact->update($validated);

        return redirect()->back()->with('success', 'Status pesan diperbarui');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->back()->with('success', 'Pesan dihapus');
    }
}
