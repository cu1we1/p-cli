/**
 * 秒转'hh:mm:ss'
 * @param s 秒数
 * @returns 转换之后的结果
 */
function s2hms(s: number): string {
  function x2xx(x: number) {
    if (x < 10) {
      return `0${x}`;
    }

    return x;
  }

  if (!s || s <= 0) {
    return "";
  }

  const hh = x2xx(Math.floor(s / 3600));
  const mm = x2xx(Math.floor((s % 3600) / 60));
  const ss = x2xx(Math.floor((s % 3600) % 60));

  return `${hh}:${mm}:${ss}`.replace(/^00:/, "");
}

export default s2hms;
