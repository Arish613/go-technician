import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateServicesToLocalityPages() {
  console.log("🚀 Starting migration: Services × Localities → LocationPages\n");

  const cities = await prisma.city.findMany({
    where: { isActive: true },
    include: { localities: { where: { isActive: true } } },
  });

  if (cities.length === 0) {
    console.log("❌ No active cities found.");
    return;
  }

  const totalLocalities = cities.reduce(
    (sum, c) => sum + c.localities.length,
    0
  );
  console.log(
    `📍 Found ${cities.length} city/cities with ${totalLocalities} localities:`
  );
  cities.forEach((city) => {
    console.log(`   - ${city.name}: ${city.localities.length} localities`);
  });

  const services = await prisma.services.findMany({
    select: { id: true, slug: true, name: true, description: true },
  });

  if (services.length === 0) {
    console.log("❌ No services found.");
    return;
  }

  console.log(`\n📋 Found ${services.length} service(s):`);
  services.forEach((service) => {
    console.log(`   - ${service.name} (${service.slug})`);
  });

  let createdCount = 0;
  let skippedCount = 0;

  for (const service of services) {
    for (const city of cities) {
      for (const locality of city.localities) {
        const slug = `${service.slug}-in-${locality.slug}`;
        const title = `${service.name} in ${locality.name}`;
        const description =
          service.description ||
          `Professional ${service.name} services in ${locality.name}, ${city.name}. Book expert technicians for reliable service.`;
        const content = `
          <h2>Welcome to Go Technicians - ${service.name} in ${locality.name}</h2>
          <p>We provide professional ${service.name.toLowerCase()} services in ${locality.name}, ${city.name} and surrounding areas. Our expert technicians are trained to deliver high-quality service at your doorstep.</p>
          <h3>Why Choose Us?</h3>
          <ul>
            <li>Verified & Expert Technicians</li>
            <li>Transparent Pricing</li>
            <li>On-time Service</li>
            <li>100% Satisfaction Guarantee</li>
          </ul>
          <h3>Our Service Areas in ${city.name}</h3>
          <p>We serve all major areas in ${city.name} including ${city.localities.map((l) => l.name).join(", ")}.</p>
        `;

        const existing = await prisma.locationPage.findUnique({
          where: { slug },
        });

        if (existing) {
          console.log(`   ⏭️  Skipped: ${slug} (already exists)`);
          skippedCount++;
          continue;
        }

        await prisma.locationPage.create({
          data: {
            slug,
            serviceSlug: service.slug,
            location: city.slug,
            locality: locality.slug,
            title,
            description,
            content,
            isPublished: true,
          },
        });

        console.log(`   ✅ Created: ${slug}`);
        createdCount++;
      }
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Created: ${createdCount} new LocationPages`);
  console.log(`   Skipped: ${skippedCount} (already existed)`);

  const totalPages = await prisma.locationPage.count();
  console.log(`\n📊 Total LocationPages in database: ${totalPages}`);
}

migrateServicesToLocalityPages()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Migration failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
