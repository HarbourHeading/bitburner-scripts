/**
 * Basic buying server and copying then starting supplied script
 * with max threads. Prefixes servers with 'pserv-'
 */

/** @param {NS} ns */
export async function main(ns)
{
    const ram = 64;
    const remoteScript = "remote-nuke.js";
    const remoteScriptRam = ns.getScriptRam(remoteScript, "home");

    const allowed_threads = Math.floor(ram / remoteScriptRam);

    let i = 0;

    while (i < ns.getPurchasedServerLimit())
    {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram))
        {
            let hostname = ns.purchaseServer("pserv-" + i, ram);
            ns.scp(remoteScript, hostname);
            ns.exec(remoteScript, hostname, allowed_threads);
            i++;
        }

        await ns.sleep(1000);
    }
}