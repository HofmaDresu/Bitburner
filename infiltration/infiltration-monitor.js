/** @param {NS} ns */
export async function main(ns) {
	while(true) {
        // Look for 
        // <button class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-1b57hxc" tabindex="0" type="button">Cancel Infiltration<span class="MuiTouchRipple-root css-w0pj6f">
        // If that's there, we've started an infiltration
        // If we're in infiltration, look for the following to find the current game
        // <h4 class="MuiTypography-root MuiTypography-h4 css-qan7cn">Type it backward</h4>
        // Switch on current game to have other files play the game
        // wait for them to finish

        await ns.sleep(500);
    }
}