import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';
import {
    BuildingOfficeIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    PhotoIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

import ProfileSection from './ProfileSection';
import VisionMissionSection from './VisionMissionSection';
import ContactDetailSection from './ContactDetailSection';
import MoodboardListSection from './MoodboardListSection';
import MoodboardFormSection from './MoodboardFormSection';
import StatsDNASection from './StatsDNASection';

export default function Index({ about, moodboards }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        title: about.title || 'TENTANG AF STUDIO',
        description: about.description || 'Kami bukan sekadar memotret gambar, kami menenun cerita di balik setiap bayangan dan cahaya.',
        image: null,
        vision: about.vision || '',
        mission: about.mission || '',
        address: about.address || '',
        email: about.email || 'studio@afstudio.com',
        phone: about.phone || '0851-3436-3956',
        instagram: about.instagram || '',
        maps_link: about.maps_link || '',
        story_subtitle: about.story_subtitle || 'Kisah Utama Kami',
        story_title: about.story_title || 'MENGABADIKAN MAHAKARYA YANG TAK TERUCAP.',
        stats: about.stats?.length > 0 ? about.stats : [
            { val: '05+', label: 'Tahun Visi' },
            { val: '1.2K', label: 'Jiwa Terabadikan' }
        ],
        dna: about.dna?.length > 0 ? about.dna : [
            { title: 'Kreativitas Tanpa Batas', desc: 'Mengeksplorasi perspektif baru dalam setiap bingkai foto.', icon: 'sparkles' },
            { title: 'Kualitas Premium', desc: 'Dedikasi tinggi pada detail teknis dan hasil akhir yang sempurna.', icon: 'shield' },
            { title: 'Sentuhan Personal', desc: 'Membangun koneksi untuk menangkap ekspresi yang paling jujur.', icon: 'heart' },
            { title: 'Kolaborasi Tim', desc: 'Sinergi visi antara kami dan Anda untuk hasil mahakarya.', icon: 'users' }
        ],
        cta_title: about.cta_title || 'READY TO IMMORTALIZE?',
        cta_subtitle: about.cta_subtitle || 'Mari ciptakan masa depan yang abadi.',
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [imagePreview, setImagePreview] = useState(about.image_path ? `/storage/${about.image_path}` : null);
    const [showSuccessNotif, setShowSuccessNotif] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentSubmitting, setCurrentSubmitting] = useState(null);

    const tabs = [
        { id: 'profile', label: 'Profil', icon: BuildingOfficeIcon },
        { id: 'vision', label: 'Visi & Misi', icon: GlobeAltIcon },
        { id: 'stats_dna', label: 'Statistik & Keunggulan', icon: SparklesIcon },
        { id: 'contact', label: 'Kontak', icon: EnvelopeIcon },
        { id: 'moodboard', label: 'Moodboard', icon: PhotoIcon },
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const submitterName = e.nativeEvent.submitter?.name;
        setCurrentSubmitting(submitterName);

        post('/admin/about', {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Perubahan berhasil disimpan');
                setShowSuccessNotif(true);
                setCurrentSubmitting(null);
            },
            onError: () => {
                setCurrentSubmitting(null);
            }
        });
    };

    // Moodboard Form
    const { data: mData, setData: setMData, post: postMoodboard, processing: mProcessing, reset: mReset } = useForm({
        image: null,
        title: '',
    });

    const [mImagePreview, setMImagePreview] = useState(null);
    const [deleteMoodboardModal, setDeleteMoodboardModal] = useState(false);
    const [moodboardToDelete, setMoodboardToDelete] = useState(null);

    const handleMoodboardImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMData('image', file);
            setMImagePreview(URL.createObjectURL(file));
        }
    };

    const handleMoodboardSubmit = (e) => {
        e.preventDefault();
        postMoodboard('/admin/about/moodboard', {
            preserveScroll: true,
            onSuccess: () => {
                mReset();
                setMImagePreview(null);
                setSuccessMessage('Moodboard berhasil ditambahkan');
                setShowSuccessNotif(true);
            },
        });
    };

    const openDeleteMoodboardModal = (id) => {
        setMoodboardToDelete(id);
        setDeleteMoodboardModal(true);
    };

    const confirmDeleteMoodboard = () => {
        router.delete(`/admin/about/moodboard/${moodboardToDelete}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteMoodboardModal(false);
                setSuccessMessage('Moodboard berhasil dihapus');
                setShowSuccessNotif(true);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan About" />

            <EditNotif
                show={showSuccessNotif}
                onClose={() => setShowSuccessNotif(false)}
                message={successMessage}
                type="success"
                duration={2000}
            />

            <ConfirmModal
                isOpen={deleteMoodboardModal}
                onClose={() => setDeleteMoodboardModal(false)}
                onConfirm={confirmDeleteMoodboard}
                title="Hapus Moodboard"
                message="Apakah Anda yakin ingin menghapus moodboard ini?"
                variant="danger"
            />

            <div className="pt-6 lg:pt-8 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-tight">Halaman About</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">Atur konten halaman Tentang Kami, Visi Misi, dan Kontak perusahaan Anda</p>
                    </div>

                    {/* Compact Tab Switcher */}
                    <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                                        : 'text-brand-black/40 dark:text-brand-white/40 hover:text-brand-black dark:hover:text-brand-white'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-brand-gold'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="relative">
                    {/* Sections within forms where applicable */}
                    {activeTab === 'profile' && (
                        <form onSubmit={submit} className="animate-fade-in">
                            <ProfileSection
                                data={data}
                                setData={setData}
                                imagePreview={imagePreview}
                                handleImageChange={handleImageChange}
                                errors={errors}
                                currentSubmitting={currentSubmitting}
                            />
                        </form>
                    )}

                    {activeTab === 'vision' && (
                        <form onSubmit={submit} className="animate-fade-in">
                            <VisionMissionSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                currentSubmitting={currentSubmitting}
                            />
                        </form>
                    )}

                    {activeTab === 'stats_dna' && (
                        <form onSubmit={submit} className="animate-fade-in">
                            <StatsDNASection
                                data={data}
                                setData={setData}
                                errors={errors}
                                currentSubmitting={currentSubmitting}
                            />
                        </form>
                    )}

                    {activeTab === 'contact' && (
                        <form onSubmit={submit} className="animate-fade-in">
                            <ContactDetailSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                currentSubmitting={currentSubmitting}
                            />
                        </form>
                    )}

                    {activeTab === 'moodboard' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 order-2 lg:order-1">
                                    <MoodboardListSection
                                        moodboards={moodboards}
                                        openDeleteMoodboardModal={openDeleteMoodboardModal}
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <MoodboardFormSection
                                        mData={mData}
                                        setMData={setMData}
                                        mImagePreview={mImagePreview}
                                        setMImagePreview={setMImagePreview}
                                        handleMoodboardImageChange={handleMoodboardImageChange}
                                        handleMoodboardSubmit={handleMoodboardSubmit}
                                        mProcessing={mProcessing}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </AdminLayout>
    );
}
