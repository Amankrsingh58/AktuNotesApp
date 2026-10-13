"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { api } from "@/lib/api";
import Icon from "@/components/Icons";
import RichTextEditor from "@/components/RichTextEditor";
import CategorySelect from "@/components/CategorySelect";

type Row = { name: string; views: number; shares?: number };
type ArticleRow = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  status: "draft" | "published";
  category?: string;
  tags?: string[];
  views?: number;
  likesCount: number;
  commentsCount: number;
  engagement: number;
  createdAt: string;
  updatedAt: string;
  author?: { name?: string; email?: string };
};
type Overview = {
  metrics: Record<string, number>;
  authors: Array<{
    name: string;
    articles: number;
    views: number;
    shares: number;
  }>;
  topArticles: Array<{
    articleId: string;
    title: string;
    slug: string;
    views: number;
    shares: number;
    averageReadSeconds: number;
    completionRate: number;
    bounceRate: number;
  }>;
  unavailable: string[];
};
type Breakdowns = {
  categories: Row[];
  sources: Row[];
  devices: Row[];
  browsers: Row[];
  countries: Row[];
  tags: Row[];
  categoryTrends: Array<{ month: string; category: string; views: number }>;
};
type Realtime = {
  activeVisitors: number;
  articles: Array<{ title: string; slug: string; readers: number }>;
  updatedAt: string;
};
type Historical = {
  monthly: Array<{
    month: string;
    views: number;
    shares: number;
    activeSeconds: number;
  }>;
  lifecycle: Array<{ stage: string; views: number; articleCount: number }>;
  yearOverYear: {
    currentYear: number;
    current: number;
    previousYear: number;
    previous: number;
    growthPercent: number | null;
  };
};

const tabs = [
  ["overview", "Overview", "LayoutDashboard"],
  ["performance", "Performance", "ChartNoAxesCombined"],
  ["topics", "Categories & tags", "Tags"],
  ["audience", "Traffic & audience", "Users"],
  ["realtime", "Realtime", "Radio"],
  ["history", "Historical", "CalendarRange"],
  ["articles", "Articles", "FileText"],
] as const;

