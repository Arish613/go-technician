import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateServicesToLocationPages() {
  console.log("🚀 Starting migration: Services → LocationPages\n");

  // Fetch all active cities
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    include: { localities: { where: { isActive: true } } },
  });

  if (cities.length === 0) {
    console.log("❌ No active cities found. Please add cities first.");
    return;
  }

  console.log(`📍 Found ${cities.length} active city/cities:`);
  cities.forEach((city) => {
    console.log(`   - ${city.name} (${city.localities.length} localities)`);
  });

  // Fetch all services
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

  // For each service × city combination, create a LocationPage
  for (const service of services) {
    for (const city of cities) {
      const slug = `${service.slug}-in-${city.slug}`;
      const title = `${service.name} in ${city.name}`;
      const description =
        service.description ||
        `Professional ${service.name} services in ${city.name}. Book expert technicians for reliable service.`;
      const content = `
        <h2>Welcome to Go Technicians - ${service.name} in ${city.name}</h2>
        <p>We provide professional ${service.name.toLowerCase()} services in ${city.name} and surrounding areas. Our expert technicians are trained to deliver high-quality service at your doorstep.</p>
        <h3>Why Choose Us?</h3>
        <ul>
          <li>Verified & Expert Technicians</li>
          <li>Transparent Pricing</li>
          <li>On-time Service</li>
          <li>100% Satisfaction Guarantee</li>
        </ul>
        <h3>Our Service Areas in ${city.name}</h3>
        <p>We serve all major areas in ${city.name} including ${city.localities.map((l) => l.name).join(", ") || "all localities"}.</p>
      `;

      // Check if LocationPage already exists
      const existing = await prisma.locationPage.findUnique({
        where: { slug },
      });

      if (existing) {
        console.log(`   ⏭️  Skipped: ${slug} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create LocationPage
      await prisma.locationPage.create({
        data: {
          slug,
          serviceSlug: service.slug,
          location: city.slug,
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

  console.log(`\n✅ Migration complete!`);
  console.log(`   Created: ${createdCount} new LocationPages`);
  console.log(`   Skipped: ${skippedCount} (already existed)`);

  // Display summary
  const totalPages = await prisma.locationPage.count();
  console.log(`\n📊 Total LocationPages in database: ${totalPages}`);
}

migrateServicesToLocationPages()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Migration failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
