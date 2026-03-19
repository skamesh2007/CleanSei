import BottomNav from "@/components/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-[76px]">{children}</main>
      <BottomNav />
    </>
  );
}