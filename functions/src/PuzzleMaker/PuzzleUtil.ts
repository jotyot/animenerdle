function ThreePlusMatch(props: (string | undefined)[]): boolean {
  return props.some(
    (prop, _, propLine) =>
      prop && propLine.filter((x) => x === prop).length >= 3
  );
}

function RelatedName(name: string, others: string[]) {
  return others.some((other) => {
    const sim = Similarity(name, other);
    return sim.flat > 7 || sim.ratio > 0.5;
  });
}

function Similarity(a: string, b: string) {
  a = a
    .toLowerCase()
    .replace("season", "")
    .replace("part", "")
    .replace(/" "/g, "");
  b = b
    .toLowerCase()
    .replace("season", "")
    .replace("part", "")
    .replace(/" "/g, "");
  // idk if this works but it should be less lenient the front string
  const len = LCSLength(")" + a, ")" + b);
  return { flat: len, ratio: len / a.length };
}

function LCSLength(a: string, b: string) {
  const n = a.length;
  const m = b.length;

  // Create DP table
  var dp = Array(2)
    .fill(0)
    .map(() => Array(m + 1).fill(0));
  var res = 0;

  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= m; j++) {
      if (a.charAt(i - 1) == b.charAt(j - 1)) {
        dp[i % 2][j] = dp[(i - 1) % 2][j - 1] + 1;
        if (dp[i % 2][j] > res) res = dp[i % 2][j];
      } else dp[i % 2][j] = 0;
    }
  }
  return res;
}

export { ThreePlusMatch, RelatedName, Similarity, LCSLength };
