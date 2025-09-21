/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.scan("home").filter((s) => s.indexOf("pserv") !== -1);

    for (const server of servers) {
        ns.killall(server);
        await ns.sleep(100);
    }
}