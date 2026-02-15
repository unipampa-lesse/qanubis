import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        teste
      </div>

      <div className="col-span-12 xl:col-span-5">
        teste
      </div>

      <div className="col-span-12">
        teste
      </div>

      <div className="col-span-12 xl:col-span-5">
        teste
      </div>

      <div className="col-span-12 xl:col-span-7">
        teste
      </div>
    </div>
  );
}
