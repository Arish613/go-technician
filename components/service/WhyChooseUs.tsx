import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldCheck, Clock, Award } from "lucide-react";

interface WhyChooseUsProps {
    name: string;
    whyChooseUs: Array<{
        title: string;
        description: string;
        icon?: React.ReactNode;
    }>;
}

// Helper to get a relevant icon based on index if none is provided
const getFallbackIcon = (index: number) => {
    const icons = [ShieldCheck, Clock, Award];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-6 w-6 text-primary" aria-hidden="true" />;
};

export function WhyChooseUs({ service }: { service: WhyChooseUsProps }) {
    if (!service.whyChooseUs || service.whyChooseUs.length === 0) return null;

    return (
        <section className="relative py-16 md:py-24 bg-slate-50 overflow-hidden ">
            <div className="md:mx-20 px-4">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.4]"
                    style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                {/* Decorative Gradient Blob */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none" />


                <div className="container relative z-10 mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Why Choose Gotechnicians <span className="text-primary">{service.name}</span> Service?
                        </h2>
                        <p className="text-sm md:text-lg text-slate-600">
                            Experience reliability, transparency, and expertise with every service booking.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {service.whyChooseUs.map((item, idx) => (
                            <Card
                                key={idx}
                                className="group relative h-full border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                            >
                                <CardHeader className="flex flex-col items-center text-center ">
                                    {/* Icon Container with Hover Effect */}
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300  group-hover:text-white">
                                        {item.icon ? (
                                            <span className="text-2xl" aria-hidden>
                                                {item.icon}
                                            </span>
                                        ) : (
                                            getFallbackIcon(idx)
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                        {item.title}
                                    </h3>
                                </CardHeader>
                                <CardContent className="text-center pb-8 px-6">
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}