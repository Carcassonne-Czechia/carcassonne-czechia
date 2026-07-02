import { useContext } from "react";
import { LangContext } from "~/i18n/lang-context";

// 2026-08-25 00:00:00 UTC = Unix timestamp 1787616000
const drawScript = `// === 2026 Online Championship Draw ===
//
// Seed: block hash of the first Bitcoin block with timestamp
//       >= 2026-08-25 00:00:00 UTC (Unix time 1787616000).
//
// How to run: open any browser console (F12 → Console tab) and paste this
// entire script. Replace the PLAYERS array with the final registered players
// before running.
//
// Public API used: mempool.space (no key required, CORS-enabled).

const TARGET_TIMESTAMP = 1787616000; // 2026-08-25 00:00:00 UTC

// Fill in player names after registration closes on August 24.
const PLAYERS = [
  // "PlayerName1",
  // "PlayerName2",
];

// --- Mulberry32 PRNG ---
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Fisher-Yates shuffle using the given PRNG ---
function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Assign shuffled players to groups (earlier groups larger if uneven) ---
function assignGroups(players, numGroups) {
  const groups = Array.from({ length: numGroups }, () => []);
  players.forEach((p, i) => groups[i % numGroups].push(p));
  return groups;
}

// --- Main ---
async function runDraw() {
  console.log("=== 2026 Online Championship Draw ===\\n");

  // 1. Fetch the block closest to the target timestamp
  console.log(
    \`Fetching BTC block near \${TARGET_TIMESTAMP} (\${new Date(TARGET_TIMESTAMP * 1000).toUTCString()})...\`
  );
  const tsRes = await fetch(
    \`https://mempool.space/api/v1/mining/blocks/timestamp/\${TARGET_TIMESTAMP}\`
  );
  if (!tsRes.ok) throw new Error(\`API error: \${tsRes.status}\`);
  const tsData = await tsRes.json();

  let height = tsData.height;
  let hash = tsData.hash;
  let blockTs = Math.floor(new Date(tsData.timestamp).getTime() / 1000);

  // The API returns the closest block; if it is before the target, advance one.
  if (blockTs < TARGET_TIMESTAMP) {
    console.log(
      \`Block \${height} timestamp \${blockTs} < target; fetching block \${height + 1}...\`
    );
    height += 1;
    const hRes = await fetch(\`https://mempool.space/api/block-height/\${height}\`);
    if (!hRes.ok) throw new Error(\`API error: \${hRes.status}\`);
    hash = (await hRes.text()).trim();
    const bRes = await fetch(\`https://mempool.space/api/block/\${hash}\`);
    if (!bRes.ok) throw new Error(\`API error: \${bRes.status}\`);
    const bData = await bRes.json();
    blockTs = bData.timestamp;
  }

  console.log("\\nSeed block:");
  console.log(\`  Height   : \${height}\`);
  console.log(\`  Hash     : \${hash}\`);
  console.log(\`  Timestamp: \${new Date(blockTs * 1000).toUTCString()} (\${blockTs})\`);
  console.log(\`  Verify   : https://mempool.space/block/\${hash}\\n\`);

  // 2. Derive PRNG seed from the first 4 bytes (8 hex chars) of the block hash
  const seed = parseInt(hash.slice(0, 8), 16);
  console.log(
    \`PRNG seed: first 4 bytes of hash = 0x\${hash.slice(0, 8)} = \${seed}\\n\`
  );

  // 3. Shuffle players
  const rng = mulberry32(seed);
  const shuffled = shuffle(PLAYERS, rng);
  console.log("Shuffled order:", shuffled);

  // 4. Assign to groups
  const n = PLAYERS.length;
  const numGroups = n <= 8 ? 1 : n <= 12 ? 2 : n <= 18 ? 3 : 4;
  console.log(\`\\n\${n} player(s) → \${numGroups} group(s):\`);

  const groups = assignGroups(shuffled, numGroups);
  const labels = ["A", "B", "C", "D"];
  groups.forEach((g, i) => {
    console.log(\`\\nGroup \${labels[i]}:\`);
    g.forEach((p, j) => console.log(\`  \${j + 1}. \${p}\`));
  });
}

runDraw().catch(console.error);`;

const preStyle: React.CSSProperties = {
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    padding: "1rem",
    overflowX: "auto",
    borderRadius: "4px",
    fontSize: "0.85rem",
    lineHeight: "1.5",
    whiteSpace: "pre",
};

export default function DrawPage() {
    const { lang } = useContext(LangContext);

    return lang === "en" ? (
        <main style={{ padding: "0 0.5rem" }}>
            <h1>Draw Methodology</h1>
            <p>
                The 2026 tournament draw is seeded by the block hash of the{" "}
                <b>
                    first Bitcoin block with a timestamp ≥ 2026-08-25 00:00:00
                    UTC
                </b>
                . Because Bitcoin block hashes are determined by global mining
                activity, this seed cannot be predicted or manipulated by the
                organiser. Anyone can independently verify the draw result by
                running the script below.
            </p>
            <p>
                The script uses{" "}
                <a
                    href="https://mempool.space/docs/api/rest"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    mempool.space's public REST API
                </a>{" "}
                (no API key required). It fetches the target block, seeds the{" "}
                <a
                    href="https://github.com/nicowillis/mulberry32"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    mulberry32
                </a>{" "}
                PRNG from the first 4 bytes of the block hash, and performs a
                Fisher-Yates shuffle on the registered players. Groups are
                assigned in round-robin order from the shuffled list (earlier
                groups are larger if the count is uneven).
            </p>
            <p>
                <b>How to run:</b> Open your browser's developer console (F12 →
                Console), paste the script below, and press Enter. Replace the{" "}
                <code>PLAYERS</code> array with the final list of registered
                players before running (available after August 24).
            </p>
            <pre style={preStyle}>
                <code>{drawScript}</code>
            </pre>
        </main>
    ) : (
        <main style={{ padding: "0 0.5rem" }}>
            <h1>Metodika losování</h1>
            <p>
                Losování turnaje 2026 je určeno hashem bloku{" "}
                <b>
                    prvního Bitcoinového bloku s časovým razítkem ≥ 2026-08-25
                    00:00:00 UTC
                </b>
                . Protože hashe bitcoinových bloků jsou výsledkem celosvětové
                těžební aktivity, tento seed nemůže být předpovězen ani
                zmanipulován organizátorem. Kdokoli si může výsledek losování
                nezávisle ověřit spuštěním níže uvedeného skriptu.
            </p>
            <p>
                Skript používá{" "}
                <a
                    href="https://mempool.space/docs/api/rest"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    veřejné REST API mempool.space
                </a>{" "}
                (bez API klíče). Načte cílový blok, inicializuje generátor
                pseudonáhodných čísel{" "}
                <a
                    href="https://github.com/nicowillis/mulberry32"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    mulberry32
                </a>{" "}
                pomocí prvních 4 bajtů hashe bloku a provede Fisher-Yatesovo
                zamíchání registrovaných hráčů. Skupiny jsou přiděleny metodou
                round-robin ze zamíchaného pořadí (dřívější skupiny jsou větší,
                pokud počet není dělitelný rovnoměrně).
            </p>
            <p>
                <b>Jak spustit:</b> Otevřete konzoli vývojáře (F12 → Console),
                vložte níže uvedený skript a stiskněte Enter. Před spuštěním
                doplňte pole <code>PLAYERS</code> se seznamem přihlášených hráčů
                (dostupné po 24. srpnu).
            </p>
            <pre style={preStyle}>
                <code>{drawScript}</code>
            </pre>
        </main>
    );
}
