import {typeItBackward} from "infiltration/type-it-backward";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep")
    wrapEventListeners();
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

// Adapted from https://pastebin.com/7DuFYDpJ
function wrapEventListeners() {
    if (!document._addEventListener) {
		document._addEventListener = document.addEventListener;

		document.addEventListener = function (type, callback, options) {
			if ("undefined" === typeof options) {
				options = false;
			}
			let handler = false;

			// For this script, we only want to modify "keydown" events.
			if ("keydown" === type) {
				handler = function (...args) {
					if (!args[0].isTrusted) {
						const hackedEv = {};

						for (const key in args[0]) {
							if ("isTrusted" === key) {
								hackedEv.isTrusted = true;
							} else if ("function" === typeof args[0][key]) {
								hackedEv[key] = args[0][key].bind(args[0]);
							} else {
								hackedEv[key] = args[0][key];
							}
						}

						args[0] = hackedEv;
					}

					return callback.apply(callback, args);
				};

				for (const prop in callback) {
					if ("function" === typeof callback[prop]) {
						handler[prop] = callback[prop].bind(callback);
					} else {
						handler[prop] = callback[prop];
					}
				}
			}

			return this._addEventListener(
				type,
				handler ? handler : callback,
				options
			);
		};
	}
}