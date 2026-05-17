const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-[calc(100vh-148px)] w-full items-center justify-center bg-[#f5f6f7] px-5 py-10">
      {children}
    </div>
  );
};

export default Layout;
