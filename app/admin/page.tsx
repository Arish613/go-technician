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
} from "lucide-react";
import { format, startOfMonth, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  const [totalBlogs, publishedBlogs, recentPostsRaw, monthlyCreated] =
    await Promise.all([
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
    ]);

  const drafts = totalBlogs - publishedBlogs;

  const monthlyTraffic = monthLabels.map(({ date, label }, idx) => {
    const nextMonth =
      idx === monthLabels.length - 1
        ? startOfMonth(new Date())
        : monthLabels[idx + 1].date;

    const count = monthlyCreated.filter((blog) => {
      const created = startOfMonth(blog.createdAt);
      return created.getTime() === date.getTime();
    }).length;

    return { label, count };
  });

  const stats = [
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
      change: `${drafts} drafts pending`,
      positive: true,
      icon: BarChart3,
    },
    {
      label: "Drafts",
      value: drafts,
      change: "Ready for review",
      positive: drafts <= publishedBlogs,
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

  const recentPosts = recentPostsRaw.map(
    (post: {
      id: string;
      h1: string;
      slug: string;
      isPublished: boolean;
      updatedAt: Date;
    }) => ({
      id: post.id,
      title: post.h1,
      slug: post.slug,
      status: post.isPublished ? "Published" : "Draft",

      updatedAt: format(post.updatedAt, "MMM d, yyyy"),
    })
  );

  return (
    <div className="container mx-auto py-10 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of blog performance and publishing activity
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="w-fit">
            Updated {new Date().toLocaleDateString()}
          </Badge>
          <div className="flex gap-2">
            <Link href="/admin/blog/add">
              <Button size="sm">Add Blog</Button>
            </Link>
            <Link href="/admin/services/add">
              <Button size="sm" variant="outline">
                Add Service
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const PositiveIcon = stat.positive ? ArrowUpRight : ArrowDownRight;
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
                  className={`text-xs ${
                    stat.positive ? "text-emerald-600" : "text-rose-600"
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
              {monthlyTraffic.map((month) => (
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
              `monthlyTraffic` array for a line or bar visualization.
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
              <div
                key={post.id}
                className="flex flex-col gap-1 border rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{post.title}</p>
                  <Badge
                    variant={
                      post.status === "Published" ? "default" : "secondary"
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
            ))}
            {recentPosts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No recent activity.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
