/**
 * Hack target as base. If needed, also weakens or grows.
 *
 */

/**
 * @param {NS} ns
 * @param {int} allowed_threads Threads Amount of threads nuke is allowed to utilize
 */
export async function main(ns, allowed_threads)
{
    const target = ns.args[0];

    // To not make them look at old values,
    // as all machines may update and check at the same time otherwise.
    ns.asleep(Math.floor(Math.random() * 3000) + 1000);

    while(true)
    {
        // Target low on funds. Support growing role
        if (ns.getServerMoneyAvailable(target) < (ns.getServerMaxMoney(target) * 0.3))
        {
            await ns.grow(target, { threads: allowed_threads });
        }

        // Target has high security. Support weakening role
        if (ns.getServerSecurityLevel(target) > (ns.getServerMinSecurityLevel(target) * 1.3))
        {
            await ns.weaken(target, { threads: allowed_threads });
        }

        await ns.hack(target, { threads: allowed_threads });
    }
}