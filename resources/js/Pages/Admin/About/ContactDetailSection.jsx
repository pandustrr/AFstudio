import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ContactDetailSection({ data, setData, errors, processing, submit }) {
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Kontak Detail</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel value="Email" />
                    <TextInput
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full mt-1"
                        type="email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <InputLabel value="Nomor Telepon / WA" />
                    <TextInput
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full mt-1"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <InputLabel value="Instagram Link" />
                    <TextInput
                        value={data.instagram}
                        onChange={(e) => setData('instagram', e.target.value)}
                        className="w-full mt-1"
                        placeholder="https://instagram.com/..."
                    />
                    {errors.instagram && <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>}
                </div>
                <div>
                    <InputLabel value="Alamat Lengkap" />
                    <TextArea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full mt-1 h-24"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                    <InputLabel value="Google Maps Link" />
                    <TextInput
                        value={data.maps_link}
                        onChange={(e) => setData('maps_link', e.target.value)}
                        className="w-full mt-1"
                        placeholder="Iframe URL or Share Link"
                    />
                    {errors.maps_link && <p className="text-red-500 text-xs mt-1">{errors.maps_link}</p>}
                </div>
            </div>

            <div className="pt-4">
                <PrimaryButton className="w-full justify-center py-4 text-xs tracking-widest uppercase font-black" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </PrimaryButton>
            </div>
        </div>
    );
}
