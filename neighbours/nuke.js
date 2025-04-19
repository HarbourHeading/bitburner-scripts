/**
 * Basic weaken, grow or hack based on host status script.
 */

/**
 * @param {NS} ns
 * @param {int} allowed_threads Threads Amount of threads nuke is allowed to utilize
 */
export async function main(ns, allowed_threads) {

    const target = ns.getHostname();
    const moneyThresh = ns.getServerMaxMoney(target);
    const securityThresh = ns.getServerMinSecurityLevel(target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh)
        {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target, {threads: allowed_threads});
        }
        else if (ns.getServerMoneyAvailable(target) < moneyThresh)
        {
            // If the server's money is less than our threshold, grow it
            await ns.grow(target, {threads: allowed_threads});
        }
        else
        {
            await ns.hack(target, {threads: allowed_threads});
        }
    }
}