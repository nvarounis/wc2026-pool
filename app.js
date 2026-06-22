alert("APP LOADED");
const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR1iFv4TIjSckPSECiJWeS3BF59LWaefQam-qr7j4LoswG0_9g2WzlePEVrBamMQqmN3_Hpoa1g-SQX/pub?gid=1488246594&single=true&output=csv";

fetch(csvUrl)
.then(response => response.text())
.then(csv => {

    const rows = csv.split("\n");

    let html = "";

    rows.forEach(row => {

        const cols = row.split(",");

        if(cols.length > 25){

            const rank = cols[17];
            const player = cols[18];
            const pts = cols[19];

            if(rank && player && pts){

                html += `
                <tr>
                    <td>${rank}</td>
                    <td>${player}</td>
                    <td>${pts}</td>
                </tr>
                `;
            }
        }

    });

    document.getElementById("leaderboard-body").innerHTML = html;

});
