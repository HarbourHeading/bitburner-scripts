/**
 * Grow target.
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
        await ns.grow(target, { threads: allowed_threads });
    }
}