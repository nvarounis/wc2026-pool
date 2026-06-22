document.addEventListener("DOMContentLoaded", () => {
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1iFv4TIjSckPSECiJWeS3BF59LWaefQam-qr7j4LoswG0_9g2WzlePEVrBamMQqmN3_Hpoa1g-SQX/pub?gid=1488246594&single=true&output=csv";

  const TOTAL_MATCHES = 72;

  // Μπορείς να αλλάξεις μόνο αυτά, αν θέλεις αργότερα.
  const STATIC_CARDS = {
    championName: "Spain",
    championPicks: "14 Picks",
    topScorerName: "Mbappé",
    topScorerPicks: "16 Picks",
    surpriseMatch: "Iraq 1-0 France",
  };

  const elements = {
    leaderName: document.getElementById("leader-name"),
    leaderPoints: document.getElementById("leader-points"),
    championName: document.getElementById("champion-name"),
    championPicks: document.getElementById("champion-picks"),
    topScorerName: document.getElementById("top-scorer-name"),
    topScorerPicks: document.getElementById("top-scorer-picks"),
    progressCompleted: document.getElementById("progress-completed"),
    progressPercent: document.getElementById("progress-percent"),
    latestResult: document.getElementById("latest-result"),
    surpriseMatch: document.getElementById("surprise-match"),
    leaderboardBody: document.getElementById("leaderboard-body"),
  };

  for (const [key, el] of Object.entries(elements)) {
    if (!el) {
      console.error(`Missing element: ${key}`);
      return;
    }
  }

  function normalize(value) {
    return (value ?? "").toString().replace(/\r/g, "").trim();
  }

  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  function parseCSV(text) {
    return text
      .replace(/\r/g, "")
      .split("\n")
      .map(parseCSVLine)
      .filter((row) => row.some((cell) => normalize(cell) !== ""));
  }

  function lastIndexOfExact(headers, label) {
    for (let i = headers.length - 1; i >= 0; i--) {
      if (normalize(headers[i]) === label) return i;
    }
    return -1;
  }

  function isDateCell(value) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(normalize(value));
  }

  function isResultCell(value) {
    const v = normalize(value).toUpperCase();
    return v === "1" || v === "X" || v === "2";
  }

  fetch(csvUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((csv) => {
      const rows = parseCSV(csv);

      if (!rows.length) {
        throw new Error("CSV is empty");
      }

      const headers = rows[0];

      const rankIdx = lastIndexOfExact(headers, "ΘΕΣΗ");
      const playerIdx = lastIndexOfExact(headers, "ΒΑΘΜΟΛΟΓΙΑ");
      const ptsIdx = lastIndexOfExact(headers, "ΒΑΘΜΟΙ");

      if (rankIdx < 0 || playerIdx < 0 || ptsIdx < 0) {
        throw new Error("Could not find leaderboard columns in CSV");
      }

      elements.leaderboardBody.innerHTML = "";

      let firstValidPlayer = true;
      let completedMatches = 0;
      let latestResultText = "";

      // Populate live leaderboard
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];

        const rank = normalize(cols[rankIdx]);
        const player = normalize(cols[playerIdx]);
        const pts = normalize(cols[ptsIdx]);

        if (!rank || !player || !pts) {
          continue;
        }

        if (!/^\d+$/.test(rank)) {
          continue;
        }

        if (firstValidPlayer) {
          elements.leaderName.textContent = player;
          elements.leaderPoints.textContent = `${pts} pts`;
          firstValidPlayer = false;
        }

        elements.leaderboardBody.insertAdjacentHTML(
          "beforeend",
          `<tr>
            <td>${rank}</td>
            <td>${player}</td>
            <td align="right">${pts}</td>
          </tr>`
        );
      }

      // Progress + latest result derived from match rows in the same sheet
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        const date = normalize(cols[0]);
        const match = normalize(cols[3]);
        const result = normalize(cols[4]).toUpperCase();

        if (isDateCell(date) && match && isResultCell(result)) {
          completedMatches++;
          latestResultText = `${match} (${result})`;
        }
      }

      const progressPercent = Math.round((completedMatches / TOTAL_MATCHES) * 100);

      elements.progressCompleted.textContent = `${completedMatches} / ${TOTAL_MATCHES}`;
      elements.progressPercent.textContent = `${progressPercent}%`;

      elements.latestResult.textContent = latestResultText || "None";
      elements.surpriseMatch.textContent = STATIC_CARDS.surpriseMatch;

      // Static fallback cards, ready to edit in one place
      elements.championName.textContent = STATIC_CARDS.championName;
      elements.championPicks.textContent = STATIC_CARDS.championPicks;
      elements.topScorerName.textContent = STATIC_CARDS.topScorerName;
      elements.topScorerPicks.textContent = STATIC_CARDS.topScorerPicks;

      console.log("Dashboard updated successfully");
      console.log("Rows:", rows.length);
      console.log("Leaderboard columns:", { rankIdx, playerIdx, ptsIdx });
      console.log("Completed matches:", completedMatches);
    })
    .catch((error) => {
      console.error("Failed to load CSV:", error);

      elements.leaderName.textContent = "N/A";
      elements.leaderPoints.textContent = "-";
      elements.progressCompleted.textContent = `0 / ${TOTAL_MATCHES}`;
      elements.progressPercent.textContent = "0%";
      elements.latestResult.textContent = "None";
      elements.surpriseMatch.textContent = STATIC_CARDS.surpriseMatch;
      elements.championName.textContent = STATIC_CARDS.championName;
      elements.championPicks.textContent = STATIC_CARDS.championPicks;
      elements.topScorerName.textContent = STATIC_CARDS.topScorerName;
      elements.topScorerPicks.textContent = STATIC_CARDS.topScorerPicks;
    });
});
