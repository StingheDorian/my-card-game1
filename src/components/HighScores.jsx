// src/components/Lobby.jsx
const Lobby = ({ onBack }) => (
  <div className="text-center p-10">
    <h2 className="text-2xl mb-4">🕹️ Lobby Coming Soon!</h2>
    <button className="bg-red-500 px-4 py-2 rounded" onClick={onBack}>Back</button>
  </div>
);
export default Lobby;
