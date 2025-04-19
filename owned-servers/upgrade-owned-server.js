/**
 * Upgrade available RAM of all owned servers. Can exclude servers.
 * Does not update them after upgrade. Needs to be done manually.
 *
 */

/** @param {NS} ns */
export async function main(ns)
{
    const ram = 512;

    const purchased_servers = ns.getPurchasedServers();

    // Servers to exclude as hostname strings.
    let excluded_servers;
    excluded_servers = [];

    purchased_servers.forEach((element) =>
    {
        if (excluded_servers.includes(element))
        {
            return;
        }

        ns.upgradePurchasedServer(element, ram);
    })

}