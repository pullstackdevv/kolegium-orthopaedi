import { Construction } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function ComingSoon({ slug }) {
  const prettyTitle = slug
    ? slug
        .replace(/^[-_]+/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Coming Soon";

  return (
    <DashboardLayout title={prettyTitle}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Halaman Sedang Dalam Pengembangan
          </h1>
          <p className="max-w-md text-sm text-muted-foreground mx-auto">
            Fitur <span className="font-semibold">{prettyTitle}</span> belum tersedia.
            Tim kami sedang mengerjakan konten dan fungsionalitas untuk halaman ini.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Sementara itu, Anda tetap dapat mengakses menu lain di sidebar.
        </p>
      </div>
    </DashboardLayout>
  );
}
