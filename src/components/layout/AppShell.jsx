
export default function AppShell({
  header,
  navigation,
  children
}) {
  return (
    <div className="app-shell">
      {header}

      <main className="app-content">
        {children}
      </main>

      {navigation}
    </div>
  );
}
