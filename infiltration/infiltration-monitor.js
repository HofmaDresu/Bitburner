/** @param {NS} ns */
export async function main(ns) {
	while(true) {
        // Look for 
        // <button class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-1b57hxc" tabindex="0" type="button">Cancel Infiltration<span class="MuiTouchRipple-root css-w0pj6f">
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

        ns.print(`In infiltration mode ${inInfiltrationMode}`);


        // If that's there, we've started an infiltration
        // If we're in infiltration, look for the following to find the current game
        // <h4 class="MuiTypography-root MuiTypography-h4 css-qan7cn">Type it backward</h4>
        // Note: there will be more than 1 h4 like this. Ignore any that don't match a game we know about
        // Switch on current game to have other files play the game
        // wait for them to finish

        await ns.sleep(500);
    }
}