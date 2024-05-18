import { Scene } from "phaser";

export class LearnPlayFab extends Scene{
    constructor(){
        super('LearnPlayFab');
    }

    create(){
        this.DoExampleLoginWithCustomID();
    }

    DoExampleLoginWithCustomID(){
        PlayFab.settings.titleId = '36A36';
        var loginRequest = {
            // Currently, you need to look up the required and optional keys for this object in the API reference for LoginWithCustomID. See the Request Headers and Request Body.
            TitleId: PlayFab.settings.titleId,
            CustomId: 'Test',
            CreateAccount: true
        };
    
        PlayFabClientSDK.LoginWithCustomID(loginRequest, function (result, error) {
            if (result !== null) {
                console.log("Congratulations, you made your first successful API call!");
            } else if (error !== null) {
                console.log("Something went wrong with your first API call.\n" +
                    "Here's some debug information:\n" +
                    PlayFab.GenerateErrorReport(error));
            }
        })
    }
}