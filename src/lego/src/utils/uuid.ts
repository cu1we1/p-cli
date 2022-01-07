function uuid(): string {
  const s: string[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  // bits 12-15 of the time_hi_and_version field to 0010
  s[14] = "4";
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  /* eslint-disable no-bitwise */
  s[19] = hexDigits.substr(((<number>(<unknown>s[19])) & 0x3) | 0x8, 1);
  /* eslint-disable no-multi-assign */
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
}

export default uuid;