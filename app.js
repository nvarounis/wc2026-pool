const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR1iFv4TIjSckPSECiJWeS3BF59LWaefQam-qr7j4LoswG0_9g2WzlePEVrBamMQqmN3_Hpoa1g-SQX/pub?gid=1488246594&single=true&output=csv";

fetch(csvUrl)
.then(response => response.text())
.then(csv => {

    const rows = csv.split("\n");

    const tbody = document.getElementById("leaderboard-body");
    const leaderName = document.getElementById("leader-name");
    const leaderPoints = document.getElementById("leader-points");

    console.log("leaderName:", leaderName);
    console.log("leaderPoints:", leaderPoints);

    tbody.innerHTML = "";

    let firstPlayer = true;

    for (let i = 1; i < rows.length; i++) {

        const cols = rows[i].split(",");

        if (cols.length < 20) continue;

        const rank = cols[17]?.trim();
        const player = cols[18]?.trim();
        const pts = cols[19]?.trim().replace("\r","");

        if (!rank || !player || !pts) continue;

        if (firstPlayer) {
            console.log("FIRST PLAYER:", player, pts);

            leaderName.textContent = player;
            leaderPoints.textContent = pts + " pts";

            firstPlayer = false;
        }

        tbody.innerHTML += `
            <tr>
                <td>${rank}</td>
                <td>${player}</td>
                <td align="right">${pts}</td>
            </tr>
        `;
    }

})
.catch(error => console.error(error));
