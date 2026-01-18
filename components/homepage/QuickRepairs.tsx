import Image from "next/image";

const repairs = [
  {
    title: "Laptop Repair",
    image: "/icons/laptop-service.png",
  },
  {
    title: "Refrigerator",
    image: "/icons/refrigerator-repair.png",
  },
  {
    title: "Washing Machine",
    image: "/icons/washing-machine.png",
  },
];

export function QuickRepairs() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-2 text-center">
          <p className="text-base font-semibold uppercase tracking-wider text-blue-600">
            QUICK REPAIRS
          </p>
        </div>
        <h2 className="mb-2 text-center text-4xl font-bold text-slate-900">
          Book Quick Device Repairs Online
          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500 align-middle"></span>
        </h2>
        <p className="mb-12 text-center text-lg text-slate-500">
          Hassle-free service at your doorstep
        </p>

        {/* Devices Grid */}
        <div className="relative flex justify-center">
          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {repairs.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-blue-50 py-10 px-4 rounded-lg"
              >
                <div className="mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
