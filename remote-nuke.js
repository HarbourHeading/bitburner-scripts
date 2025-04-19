/**
 * Basic weaken, grow or hack on remote target.
 *
 * TODO:
 *      Divide into groups and use a singleton on home that tracks who is doing what, so if
 *      2 in the group is weakening and it will cause Security level to be at target level:
 *      Start hack in time for when weaken is complete.
 */

/**
 * @param {NS} ns
 * @param {int} allowed_threads Threads Amount of threads nuke is allowed to utilize
 */
export async function main(ns, allowed_threads)
{
    const group = ns.args[0];

    // To not make them look at old values,
    // as all machines update and check at the same time otherwise.
    ns.asleep(Math.floor(Math.random() * 5000) + 1000);

    const target_list = ["phantasy", "zer0", "max-hardware", "iron-gym", "silver-helix", "neo-net"];

    // To not overwhelm (25 grows executing at the same time, making all 25 do weaken afterwards)
    // the target, servers are divided into groups. TODO: Singleton to track current group actions.
    const target = target_list[group];

    const moneyThresh = ns.getServerMaxMoney(target);
    const securityThresh = ns.getServerMinSecurityLevel(target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true)
    {
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