import { PrismaClient } from "@prisma/client";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function appendCityName(name: string, cityName: string): string {
  const trimmed = name.trim();
  const cityPattern = new RegExp(`\\s+${cityName}$`, "i");
  const baseName = trimmed.replace(cityPattern, "").trim();
  return `${baseName} ${cityName}`;
}

async function addLocalities() {
  try {
    console.log("\n🏙️  Bulk Locality Addition\n");

    const citySlug = await question("Enter city slug (e.g. mumbai): ");
    if (!citySlug) {
      console.error("❌ City slug is required!");
      process.exit(1);
    }

    const city = await prisma.city.findUnique({
      where: { slug: citySlug.trim().toLowerCase() },
    });

    if (!city) {
      console.error(`❌ City with slug '${citySlug}' not found!`);
      console.log("   Please add the city first or check the slug.");
      process.exit(1);
    }

    console.log(`\n📍 City: ${city.name} (${city.slug})`);

    const customListInput = await question(
      "Paste locality names (comma or newline separated): ",
    );

    let rawNames: string[];
    if (customListInput.trim()) {
      rawNames = customListInput
        .split(/[,\n]+/)
        .map((n) => n.trim())
        .filter(Boolean);
    } else {
      console.error("❌ No localities provided!");
      process.exit(1);
    }

    const localityNames = rawNames.map((n) => appendCityName(n, city.name));

    console.log("\n📋 Final locality names to add:");
    localityNames.forEach((name, i) => {
      console.log(`   ${i + 1}. ${name}`);
    });

    const confirm = await question(
      `\n➡️  Add ${localityNames.length} localities to '${city.name}'? (yes/no): `,
    );
    if (confirm.trim().toLowerCase() !== "yes") {
      console.log("❌ Cancelled.");
      process.exit(0);
    }

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    console.log("\n🚀 Processing...\n");

    for (const name of localityNames) {
      const localitySlug = `${slugify(name)}-${city.slug}`;

      const existing = await prisma.locality.findUnique({
        where: { slug: localitySlug },
      });

      if (existing) {
        console.log(
          `   ⏭️  Skipped: ${name} (slug: ${localitySlug} already exists)`,
        );
        skippedCount++;
        continue;
      }

      try {
        await prisma.locality.create({
          data: {
            name,
            slug: localitySlug,
            cityId: city.id,
            isActive: true,
          },
        });
        console.log(`   ✅ Created: ${name} (slug: ${localitySlug})`);
        createdCount++;
      } catch (error) {
        console.error(`   ❌ Error: ${name} -`, error);
        errorCount++;
      }
    }

    console.log("\n✅ Done!");
    console.log(`   Created: ${createdCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors:  ${errorCount}`);
  } catch (error) {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

addLocalities();
