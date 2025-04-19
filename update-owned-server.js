/**
 * Paste new script for owned servers to run. Kills all scripts
 * on server before proceeding. Servers can be excluded.
 *
 */

/** @param {NS} ns */
export async function main(ns) {
    const purchased_servers = ns.getPurchasedServers();

    // Servers to exclude as hostname strings, e.g. ["laset"]
    let excluded_servers;
    excluded_servers = [];

    const remoteScript = "remote-nuke.js";
    const remoteScriptRam = ns.getScriptRam(remoteScript, "home");

    let i = 0;

    purchased_servers.forEach((element) =>
    {
        if (excluded_servers.includes(element))
        {
            return;
        }

        let group = Math.floor(i / 5);

        const maxRam = ns.getServerMaxRam(element);
        const allowed_threads = Math.floor(maxRam / remoteScriptRam);

        ns.killall(element);
        ns.scp(remoteScript, element);
        ns.exec(remoteScript, element, allowed_threads, group);
        i++;
    })
}