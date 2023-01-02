/** @param {NS} ns */
export async function typeItBackward(ns, infiltrationGameWindow) {
    ns.print("Type it backward");
    const promptText = getGameData(ns, infiltrationGameWindow);
    ns.print(`Prompt text ${promptText}`);
    await playGame(ns, infiltrationGameWindow, promptText);
}

function getGameData(ns, infiltrationGameWindow) {
    ns.print("Get game data");
    const promptElements = infiltrationGameWindow.getElementsByClassName("MuiTypography-root MuiTypography-body1 css-cxl1tz"); 
    const promptElement = promptElements[0];
    return promptElement.innerText;
}

/** @param {NS} ns */
async function playGame(ns, infiltrationGameWindow, promptText) {
    const loweredPromptText = promptText.toLowerCase();
    const letters = loweredPromptText.split("");

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const characterCode = loweredPromptText.charCodeAt(i);
        ns.print(`Letter: ${letter}, Code: ${characterCode}`)
        document.dispatchEvent(new KeyboardEvent("keydown", {
            key: letter,
            keyCode: characterCode
        }));
        await ns.sleep(50);
    }
}