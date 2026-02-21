export default function OuterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-[1200px] mx-auto mt-5 border border-border-default border-b-0 md:border md:border-b-0 max-md:border-none max-md:mt-0">
      {children}
    </div>
  );
}