const number = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    notation: value > 9999 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
const Metric = ({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: string;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <span className="rounded-xl bg-primary/10 p-2 text-primary">
        <Icon name={icon} size={18} />
      </span>
    </div>
    <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
    <p className="mt-2 text-xs text-muted-foreground">{note}</p>
  </div>
);
const Empty = ({ text }: { text: string }) => (
  <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
    {text}
  </div>
);
const Breakdown = ({ title, rows }: { title: string; rows: Row[] }) => (
  <section className="rounded-2xl border border-border bg-card p-5">
    <h3 className="font-semibold">{title}</h3>
    {rows.length ? (
      <div className="mt-5 space-y-4">
        {rows.map((row, index) => {
          const max = rows[0]?.views || 1;
          return (
            <div key={`${row.name}-${index}`}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>{row.name || "Unknown"}</span>
                <span className="font-semibold">{number(row.views)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(3, (row.views / max) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="mt-5 text-sm text-muted-foreground">
        No data for this period.
      </p>
    )}
  </section>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState<"checking" | "ready">("checking");
  const [active, setActive] = useState("overview");
  const [range, setRange] = useState("7d");
  const [custom, setCustom] = useState({ start: "", end: "" });
  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<
    Array<{
      date: string;
      views: number;
      shares: number;
      activeSeconds: number;
      bounces: number;
    }>
  >([]);
  const [breakdowns, setBreakdowns] = useState<Breakdowns>({
    categories: [],
    sources: [],
    devices: [],
    browsers: [],
    countries: [],
    tags: [],
    categoryTrends: [],
  });
  const [realtime, setRealtime] = useState<Realtime>({
    activeVisitors: 0,
    articles: [],
    updatedAt: "",
  });
  const [historical, setHistorical] = useState<Historical>({
    monthly: [],
    lifecycle: [],
    yearOverYear: {
      currentYear: new Date().getFullYear(),
      current: 0,
      previousYear: new Date().getFullYear() - 1,
      previous: 0,
      growthPercent: null,
    },
  });
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const params = useMemo(
    () =>
      range === "custom" && custom.start && custom.end
        ? { start: custom.start, end: custom.end }
        : { range },
    [range, custom],
  );
  const chartPeriod = useMemo(() => {
    if (range === "12m")
      return { title: "Monthly readership · Last 12 months", monthly: true };
    if (range === "custom" && custom.start && custom.end) {
      const days =
        Math.ceil(
          (new Date(custom.end).getTime() - new Date(custom.start).getTime()) /
            86400000,
        ) + 1;
      return {
        title: `${days > 90 ? "Monthly" : "Daily"} readership · ${new Date(custom.start).toLocaleDateString()} – ${new Date(custom.end).toLocaleDateString()}`,
        monthly: days > 90,
      };
    }
    const labels: Record<string, string> = {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
    };
    return {
      title: `Daily readership · ${labels[range] || "Selected period"}`,
      monthly: false,
    };
  }, [range, custom.start, custom.end]);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => {
        if (r.data?.role !== "super_admin") router.replace("/admin/login");
        else setAuth("ready");
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);
  const load = useCallback(async () => {
    if (
      auth !== "ready" ||
      (range === "custom" && (!custom.start || !custom.end))
    )
      return;
    setLoading(true);
    setError("");
    try {
      const [a, b, c, d] = await Promise.all([
        api.get("/cognora-analytics/overview", { params }),
        api.get("/cognora-analytics/timeseries", { params }),
        api.get("/cognora-analytics/breakdowns", { params }),
        api.get("/cognora-analytics/historical", { params }),
      ]);
      setOverview(a.data);
      setSeries(b.data);
      setBreakdowns(c.data);
      setHistorical(d.data);
    } catch (cause: unknown) {
      const status =
        cause && typeof cause === "object" && "response" in cause
          ? (cause as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 401 || status === 403) router.replace("/admin/login");
      else
        setError(
          "Analytics could not be loaded. Check the backend connection and try again.",
        );
    } finally {
      setLoading(false);
    }
  }, [auth, params, range, custom.start, custom.end, router]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (auth !== "ready") return;
    const refresh = () =>
      api
        .get("/cognora-analytics/realtime")
        .then((r) => setRealtime(r.data))
        .catch(() => undefined);
    refresh();
    const id = setInterval(refresh, 15_000);
    return () => clearInterval(id);
  }, [auth]);
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      router.replace("/admin/login");
    }
  };
  if (auth === "checking")
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  const m = overview?.metrics || {};

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="ShieldCheck" size={19} />
            </div>
            <div>
              <p className="font-bold">Cognora Admin</p>
              <p className="text-xs text-muted-foreground">
                Analytics & article operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              View site
            </Link>
            <button
              onClick={logout}
              className="rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-border bg-card p-3 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-5">
          <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
            {tabs.map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium lg:w-full ${active === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon name={icon} size={17} />
                {label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                FIRST-PARTY ANALYTICS
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {tabs.find((t) => t[0] === active)?.[1]}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Consented visitors only · raw events retained for 90 days
              </p>
            </div>
            {active !== "articles" && (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="h-10 rounded-xl border border-border bg-card px-3 text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="12m">Last 12 months</option>
                  <option value="custom">Custom</option>
                </select>
                {range === "custom" && (
                  <>
                    <input
                      type="date"
                      value={custom.start}
                      onChange={(e) =>
                        setCustom((v) => ({ ...v, start: e.target.value }))
                      }
                      className="h-10 rounded-xl border border-border bg-card px-3 text-sm"
                    />
                    <input
                      type="date"
                      value={custom.end}
                      onChange={(e) =>
                        setCustom((v) => ({ ...v, end: e.target.value }))
                      }
                      className="h-10 rounded-xl border border-border bg-card px-3 text-sm"
                    />
                  </>
                )}
              </div>
            )}
          </div>
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <span>{error}</span>
              <button
                onClick={() => void load()}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}
          {loading && active !== "realtime" && active !== "articles" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((x) => (
                <div
                  key={x}
                  className="h-36 animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          ) : (
            <>
              {active === "overview" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <Metric
                      label="All-time recorded views"
                      value={number(m.allTimeViews)}
                      note="Includes totals collected before analytics launched"
                      icon="History"
                    />
                    <Metric
                      label="Views in selected period"
                      value={number(m.views)}
                      note="Deduplicated consented article sessions"
                      icon="Eye"
                    />
                    <Metric
                      label="Average read time"
                      value={`${number(m.averageReadSeconds)}s`}
                      note="Active visible reading time"
                      icon="Clock3"
                    />
                    <Metric
                      label="Bounce rate"
                      value={`${number(m.bounceRate)}%`}
                      note="One page and under 10 seconds"
                      icon="LogOut"
                    />
                    <Metric
                      label="Completion rate"
                      value={`${number(m.completionRate)}%`}
                      note="Readers reaching 100% depth"
                      icon="CircleCheck"
                    />
                  </div>
                  <Chart
                    title={chartPeriod.title}
                    data={series}
                    dataKey="views"
                    monthly={chartPeriod.monthly}
                  />
                  <div className="grid gap-4 lg:grid-cols-3">
                    <Metric
                      label="Likes"
                      value={number(m.likes)}
                      note="Current published articles"
                      icon="Heart"
                    />
                    <Metric
                      label="Comments"
                      value={number(m.comments)}
                      note="Current published articles"
                      icon="MessageCircle"
                    />
                    <Metric
                      label="Recorded shares"
                      value={number(m.shares)}
                      note="Successful copy/share actions"
                      icon="Share2"
                    />
                  </div>
                </div>
              )}
              {active === "performance" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Metric
                      label="Articles viewed"
                      value={number(m.activeArticles)}
                      note="Received views in selected period"
                      icon="Files"
                    />
                    <Metric
                      label="Recommendation CTR"
                      value={`${number(m.recommendationCtr)}%`}
                      note="Internal recommendation clicks in selected period"
                      icon="MousePointerClick"
                    />
                    <Metric
                      label="Shares"
                      value={number(m.shares)}
                      note="Within selected period"
                      icon="Share2"
                    />
                  </div>
                  <Chart
                    title={`Views · ${chartPeriod.title.replace(/^(Daily|Monthly) readership · /, "")}`}
                    data={series}
                    dataKey="views"
                    monthly={chartPeriod.monthly}
                  />
                  <TopArticles rows={overview?.topArticles || []} />
                  <section className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="font-semibold">Top contributors</h3>
                    {overview?.authors?.length ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-muted-foreground">
                            <tr>
                              <th className="py-3">Author</th>
                              <th>Articles viewed</th>
                              <th>Views</th>
                              <th>Shares</th>
                            </tr>
                          </thead>
                          <tbody>
                            {overview.authors.map((a) => (
                              <tr
                                key={a.name}
                                className="border-t border-border"
                              >
                                <td className="py-3 font-medium">{a.name}</td>
                                <td>{a.articles}</td>
                                <td>{number(a.views)}</td>
                                <td>{number(a.shares)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">
                        No author data available for the selected period.
                      </p>
                    )}
                  </section>
                </div>
              )}
              {active === "topics" && (
                <div className="grid gap-5 lg:grid-cols-2">
                  <Breakdown
                    title="Most-read categories"
                    rows={breakdowns.categories}
                  />
                  <Breakdown title="Trending tags" rows={breakdowns.tags} />
                  <div className="lg:col-span-2">
                    <CategoryTrend rows={breakdowns.categoryTrends} />
                  </div>
                </div>
              )}
              {active === "audience" && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <Breakdown
                      title="Traffic sources"
                      rows={breakdowns.sources}
                    />
                    <Breakdown title="Devices" rows={breakdowns.devices} />
                    <Breakdown title="Browsers" rows={breakdowns.browsers} />
                    <Breakdown
                      title="Coarse country"
                      rows={breakdowns.countries}
                    />
                  </div>
                  <Unavailable
                    items={[
                      "Age and gender are not collected or inferred.",
                      "Ratings are unavailable because Cognora has no rating feature.",
                      "Subscription conversion is unavailable because Cognora has no subscription feature.",
                    ]}
                  />
                </div>
              )}
              {active === "realtime" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Metric
                      label="Active visitors"
                      value={number(realtime.activeVisitors)}
                      note="Heartbeat within the last 60 seconds"
                      icon="Radio"
                    />
                    <Metric
                      label="Active articles"
                      value={number(realtime.articles.length)}
                      note="Currently being read"
                      icon="BookOpen"
                    />
                    <Metric
                      label="Last refreshed"
                      value={
                        realtime.updatedAt
                          ? new Date(realtime.updatedAt).toLocaleTimeString()
                          : "—"
                      }
                      note="Automatically refreshes every 15 seconds"
                      icon="RefreshCw"
                    />
                  </div>
                  <section className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="font-semibold">Articles being read now</h3>
                    {realtime.articles.length ? (
                      <div className="mt-4 divide-y divide-border">
                        {realtime.articles.map((a) => (
                          <div
                            key={a.slug}
                            className="flex items-center justify-between py-4"
                          >
                            <Link
                              href={`/articles/${a.slug}`}
                              target="_blank"
                              className="font-medium hover:text-primary"
                            >
                              {a.title}
                            </Link>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                              {a.readers} live
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 text-sm text-muted-foreground">
                        No consenting visitors are active right now.
                      </p>
                    )}
                  </section>
                </div>
              )}
              {active === "history" && (
                <HistoryPanel data={historical} series={series} />
              )}
              {active === "articles" && <ArticleManager />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Chart({
  title,
  data,
  dataKey,
  monthly = false,
}: {
  title: string;
  data: Array<{
    date: string;
    views: number;
    shares: number;
    activeSeconds: number;
    bounces: number;
  }>;
  dataKey: string;
  monthly?: boolean;
}) {
  if (!data.length)
    return (
      <Empty text={`No ${title.toLowerCase()} data exists for this period.`} />
    );
  const formatDate = (value: unknown) =>
    new Date(String(value)).toLocaleDateString(
      undefined,
      monthly
        ? { month: "short", year: "numeric" }
        : { month: "short", day: "numeric" },
    );
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-5 font-semibold">{title}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(var(--color-border))"
            />
            <XAxis dataKey="date" tickFormatter={formatDate} fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip labelFormatter={formatDate} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="rgb(var(--color-primary))"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Unavailable({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">Privacy and unavailable metrics</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-muted/50 p-4 text-sm leading-6 text-muted-foreground"
          >
            <Icon name="Shield" size={18} className="mb-2 text-primary" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function TopArticles({ rows }: { rows: Overview["topArticles"] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">Article performance</h3>
      {rows.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Article</th>
                <th>Views</th>
                <th>Avg. read</th>
                <th>Completion</th>
                <th>Bounce</th>
                <th>Shares</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.articleId} className="border-t border-border">
                  <td className="max-w-sm py-3 pr-4">
                    <Link
                      href={`/articles/${row.slug}`}
                      target="_blank"
                      className="font-medium hover:text-primary"
                    >
                      {row.title}
                    </Link>
                  </td>
                  <td>{number(row.views)}</td>
                  <td>{number(row.averageReadSeconds)}s</td>
                  <td>{number(row.completionRate)}%</td>
                  <td>{number(Math.max(0, row.bounceRate))}%</td>
                  <td>{number(row.shares)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          No article analytics exist for this period.
        </p>
      )}
    </section>
  );
}

function CategoryTrend({ rows }: { rows: Breakdowns["categoryTrends"] }) {
  if (!rows.length)
    return <Empty text="No category trend data exists for this period." />;
  const categories = Array.from(new Set(rows.map((row) => row.category))).slice(
    0,
    6,
  );
  const months = Array.from(new Set(rows.map((row) => row.month))).map(
    (month) => ({
      month,
      ...Object.fromEntries(
        categories.map((category) => [
          category,
          rows.find((row) => row.month === month && row.category === category)
            ?.views || 0,
        ]),
      ),
    }),
  );
  const colors = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#d97706",
    "#dc2626",
    "#0891b2",
  ];
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-5 font-semibold">Monthly category popularity</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(var(--color-border))"
            />
            <XAxis dataKey="month" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip />
            <Legend />
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="views"
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function HistoryPanel({
  data,
  series,
}: {
  data: Historical;
  series: Array<{
    date: string;
    views: number;
    shares: number;
    activeSeconds: number;
    bounces: number;
  }>;
}) {
  const yoy = data.yearOverYear;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label={`${yoy.currentYear} views`}
          value={number(yoy.current)}
          note="Selected history available this year"
          icon="TrendingUp"
        />
        <Metric
          label={`${yoy.previousYear} views`}
          value={number(yoy.previous)}
          note="Comparable collected history"
          icon="History"
        />
        <Metric
          label="Year-over-year"
          value={
            yoy.growthPercent === null
              ? "Insufficient history"
              : `${yoy.growthPercent >= 0 ? "+" : ""}${number(yoy.growthPercent)}%`
          }
          note="Shown only when a prior-year baseline exists"
          icon="ChartNoAxesCombined"
        />
      </div>
      <Chart title="Historical readership" data={series} dataKey="views" />
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Content lifecycle</h3>
        {data.lifecycle.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.lifecycle.map((row) => (
              <div key={row.stage} className="rounded-xl bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{row.stage}</p>
                <p className="mt-2 text-2xl font-bold">{number(row.views)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  views across {row.articleCount} articles
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Lifecycle analysis will appear after articles receive consented
            views.
          </p>
        )}
      </section>
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-800 dark:text-amber-200">
        <strong>History begins at deployment.</strong> Existing article totals
        are preserved, but they are not assigned to invented historical dates.
      </div>
    </div>
  );
}

function ArticleManager() {
  const [items, setItems] = useState<ArticleRow[]>([]),
    [page, setPage] = useState(1),
    [pages, setPages] = useState(1),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true),
    [editing, setEditing] = useState<ArticleRow | null>(null),
    [saving, setSaving] = useState(false),
    [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/cognora-analytics/articles", {
        params: { page, search, status },
      });
      setItems(r.data.items);
      setPages(r.data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);
  useEffect(() => {
    const id = setTimeout(() => void load(), 250);
    return () => clearTimeout(id);
  }, [load]);
  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage("");
    try {
      await api.patch(`/cognora-analytics/articles/${editing._id}`, {
        title: editing.title,
        summary: editing.summary,
        content: editing.content,
        coverImage: editing.coverImage,
        category: editing.category,
        tags: editing.tags,
        status: editing.status,
      });
      setEditing(null);
      setMessage("Article updated successfully.");
      void load();
    } catch {
      setMessage("Article could not be updated.");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (article: ArticleRow) => {
    if (
      !confirm(`Permanently delete “${article.title}”? This cannot be undone.`)
    )
      return;
    try {
      await api.delete(`/cognora-analytics/articles/${article._id}`);
      setMessage("Article deleted.");
      void load();
    } catch {
      setMessage("Article could not be deleted.");
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Icon
            name="Search"
            size={17}
            className="absolute left-3 top-3 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search title or slug"
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl border border-border bg-card px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      {message && (
        <p className="rounded-xl border border-border bg-card p-3 text-sm">
          {message}
        </p>
      )}
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th>Author</th>
                <th>Category</th>
                <th>Engagement</th>
                <th>Views</th>
                <th>Status</th>
                <th className="pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a._id} className="border-t border-border">
                  <td className="max-w-sm px-4 py-4">
                    <p className="truncate font-semibold">{a.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {new Date(a.updatedAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td>{a.author?.name || "Deleted author"}</td>
                  <td>{a.category || "Uncategorized"}</td>
                  <td>{number(a.engagement)}</td>
                  <td>{number(a.views)}</td>
                  <td>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status === "published" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="pr-4 text-right">
                    <Link
                      href={`/articles/${a.slug}`}
                      target="_blank"
                      className="mr-1 inline-block rounded-lg p-2 hover:bg-muted"
                      title="View"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </Link>
                    <button
                      onClick={() => setEditing(a)}
                      className="mr-1 rounded-lg p-2 hover:bg-muted"
                      title="Edit"
                    >
                      <Icon name="Pencil" size={16} />
                    </button>
                    <button
                      onClick={() => void remove(a)}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <div className="p-12 text-center text-muted-foreground">
              No articles match these filters.
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <span className="px-3 py-2 text-sm">
          Page {page} of {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 z-[1400] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-4xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-7">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold">Edit article</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Changes are recorded in the admin activity log.
                </p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-2 hover:bg-muted"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              <label>
                <span className="mb-1 block text-sm font-semibold">Title</span>
                <input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-3"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold">
                  Summary
                </span>
                <textarea
                  value={editing.summary}
                  onChange={(e) =>
                    setEditing({ ...editing, summary: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background p-3"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="mb-1 block text-sm font-semibold">
                    Category
                  </span>
                  <CategorySelect
                    value={
                      editing.category === "Uncategorized"
                        ? ""
                        : editing.category || ""
                    }
                    onChange={(category) =>
                      setEditing({ ...editing, category })
                    }
                  />
                </div>
                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Tags (comma separated)
                  </span>
                  <input
                    value={(editing.tags || []).join(", ")}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        tags: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  />
                </label>
              </div>
              <label>
                <span className="mb-1 block text-sm font-semibold">Status</span>
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="h-11 rounded-xl border border-border bg-background px-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <div>
                <span className="mb-2 block text-sm font-semibold">
                  Content
                </span>
                <div className="rounded-xl border border-border p-4">
                  <RichTextEditor
                    value={editing.content}
                    onChange={(content) => setEditing({ ...editing, content })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={() => void save()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
