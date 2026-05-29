
export default function InventoryList({
  items = []
}) {
  return (
    <div className="inventory-list">
      {items.map((item) => (
        <div className="card" key={item.id}>
          <strong>{item.name}</strong>

          <div>
            {item.type}
          </div>
        </div>
      ))}
    </div>
  );
}
