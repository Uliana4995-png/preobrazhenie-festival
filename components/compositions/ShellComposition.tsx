export default function ShellComposition({ items }: { items: { title: string; description?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
      {items.map((item) => (
        <div key={item.title} className="pearl-card tight text-center">
          <p className="text-sm font-semibold text-pearl">{item.title}</p>
          {item.description && <p className="text-xs text-pearl/60 mt-1">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}
