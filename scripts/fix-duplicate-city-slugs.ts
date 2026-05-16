import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function fixDuplicateCitySlugs() {
  console.log("🔧 Starting fix: Remove duplicated city names from Locality slugs\n");

  const localities = await prisma.locality.findMany({
    include: { city: true },
  });

  let fixedLocalities = 0;
  let fixedLocationPages = 0;
  let skippedLocalities = 0;
  let errors = 0;

  for (const locality of localities) {
    const citySlug = locality.city.slug;
    const suffix = `-${citySlug}-${citySlug}`;

    if (!locality.slug.endsWith(suffix)) {
      continue;
    }

    const oldSlug = locality.slug;
    const newSlug = oldSlug.slice(0, -(citySlug.length + 1));

    const conflicting = await prisma.locality.findUnique({
      where: { slug: newSlug },
    });

    if (conflicting && conflicting.id !== locality.id) {
      console.log(
        `   ⚠️  Skipped locality: "${locality.name}" (${oldSlug}) — target slug "${newSlug}" already taken by "${conflicting.name}"`
      );
      skippedLocalities++;
      continue;
    }

    try {
      await prisma.locality.update({
        where: { id: locality.id },
        data: { slug: newSlug },
      });
      console.log(`   ✅ Locality: ${oldSlug} → ${newSlug}`);
      fixedLocalities++;
    } catch (error) {
      console.error(`   ❌ Error updating locality ${oldSlug}:`, error);
      errors++;
      continue;
    }

    const locationPages = await prisma.locationPage.findMany({
      where: {
        locality: oldSlug,
      },
    });

    for (const page of locationPages) {
      const oldPageSlug = page.slug;
      const newPageSlug = oldPageSlug.replace(
        `-in-${oldSlug}`,
        `-in-${newSlug}`
      );

      const existingPage = await prisma.locationPage.findUnique({
        where: { slug: newPageSlug },
      });

      if (existingPage && existingPage.id !== page.id) {
        console.log(
          `   ⚠️  Skipped location page: "${oldPageSlug}" — target slug "${newPageSlug}" already exists`
        );
        continue;
      }

      try {
        await prisma.locationPage.update({
          where: { id: page.id },
          data: {
            slug: newPageSlug,
            locality: newSlug,
          },
        });
        console.log(`   ✅ LocationPage: ${oldPageSlug} → ${newPageSlug}`);
        fixedLocationPages++;
      } catch (error) {
        console.error(
          `   ❌ Error updating location page ${oldPageSlug}:`,
          error
        );
        errors++;
      }
    }
  }

  console.log("\n✅ Fix complete!");
  console.log(`   Localities fixed: ${fixedLocalities}`);
  console.log(`   LocationPages fixed: ${fixedLocationPages}`);
  console.log(`   Localities skipped (conflicts): ${skippedLocalities}`);
  console.log(`   Errors: ${errors}`);

  const remainingLocalities = await prisma.locality.findMany({
    include: { city: true },
  });

  const stillDuplicated = remainingLocalities.filter(
    (l) => l.slug.endsWith(`-${l.city.slug}-${l.city.slug}`)
  );

  if (stillDuplicated.length > 0) {
    console.log(
      `\n⚠️  ${stillDuplicated.length} locality/localities still have duplicated city slugs:`
    );
    stillDuplicated.forEach((l) =>
      console.log(`   - ${l.name}: ${l.slug}`)
    );
  } else {
    console.log("\n🎉 No more duplicated city slugs found!");
  }
}

fixDuplicateCitySlugs()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Fix failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });