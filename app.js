const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR1iFv4TIjSckPSECiJWeS3BF59LWaefQam-qr7j4LoswG0_9g2WzlePEVrBamMQqmN3_Hpoa1g-SQX/pub?gid=1488246594&single=true&output=csv";

fetch(csvUrl)
.then(response => response.text())
.then(csv => {

    const rows = csv.split("\n");

    let html = "";

    for(let i = 1; i < rows.length; i++){

        const cols = rows[i].split(",");

        const rank = cols[18];
        const player = cols[19];
        const pts = cols[20];

        if(rank && player && pts){

            html += `
            <tr>
                <td>${rank}</td>
                <td>${player}</td>
                <td align="right">${pts}</td>
            </tr>
            `;
        }
    }

    document.getElementById("leaderboard-body").innerHTML = html;

})
.catch(error => console.error(error));
