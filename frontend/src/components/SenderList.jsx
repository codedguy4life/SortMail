import SenderCard from "./SenderCard";

const SenderList = ({ senders, selectedSenderId, selectedIds, onSelect, onCheck }) => {
  if (!senders.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">⌁</span>
        <h3>No senders here yet</h3>
        <p>Connect and sync your inbox to see who is filling it.</p>
      </div>
    );
  }

  return (
    <div className="sender-list">
      {senders.map((sender) => (
        <SenderCard
          key={sender._id}
          sender={sender}
          selected={selectedSenderId === sender._id}
          checked={selectedIds.includes(sender._id)}
          onSelect={onSelect}
          onCheck={onCheck}
        />
      ))}
    </div>
  );
};

export default SenderList;
