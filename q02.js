var allPlayers = [];

$(document).ready(function () {
    loadPlayerJSON();
});

/* function loadPlayerJSON() loads and parses the JSON and populates a list of players and their stats and then computes and stores their fantasy score for that week. */

function loadPlayerJSON() {

    $.getJSON("https://espn.go.com/users/recruiting/fantasy-sample-data.json", function (players) {
        $.each(players, function (index, player) {
            $.each(player, function (index, player) {
                /* Scoring Rules */
                var passingTD = 4;
                var passingYards = 1 / 25;
                var rushingTD = 6;
                var rushingYards = 1 / 10;
                var receivingTD = 6;
                var receivingYards = 1 / 10;

                /* Shortcuts */
                var aPlayer = player.player;
                var stats = aPlayer["player-stats"];

                /* Player info*/
                var pos = stats.position;
                var name = aPlayer["player-name"];

                /* Compute fantasy score */
                var score = stats["passing-touchdowns"] * passingTD;
                score += stats["passing-yards"] * passingYards;
                score += stats["rushing-touchdowns"] * rushingTD;
                score += stats["rushing-yards"] * rushingYards;
                score += stats["receiving-touchdowns"] * receivingTD;
                score += stats["receiving-yards"] * receivingYards;
                allPlayers.push({
                    "position": pos,
                        "name": name,
                        "score": Math.floor(score)
                });
            });
        });
        bestRoster();
    });
}

/* function bestRoster() accesses the player list and finds the optimal line-up of the best QB, RB1, RB2, WR1, WR2, and TE and outputs that optimal score as well as each individual player’s scores.*/
function bestRoster() {
    var QB = [];
    var RB = [];
    var WR = [];
    var TE = [];
    var optLineup = [];
    allPlayers.sort(function (a, b) {
        return b.score - a.score;
    });
    $.each(allPlayers, function (i, player) {
        var name = player.name;
        var position = player.position;
        var score = player.score;

        switch (position) {
            case "QB":
                QB.push({
                    "name": name,
                        "score": score
                });
                break;

            case "RB":
                RB.push({
                    "name": name,
                        "score": score
                });
                break;

            case "WR":
                WR.push({
                    "name": name,
                        "score": score
                });
                break;

            case "TE":
                TE.push({
                    "name": name,
                        "score": score
                });
                break;
        }
    });
    total = QB[0].score + RB[0].score + RB[1].score + WR[0].score + WR[1].score + TE[0].score;
    optLineup.push("QB-" + QB[0].name + "=" + QB[0].score,
        " RB1-" + RB[0].name + "=" + RB[0].score,
        " RB2-" + RB[1].name + "=" + RB[1].score,
        " WR1-" + WR[0].name + "=" + WR[0].score,
        " WR2-" + WR[1].name + "=" + WR[1].score,
        " TE-" + TE[0].name + "=" + TE[0].score,
        " Total=" + total);
    document.getElementById("optRoster").innerHTML = "Optimal Roster: " + optLineup;
}