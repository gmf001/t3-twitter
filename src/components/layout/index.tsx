import SignedOutBanner from "./signed-out-banner";

interface LayoutProps {
  children: React.ReactNode;
  classNames?: string;
}

function Layout({ children, classNames }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <main className={`container my-5 max-w-2xl`.concat(classNames || "")}>
        {children}
      </main>
      <SignedOutBanner />
    </div>
  );
}

export default Layout;
