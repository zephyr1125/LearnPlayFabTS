import { Scene } from "phaser";

export class LearnPlayFab extends Scene{

    private loggedIn: boolean = false;

    constructor(){
        super('LearnPlayFab');
    }

    create(){
        this.loginWithCustomID()
    }

    private loginWithCustomID(){
        PlayFab.settings.titleId = '36A36';
        var loginRequest: PlayFabClientModels.LoginWithCustomIDRequest = {
            // Currently, you need to look up the required and optional keys for this object in the API reference for LoginWithCustomID. See the Request Headers and Request Body.
            TitleId: PlayFab.settings.titleId,
            // A unique custom id
            CustomId: "GettingStartedGuide",
            CreateAccount: true
        };
    
        PlayFabClientSDK.LoginWithCustomID(loginRequest, this.onLoginResult())
    }

    private onLoginResult(): PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult> {
        return  (result, error) => {
            if (result !== null) {
                this.onLoginSuccess(result, error);
            } else if (error !== null) {
                console.log("Something went wrong with your first API call.\n" +
                    "Here's some debug information:\n" +
                    PlayFab.GenerateErrorReport(error));
            }
            
        };
    }

    private onLoginSuccess(result: PlayFabModule.SuccessContainer<PlayFabClientModels.LoginResult>, error: PlayFabModule.IPlayFabError) {
        console.log("Congratulations, you made your first successful API call!");
        this.loggedIn = true;
        //add button to send score
        this.add.text(10, 30, "Click to send score", { color: '#0f0' })
            .setInteractive().on('pointerdown', () => {
                //send random score
                this.SendLeaderBoard(Math.floor(Math.random() * 100));
            });
        //add button to get leaderboard
        this.add.text(10, 50, "Click to get leaderboard", { color: '#0f0' })
            .setInteractive().on('pointerdown', () => {
                this.getLeaderBoard();
            });
    }

    private SendLeaderBoard( score: integer): void {
        var request: PlayFabClientModels.UpdatePlayerStatisticsRequest = {
            Statistics: [
                {
                    StatisticName: "Score",
                    Value: score
                }
            ]
        }
        PlayFabClientSDK.UpdatePlayerStatistics(request, this.onLeaderBoardResult())
    }

    private onLeaderBoardResult(): PlayFabModule.ApiCallback<PlayFabClientModels.UpdatePlayerStatisticsResult> {
        return (result, error) => {
            if (result !== null) {
                console.log("Successfully sent your score to the leaderboard!");
            } else if (error !== null) {
                console.log("Something went wrong with your score submission.\n" +
                    "Here's some debug information:\n" +
                    PlayFab.GenerateErrorReport(error));
            }
        };
    }

    private getLeaderBoard(): void {
        var request: PlayFabClientModels.GetLeaderboardRequest = {
            StatisticName: "Score",
            StartPosition: 0,
            MaxResultsCount: 10
        }
        PlayFabClientSDK.GetLeaderboard(request, this.onLeaderBoardGetResult())
    }

    onLeaderBoardGetResult(): PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardResult> {
        return (result, error) => {
            if (result !== null) {
                console.log("Successfully got the leaderboard!");
                result.data.Leaderboard?.forEach(item => {
                    console.log(item.PlayFabId + " : " + item.StatValue);
                });
            } else if (error !== null) {
                console.log("Something went wrong with your leaderboard get.\n" +
                    "Here's some debug information:\n" +
                    PlayFab.GenerateErrorReport(error));
            }
        };
    }
}