import { Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";

export function JoinProNetwork() {
    return (
        <section className="relative md:py-24 py-10 overflow-hidden bg-slate-50">
            {/* Background Decorative Pattern (Subtle Dot Grid) */}
            <div className="absolute inset-0 z-0 opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            {/* Soft Gradient Blob for Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -z-10" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white  md:shadow-2xl ring-1 ring-slate-900/5">
                    <div className="flex flex-col md:flex-row">

                        {/* Left Content Area */}
                        <div className="flex-1 p-10 md:p-14 flex flex-col justify-center items-start">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-6 border border-blue-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                For Service Experts
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                                Want To <span className="text-blue-600">Partner</span> With Us?
                            </h2>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Stop chasing leads and start getting booked. Join our exclusive network of top-rated professionals and get direct access to high-value jobs.
                            </p>

                            {/* Value Props List */}
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Guaranteed payments & zero marketing costs",
                                    "Manage your schedule on your terms",
                                    "Build your reputation with verified reviews"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://wa.me/917977661546"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-base transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5">
                                    Become a Partner
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </a>
                        </div>

                        {/* Right Visual Area (Decorative) */}
                        <div className="relative hidden md:flex w-1/3 bg-slate-50 items-center justify-center border-l border-slate-100">
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full" />
                                    <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                                        <Briefcase className="h-10 w-10 text-blue-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-slate-900">2,500+</p>
                                    <p className="text-sm text-slate-500 font-medium">Pros Joined</p>
                                </div>
                            </div>

                            {/* Background Pattern for Right Side */}
                            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}