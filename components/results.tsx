export function Results() {
  return (
    <div className="results">
      <h2>Test Complete!</h2>
      <p>Solid run. Keep pushing.</p>

      <div className="result-stats">
        <div>
          WPM: <strong>85</strong>
        </div>
        <div>
          Accuracy: <strong>90%</strong>
        </div>
        <div>
          Characters: <strong>120 / 5</strong>
        </div>
      </div>

      <button>Go Again</button>
    </div>
  );
}
