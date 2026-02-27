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
  MapPin,
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
    totalServices,
    publishedServices,
    recentServicesRaw,
    monthlyCreatedServices,
    totalSubServices,
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
  ]);

  const draftBlogs = totalBlogs - publishedBlogs;
  const draftServices = totalServices - publishedServices;

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
      label: "Unique Visitors",
      value: "—",
      change: "Connect analytics",
      positive: true,
      icon: Users,
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
      label: "Service Requests",
      value: "—",
      change: "Connect CRM",
      positive: true,
      icon: Users,
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

  return (
    <div className="md:mx-20 py-10 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of blog and service performance
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
          </div>
        </div>
      </header>

      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
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
              <CardContent className="space-y-4">
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
                <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground">
                  Hook up a chart library (e.g., recharts) and feed it the
                  `monthlyBlogTraffic` array for a line or bar visualization.
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
              <CardContent className="space-y-4">
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
                <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground">
                  Hook up a chart library (e.g., recharts) and feed it the
                  `monthlyServiceTraffic` array for a line or bar visualization.
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
      </Tabs>
    </div>
  );
}
