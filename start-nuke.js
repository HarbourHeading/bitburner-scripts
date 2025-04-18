/**
 * Iterates over 'home' neighbours to reasonable depth,
 * arbitrarily stopping at 999 to avoid crash.
 *
 * Runs 'nuke.js' on host with most available threads.
 * Requires setup; gaining access to server and copying
 * over 'nuke.js' before running this job.
 *
 * 'Hack' in the script refers to starting 'nuke.js',
 * Not gaining root access.
 *
 * NOTE: Does not verify whether you own the neighbour or
 * if you are high enough level to hack the neighbour.
 * May send a couple terminal alerts due to this.
 */

/** @param {NS} ns */
export async function main(ns)
{
    const seen_hosts = new Set();
    let depth = 0;

    /**
     * Traverse host, avoiding already seen hosts
     * due to duplicate neighbours.
     *
     * @param {string} host Host to traverse and hack
     */
    function traverseAndHack(host)
    {
        if (seen_hosts.has(host) || host === "home")
        {
            return;
        }

        seen_hosts.add(host);

        nukeHost(ns, host);

        const neighbours = ns.scan(host);
        for (const neighbour of neighbours)
        {

            // To avoid crash, track depth
            depth++;

            if (depth >= 999)
            {
                return;
            }

            traverseAndHack(neighbour);
        }
    }

    const initial_neighbours = ns.scan("home");
    for (const neighbour of initial_neighbours)
    {
        traverseAndHack(neighbour);
    }
}

/**
 * Checks for max allowed threads and executes 'nuke.js' on target param
 *
 * @param {NS} ns
 * @param {string} target host to activate nuke on
 */
async function nukeHost(ns, target)
{
    var maxRam = ns.getServerMaxRam(target);
    var usedRam = ns.getServerUsedRam(target)
    var wormRam = ns.getScriptRam("nuke.js", target)

    // Avoid 0 division if script is missing (scp failed)
    if (wormRam === 0)
    {
        return;
    }

    const allowed_threads = Math.floor((maxRam - usedRam) / wormRam);

    if (allowed_threads >= 1)
    {
        ns.exec("nuke.js", target, allowed_threads);
    }
}