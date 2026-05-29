
export default function QuestList({
  quests = []
}) {
  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <div
          className={`card quest ${quest.status}`}
          key={quest.id}
        >
          <h3>{quest.title}</h3>

          <p>{quest.description}</p>
        </div>
      ))}
    </div>
  );
}
