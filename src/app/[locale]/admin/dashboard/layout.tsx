import ProtectedRoute from "@/components/ProtectedRoute";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Readonly<Props>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
