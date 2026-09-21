function ProgressBar({ percent = 0, height = 8, showLabel = false }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="lg-progress" style={{ height }}>
      <div className="lg-progress-fill" style={{ width: `${clamped}%` }} />
      {showLabel && <span className="lg-progress-label">{clamped}%</span>}
    </div>
  );
}
export default ProgressBar;
