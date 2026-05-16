import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  Package,
  Star,
  MapPin,
  MessageSquare,
  PlusCircle,
  ShoppingCart,
  Tag,
  MapPinned,
} from "lucide-react";
import { format, startOfMonth, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getMonthLabels() {
  const labels: { date: Date; label: string }[] = [];
  const today = startOfMonth(new Date());

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    labels.push({ date, label: format(date, "MMM yyyy") });
  }

  return labels;
}

export default async function AdminPage() {
  const monthLabels = getMonthLabels();
  const monthStart = monthLabels[0].date;

  const [
    totalBlogs,
    publishedBlogs,
    recentPostsRaw,
    monthlyCreatedBlogs,
    blogFaqsCount,
    totalServices,
    publishedServices,
    recentServicesRaw,
    monthlyCreatedServices,
    totalSubServices,
    reviewsCount,
    serviceReviewsCount,
    productReviewsCount,
    allReviewRatingsRaw,
    recentReviewsRaw,
    monthlyCreatedReviews,
    totalProducts,
    availableProducts,
    totalCategories,
    productPriceAgg,
    recentProductsRaw,
    monthlyCreatedProducts,
    totalLocationPages,
    publishedLocationPages,
    cityLevelPages,
    recentLocationPagesRaw,
    monthlyCreatedLocationPages,
    totalCities,
  ] = await Promise.all([
    // Blog queries
    prisma.blog.count(),
    prisma.blog.count({ where: { isPublished: true } }),
    prisma.blog.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        h1: true,
        slug: true,
        isPublished: true,
        updatedAt: true,
      },
    }),
    prisma.blog.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.faq.count({ where: { blogId: { not: null } } }),
    // Service queries
    prisma.services.count(),
    prisma.services.count({ where: { isPublished: true } }),
    prisma.services.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        updatedAt: true,
        _count: {
          select: { subServices: true },
        },
      },
    }),
    prisma.services.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.subService.count(),
    // Review queries
    prisma.review.count(),
    prisma.review.count({ where: { serviceId: { not: null } } }),
    prisma.review.count({ where: { productId: { not: null } } }),
    prisma.review.findMany({ select: { rating: true } }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        rating: true,
        comment: true,
        reviewer: true,
        service: { select: { name: true } },
        product: { select: { name: true } },
        createdAt: true,
      },
    }),
    prisma.review.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    // Product queries
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.category.count(),
    prisma.product.aggregate({ _avg: { price: true } }),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
        updatedAt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.product.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    // Location page queries
    prisma.locationPage.count(),
    prisma.locationPage.count({ where: { isPublished: true } }),
    prisma.locationPage.count({ where: { locality: null } }),
    prisma.locationPage.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        locality: true,
        isPublished: true,
        updatedAt: true,
      },
    }),
    prisma.locationPage.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.city.count(),
  ]);

  const draftBlogs = totalBlogs - publishedBlogs;
  const draftServices = totalServices - publishedServices;

  const allRatings = allReviewRatingsRaw
    .map((r) => parseFloat(r.rating))
    .filter((n) => !isNaN(n));
  const avgRating =
    allRatings.length > 0
      ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
      : "0";

  const avgProductPrice = productPriceAgg._avg.price
    ? Math.round(productPriceAgg._avg.price)
    : 0;

  const monthlyBlogTraffic = monthLabels.map(({ date, label }) => {
    const count = monthlyCreatedBlogs.filter((blog) => {
      const created = startOfMonth(blog.createdAt);
      return created.getTime() === date.getTime();
    }).length;

    return { label, count };
  });

  const monthlyServiceTraffic = monthLabels.map(({ date, label }) => {
    const count = monthlyCreatedServices.filter((service) => {
      const created = startOfMonth(service.createdAt);
      return created.getTime() === date.getTime();
    }).length;

    return { label, count };
  });

  const monthlyReviewTraffic = monthLabels.map(({ date, label }) => {
    const count = monthlyCreatedReviews.filter((review) => {
      const created = startOfMonth(review.createdAt);
      return created.getTime() === date.getTime();
    }).length;

    return { label, count };
  });

  const monthlyProductTraffic = monthLabels.map(({ date, label }) => {
    const count = monthlyCreatedProducts.filter((product) => {
      const created = startOfMonth(product.createdAt);
      return created.getTime() === date.getTime();
    }).length;

    return { label, count };
  });

  const monthlyLocationPageTraffic = monthLabels.map(({ date, label }) => {
    const count = monthlyCreatedLocationPages.filter((page) => {
      const created = startOfMonth(page.createdAt);
      return created.getTime() === date.getTime();
    }).length;

    return { label, count };
  });

  const blogStats = [
    {
      label: "Total Blogs",
      value: totalBlogs,
      change: `${publishedBlogs} live`,
      positive: true,
      icon: FileText,
    },
    {
      label: "Published",
      value: publishedBlogs,
      change: `${draftBlogs} drafts pending`,
      positive: true,
      icon: BarChart3,
    },
    {
      label: "Drafts",
      value: draftBlogs,
      change: "Ready for review",
      positive: draftBlogs <= publishedBlogs,
      icon: FileText,
    },
    {
      label: "Blog FAQs",
      value: blogFaqsCount,
      change: "Total questions",
      positive: true,
      icon: MessageSquare,
    },
  ];

  const serviceStats = [
    {
      label: "Total Services",
      value: totalServices,
      change: `${publishedServices} live`,
      positive: true,
      icon: Wrench,
    },
    {
      label: "Published",
      value: publishedServices,
      change: `${draftServices} drafts pending`,
      positive: true,
      icon: BarChart3,
    },
    {
      label: "Sub-Services",
      value: totalSubServices,
      change: "Active offerings",
      positive: true,
      icon: Package,
    },
    {
      label: "Reviews",
      value: reviewsCount,
      change: "Customer feedback",
      positive: true,
      icon: Star,
    },
  ];

  const reviewStats = [
    {
      label: "Total Reviews",
      value: reviewsCount,
      change: `${serviceReviewsCount} for services`,
      positive: true,
      icon: MessageSquare,
    },
    {
      label: "Service Reviews",
      value: serviceReviewsCount,
      change: "Linked to services",
      positive: true,
      icon: Wrench,
    },
    {
      label: "Product Reviews",
      value: productReviewsCount,
      change: "Linked to products",
      positive: true,
      icon: ShoppingCart,
    },
    {
      label: "Avg Rating",
      value: avgRating,
      change: "Out of 5",
      positive: parseFloat(avgRating) >= 4,
      icon: Star,
    },
  ];

  const productStats = [
    {
      label: "Total Products",
      value: totalProducts,
      change: `${availableProducts} available`,
      positive: true,
      icon: ShoppingCart,
    },
    {
      label: "Available",
      value: availableProducts,
      change: `${totalProducts - availableProducts} unavailable`,
      positive: true,
      icon: Package,
    },
    {
      label: "Categories",
      value: totalCategories,
      change: "Product categories",
      positive: true,
      icon: Tag,
    },
    {
      label: "Avg Price",
      value: `₹${avgProductPrice}`,
      change: "Average listing price",
      positive: true,
      icon: BarChart3,
    },
  ];

  const locationPageStats = [
    {
      label: "Total Pages",
      value: totalLocationPages,
      change: `${publishedLocationPages} published`,
      positive: true,
      icon: MapPin,
    },
    {
      label: "Published",
      value: publishedLocationPages,
      change: `${totalLocationPages - publishedLocationPages} drafts`,
      positive: true,
      icon: BarChart3,
    },
    {
      label: "City Level",
      value: cityLevelPages,
      change: "Broad coverage",
      positive: true,
      icon: MapPinned,
    },
    {
      label: "Cities",
      value: totalCities,
      change: "Markets served",
      positive: true,
      icon: MapPin,
    },
  ];

  const recentPosts = recentPostsRaw.map((post) => ({
    id: post.id,
    title: post.h1,
    slug: post.slug,
    status: post.isPublished ? "Published" : "Draft",
    updatedAt: format(post.updatedAt, "MMM d, yyyy"),
  }));

  const recentServices = recentServicesRaw.map((service) => ({
    id: service.id,
    title: service.name,
    slug: service.slug,
    status: service.isPublished ? "Published" : "Draft",
    updatedAt: format(service.updatedAt, "MMM d, yyyy"),
    subServicesCount: service._count.subServices,
  }));

  const recentReviews = recentReviewsRaw.map((review) => ({
    id: review.id,
    reviewer: review.reviewer,
    rating: review.rating,
    comment: review.comment,
    target: review.service?.name || review.product?.name || "General",
    createdAt: format(review.createdAt, "MMM d, yyyy"),
  }));

  const recentProducts = recentProductsRaw.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category?.name || "Uncategorized",
    isAvailable: product.isAvailable,
    updatedAt: format(product.updatedAt, "MMM d, yyyy"),
  }));

  const recentLocationPages = recentLocationPagesRaw.map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    location: page.locality
      ? `${page.locality}, ${page.location}`
      : page.location,
    isPublished: page.isPublished,
    updatedAt: format(page.updatedAt, "MMM d, yyyy"),
  }));

  return (
    <div className="md:mx-20 py-10 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of blog, service, review, product, and location page performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="w-fit">
            Updated {new Date().toLocaleDateString()}
          </Badge>
          <div className="flex gap-2">
            <Link href="/admin/blog">
              <Button size="sm">Blogs</Button>
            </Link>
            <Link href="/admin/service">
              <Button size="sm" variant="default">
                Services
              </Button>
            </Link>
            <Link href="/admin/second-hand">
              <Button size="sm" variant="default">
                Second Hand Products
              </Button>
            </Link>
            <Link href="/admin/review">
              <Button size="sm" variant="default">
                Reviews
              </Button>
            </Link>
            <Link href="/admin/location-pages">
              <Button size="sm" variant="default">
                Location Pages
              </Button>
            </Link>
            <Link href="/admin/locations">
              <Button size="sm" variant="default">
                Cities & Localities
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="flex flex-wrap gap-3">
        <Link href="/admin/blog/add">
          <Button size="sm" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Blog
          </Button>
        </Link>
        <Link href="/admin/service/add">
          <Button size="sm" variant="outline">
            <Wrench className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </Link>
        <Link href="/admin/second-hand/product/add">
          <Button size="sm" variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
        <Link href="/admin/review/add">
          <Button size="sm" variant="outline">
            <Star className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        </Link>
        <Link href="/admin/location-pages/add">
          <Button size="sm" variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Add Location Page
          </Button>
        </Link>
      </section>

      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="location-pages">Location Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blogStats.map((stat) => {
              const PositiveIcon = stat.positive
                ? ArrowUpRight
                : ArrowDownRight;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <p
                      className={`text-xs ${stat.positive ? "text-emerald-600" : "text-rose-600"
                        } flex items-center gap-1`}
                    >
                      <PositiveIcon className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Publishing Trend</CardTitle>
                <CardDescription>
                  New blogs created over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4 text-center text-sm text-muted-foreground">
                  {monthlyBlogTraffic.map((month) => (
                    <div key={month.label}>
                      <p className="font-medium text-base text-foreground">
                        {month.count}
                      </p>
                      <p>{month.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest blog updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/admin/blog/update/${post.slug}`}>
                    <div className="flex flex-col gap-1 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{post.title}</p>
                        <Badge
                          variant={
                            post.status === "Published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        Updated {post.updatedAt}
                      </div>
                    </div>
                  </Link>
                ))}
                {recentPosts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No recent activity.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceStats.map((stat) => {
              const PositiveIcon = stat.positive
                ? ArrowUpRight
                : ArrowDownRight;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <p
                      className={`text-xs ${stat.positive ? "text-emerald-600" : "text-rose-600"
                        } flex items-center gap-1`}
                    >
                      <PositiveIcon className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Service Creation</CardTitle>
                <CardDescription>
                  New services added over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4 text-center text-sm text-muted-foreground">
                  {monthlyServiceTraffic.map((month) => (
                    <div key={month.label}>
                      <p className="font-medium text-base text-foreground">
                        {month.count}
                      </p>
                      <p>{month.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Services</CardTitle>
                <CardDescription>Latest service updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/admin/service/update/${service.slug}`}
                  >
                    <div className="flex flex-col gap-1 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{service.title}</p>
                        <Badge
                          variant={
                            service.status === "Published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        {service.subServicesCount} sub-services • Updated{" "}
                        {service.updatedAt}
                      </div>
                    </div>
                  </Link>
                ))}
                {recentServices.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No recent activity.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviewStats.map((stat) => {
              const PositiveIcon = stat.positive
                ? ArrowUpRight
                : ArrowDownRight;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <p
                      className={`text-xs ${stat.positive ? "text-emerald-600" : "text-rose-600"
                        } flex items-center gap-1`}
                    >
                      <PositiveIcon className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Review Activity</CardTitle>
                <CardDescription>
                  New reviews added over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4 text-center text-sm text-muted-foreground">
                  {monthlyReviewTraffic.map((month) => (
                    <div key={month.label}>
                      <p className="font-medium text-base text-foreground">
                        {month.count}
                      </p>
                      <p>{month.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.map((review) => (
                  <Link key={review.id} href={`/admin/review`}>
                    <div className="flex flex-col gap-1 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{review.reviewer}</p>
                        <Badge variant="secondary">
                          {review.rating} ★
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {review.comment}
                      </p>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="font-medium">{review.target}</span>
                        <span>•</span>
                        <span>{review.createdAt}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentReviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No recent reviews.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productStats.map((stat) => {
              const PositiveIcon = stat.positive
                ? ArrowUpRight
                : ArrowDownRight;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <p
                      className={`text-xs ${stat.positive ? "text-emerald-600" : "text-rose-600"
                        } flex items-center gap-1`}
                    >
                      <PositiveIcon className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Product Additions</CardTitle>
                <CardDescription>
                  New products added over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4 text-center text-sm text-muted-foreground">
                  {monthlyProductTraffic.map((month) => (
                    <div key={month.label}>
                      <p className="font-medium text-base text-foreground">
                        {month.count}
                      </p>
                      <p>{month.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Latest product updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProducts.map((product) => (
                  <Link key={product.id} href={`/admin/second-hand/product`}>
                    <div className="flex flex-col gap-1 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{product.name}</p>
                        <Badge
                          variant={
                            product.isAvailable ? "default" : "secondary"
                          }
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {product.category} • ₹{product.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated {product.updatedAt}
                      </div>
                    </div>
                  </Link>
                ))}
                {recentProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No recent products.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="location-pages" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locationPageStats.map((stat) => {
              const PositiveIcon = stat.positive
                ? ArrowUpRight
                : ArrowDownRight;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <p
                      className={`text-xs ${stat.positive ? "text-emerald-600" : "text-rose-600"
                        } flex items-center gap-1`}
                    >
                      <PositiveIcon className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Page Creation</CardTitle>
                <CardDescription>
                  New location pages added over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4 text-center text-sm text-muted-foreground">
                  {monthlyLocationPageTraffic.map((month) => (
                    <div key={month.label}>
                      <p className="font-medium text-base text-foreground">
                        {month.count}
                      </p>
                      <p>{month.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Pages</CardTitle>
                <CardDescription>Latest location page updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentLocationPages.map((page) => (
                  <Link key={page.id} href={`/admin/location-pages`}>
                    <div className="flex flex-col gap-1 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{page.title}</p>
                        <Badge
                          variant={
                            page.isPublished ? "default" : "secondary"
                          }
                        >
                          {page.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {page.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated {page.updatedAt}
                      </div>
                    </div>
                  </Link>
                ))}
                {recentLocationPages.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No recent pages.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
