 const getTime = (time) => {
    if(!time) return "";
  const date = new Date(time);
  const now = new Date();
  const diffSec = Math.trunc((now - date) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  const mins = Math.trunc(diffSec / 60);
  const hrs = Math.trunc(mins / 60);
  const days = Math.trunc(hrs / 24);
    const weeks = Math.trunc(days / 7);
    const months = Math.trunc(days / 30.4375);
    const years = Math.trunc(months / 12);

  if (Math.abs(years) > 0) return `${years}y ago`;
  if (Math.abs(months) > 0) return `${months}m ago`;
  if (Math.abs(weeks) > 0) return `${weeks}w ago`;
  if (Math.abs(days) > 0) return `${days}d ago`;
  if (Math.abs(hrs) > 0) return `${hrs}h ago`;
  if (Math.abs(mins) > 0) return `${mins}m ago`;
  return `Just now`;
};
export default getTime;