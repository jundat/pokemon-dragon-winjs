// Exception Team
// Game UIT club
// 2012


var GameState = WinJS.Class.define(
    null,
{
    config: {
        frameRate: 20,
        currentPage: "/html/homePage.html",
        gameName: "Pokemon",
    },

    external: {
        playerName: "Jundat",
        soundVolume: 60, // 0 -> 100
    },

    internal: {
        gamePaused: false,
        gamePhase: "ready",
        score: 0,
        level: 1, // dùng để tính limitTime
        time: 0, // thời gian còn lại
        board: (new Board()).board,
    },

    load: function (flag) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;

        if (flag === undefined || flag === "config") {
            var configString = roamingSettings.values["config"];
            if (configString) {
                this.config = JSON.parse(configString);
            } else
            {
                this.save("config"); // Save the defaults
            }
        }

        if (flag === undefined || flag === "external") {
            var externalString = roamingSettings.values["external"];
            if (externalString) {
                this.external = JSON.parse(externalString);
            } else
            {
                this.save("external"); // Save the defaults
            }
        }

        if (flag === undefined || flag === "internal") {
            var internalString = roamingSettings.values["internal"];
            if (internalString) {
                this.internal = JSON.parse(internalString);
            } else
            {
                this.save("internal"); // Save the defaults
            }
        }
    },

    save: function (flag) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        if (flag === undefined || flag === "config") {
            roamingSettings.values["config"] = JSON.stringify(this.config);
        }
        if (flag === undefined || flag === "external") {
            roamingSettings.values["external"] = JSON.stringify(this.external);
        }
        if (flag === undefined || flag === "internal") {
            roamingSettings.values["internal"] = JSON.stringify(this.internal);
        }
    }

});