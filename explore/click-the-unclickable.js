/** @param {NS} ns */
export async function main(ns) {
    const unclickable = document.getElementById("unclickable");
    wrapEventListeners(ns, unclickable);

    const originalOnClick = unclickable.onclick;

    unclickable.removeEventListener("click", originalOnClick);

    unclickable.addEventListener("click", originalOnClick);

    var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });

    console.log(clickEvent)

    await ns.sleep(1000);
    
    unclickable.dispatchEvent(clickEvent);

    await ns.sleep(2000);

    unwrapEventListeners(ns, unclickable);

    unclickable.removeEventListener("click", originalOnClick);

    unclickable.addEventListener("click", originalOnClick);

}

// Adapted from https://pastebin.com/7DuFYDpJ
function wrapEventListeners(ns, unclickable) {
    if (!unclickable._addUnclickableEventListener) {
        console.log("Wrapping")
		unclickable._addUnclickableEventListener = unclickable.addEventListener;

		unclickable.addEventListener = function (type, callback, options) {
            console.log("calling")
			if ("undefined" === typeof options) {
				options = false;
			}
			let handler = false;

			// For this script, we only want to modify "keydown" events.
			if ("click" === type) {
				handler = function (...args) {
					if (!args[0].isTrusted) {
						const hackedEv = {};

						for (const key in args[0]) {
							if ("isTrusted" === key) {
                                console.log("setting trusted")
								hackedEv.isTrusted = true;
							} else if ("function" === typeof args[0][key]) {
								hackedEv[key] = args[0][key].bind(args[0]);
							} else {
								hackedEv[key] = args[0][key];
							}
						}

						args[0] = hackedEv;
					}
                    console.log("applying")
                    console.log(args[0])
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

			return this._addUnclickableEventListener(
				type,
				handler ? handler : callback,
				options
			);
		};
	}
}

function unwrapEventListeners(ns, unclickable) {
    if (unclickable._addUnclickableEventListener) {
        console.log("Unrapping")
        unclickable.addEventListener = unclickable._addUnclickableEventListener
        delete unclickable._addUnclickableEventListener;
    }
}