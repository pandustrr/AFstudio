import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <AdminLayout>
            <Head title="Test Insights" />
            <div className="p-12">
                <h1 className="text-4xl font-bold">Test Page - Insights Working!</h1>
                <p className="mt-4">If you can see this, the routing and component are working.</p>
            </div>
        </AdminLayout>
    );
}
