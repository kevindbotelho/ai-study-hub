import { useState } from 'react';

export function Settings() {
    const [activeTab, setActiveTab] = useState('Profile');
    const [name, setName] = useState('Alex Rivera');
    const [role, setRole] = useState('Researcher');

    const tabs = ['Profile', 'Account', 'Appearance', 'Integrations'];

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm">

            {/* Header */}
            <header className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-primary/10">
                <div>
                    <h1 className="text-xl font-bold leading-tight">Settings</h1>
                    <p className="text-sm text-slate-500">Manage your profile and preferences</p>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

                {/* Navigation Tabs (Sidebar on desktop, horizontal on mobile) */}
                <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto border-b md:border-b-0 md:border-r border-primary/10 md:w-64 shrink-0 bg-white/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-none py-4 px-6 text-sm font-semibold border-b-2 md:border-b-0 md:border-l-2 text-left transition-colors ${activeTab === tab
                                    ? 'border-primary text-primary bg-primary/5'
                                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-white">
                    <div className="max-w-xl mx-auto w-full">

                        {activeTab === 'Profile' && (
                            <div className="animate-in fade-in duration-300">
                                {/* Profile Picture Section */}
                                <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-10 border-b border-slate-100">
                                    <div className="relative">
                                        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                            <img
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7UP9vAdh7JTKMa47yliblUHKc627Qe-tUS2VKr1aNE8LcJ3BzuG87Ycw_aGmqa8gLiZ5ab3iH-orXjG8_F_0nOcwaqF1tmFD8m4lO5YZ_VsFLFei6IATv-zNEr_sjhJpZMYGoRkjvD1CXOE09RISyjMvKg9Y2qPWtYbGoW0fOZVy3HznseF87z9OuQkzBHDsW3QSGQNd1Tw9jK3mwjMTXUxpKi-3EmYaQELpuq5m_deoGDyahIAzraKtsVzvwPUH_kPAtM_kc5y0"
                                            />
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm block">edit</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center md:items-start justify-center pt-2">
                                        <h2 className="text-lg font-bold">Profile Picture</h2>
                                        <p className="text-sm text-slate-500 mb-3 text-center md:text-left">Use a square image, at least 400x400px.</p>
                                        <button className="px-5 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary/20 transition-colors">
                                            Change Photo
                                        </button>
                                    </div>
                                </section>

                                {/* Form Fields */}
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                            type="text"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed shadow-inner"
                                            disabled
                                            type="email"
                                            value="alex.rivera@research.ai"
                                        />
                                        <p className="text-xs text-slate-400 ml-1">Email cannot be changed once verified.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Profession / Role</label>
                                        <div className="relative">
                                            <select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm pr-10"
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Researcher">Researcher</option>
                                                <option value="Data Scientist">Data Scientist</option>
                                                <option value="Academic Professor">Academic Professor</option>
                                                <option value="Independent Professional">Independent Professional</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row-reverse gap-3 items-center">
                                        <button className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all" type="submit">
                                            Save Changes
                                        </button>
                                        <button className="w-full sm:w-auto px-8 py-3 text-slate-500 font-semibold hover:bg-slate-100 rounded-full transition-colors" type="button">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab !== 'Profile' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl">build</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-700 mb-2">{activeTab} Settings</h2>
                                <p className="text-slate-500 max-w-sm">This section is currently under development. Check back later for updates.</p>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
