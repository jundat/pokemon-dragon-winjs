//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

var Scores = WinJS.Class.define(
    null,
{
    count: 5, // Convenience constant for the other functions of this class
        
    getScores: function () {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        var scoreString = roamingSettings.values["scores"];
        var loadedScores;
        if (!scoreString)
        {
            loadedScores = new Array(this.count);

            for (var i = 0; i < loadedScores.length; i++) {
                // TODO: Initialize your default score table here and adjust your scoring structure
                loadedScores[i] = { player: "player" + i, level: 0, score: 0 };
            }

            // Save setting back for later use
            roamingSettings.values["scores"] = JSON.stringify(loadedScores);
        } else {
            loadedScores = JSON.parse(scoreString);
        }
        
        return loadedScores;
    },

    setScores: function (scoresToSet) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        // Write out
        roamingSettings.values["scores"] = JSON.stringify(scoresToSet);
    },

    // Check if a newly achieved score should be added to the score table, and if so, return its new 1-based rank in the table.
    // Return value of 0 indicates the submitted score was not good enough to add to the table.
    newScore: function (playerr, levell, scoree) {
        var newScoreRank = 0;

        var score = {player: playerr, level: levell, score: scoree};
        // TODO: Update this function to match the sort of your score table

        // Insert the new score in a sorted fashion
        var scores = this.getScores();

        for (var i = scores.length - 1; i >= 0; i--) {

            // Ưu tiên 1: SCORE
            if (score.score > scores[i].score) {
                if (i < scores.length - 1) {
                    scores[i + 1] = scores[i];
                    scores[i] = score;
                    newScoreRank = i + 1;
                }
                if (i === 0) {
                    scores[i] = score;
                    newScoreRank = 1;
                }
            } else if (score.score === scores[i].score) {
                // Ưu tiên 2: LEVEL
                if (score.level > scores[i].level) {
                    if (i < scores.length - 1) {
                        scores[i + 1] = scores[i];
                        scores[i] = score;
                        newScoreRank = i + 1;
                    }
                    if (i === 0) {
                        scores[i] = score;
                        newScoreRank = 1;
                    }
                } else {
                    if (i < scores.length - 1) {
                        scores[i + 1] = score;
                        newScoreRank = i + 2;
                        break;
                    }
                }
            }
        }

        // Save the revised scores back to application data settings
        this.setScores(scores);
        return newScoreRank;
    },
});