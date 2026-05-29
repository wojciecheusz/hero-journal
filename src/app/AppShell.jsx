
export default function AppShell({
  header,
  navigation,
  children
}) {
  return (
    <div className="hj-root">
      {header}

      <main style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "1rem"
      }}>
        {children}
      </main>

      {navigation}
    </div>
  );
}
