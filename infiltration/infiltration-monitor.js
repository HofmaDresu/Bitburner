import {typeItBackward} from "infiltration/type-it-backward";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep")
	while(true) {
        let inInfiltrationMode = false;
        const potentialInfiltrationGameWindows = document.getElementsByClassName("jss1 MuiBox-root css-0");
        let infiltrationGameWindow = null;
        if (potentialInfiltrationGameWindows.length >= 0) {
            infiltrationGameWindow = potentialInfiltrationGameWindows[0];
            const potentialInfiltrationButtons = infiltrationGameWindow.getElementsByClassName("MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-1b57hxc");

            for (let i = 0; i < potentialInfiltrationButtons.length; i++) {
                inInfiltrationMode ||= potentialInfiltrationButtons[i].innerHTML.includes("Cancel Infiltration");
            }
        }

        //ns.print(`In infiltration mode ${inInfiltrationMode}`);

        if (inInfiltrationMode) {
            // If we're in infiltration, look for the following to find the current game
            // <h4 class="MuiTypography-root MuiTypography-h4 css-qan7cn">Type it backward</h4>

            const potentialGameNames = infiltrationGameWindow.getElementsByClassName("MuiTypography-root MuiTypography-h4 css-qan7cn");
            for (let i = 0; i < potentialGameNames.length; i++) {
                //ns.print(potentialGameNames[i].innerHTML);
                switch(potentialGameNames[i].innerHTML) {
                    case "Type it backward":
                        await typeItBackward(ns, infiltrationGameWindow);
                        break;
                    case "Slash when his guard is down!":
                        break;
                }
            }

            // Note: there will be more than 1 h4 like this. Ignore any that don't match a game we know about
            // Switch on current game to have other files play the game
            // wait for them to finish

        }
        await ns.sleep(500);
    }
}