/**
 * Basic buying server and copying required scripts.
 * Prefixes servers with 'pserv-'
 */

/** @param {NS} ns */
export async function main(ns)
{
    const ram = 64;
    const remoteScript = "remote-nuke.js";

    let i = 0;

    while (i < ns.getPurchasedServerLimit())
    {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram))
        {
            let hostname = ns.purchaseServer("pserv-" + i, ram);
            ns.scp(remoteScript, hostname);

            // Startup servers
            ns.run("update-owned-server.js");

            i++;
        }

        await ns.sleep(1000);
    }
}