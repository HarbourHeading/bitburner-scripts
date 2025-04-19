/**
 * Iterates over 'home' neighbours to reasonable depth,
 * arbitrarily stopping at 999 to avoid crash.
 *
 * Attempts to gain root access of neighbour. Uses tools
 * available on "home" machine. Modify script if running
 * from other server.
 *
 * 'Hack' in the script refers to starting 'nuking',
 * Not setting up a miner.
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
    const hostname = ns.getHostname();

    /**
     * Traverse host, avoiding already seen hosts
     * due to duplicate neighbours.
     *
     * @param {str} host Host to traverse and hack
     */
    function traverseAndHack(host)
    {
        if (seen_hosts.has(host) || host === hostname)
        {
            return;
        }

        seen_hosts.add(host);

        hackHost(ns, host);

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

    const initial_neighbours = ns.scan(hostname);
    for (const neighbour of initial_neighbours)
    {
        traverseAndHack(neighbour);
    }
}

/**
 * Runs available tools to open ports, attempts to gain root
 * then copies over 'nuke.js' to later start mining.
 *
 * @param {NS} ns
 * @param {string} Target host to attempt to hack
 */
async function hackHost(ns, target)
{
    if (ns.fileExists("BruteSSH.exe", "home"))
    {
        ns.brutessh(target);
    }

    if (ns.fileExists("SQLInject.exe", "home"))
    {
        ns.sqlinject(target);
    }

    if (ns.fileExists("FTPCrack.exe", "home"))
    {
        ns.ftpcrack(target);
    }

    if (ns.fileExists("HTTPWorm.exe", "home"))
    {
        ns.httpworm(target);
    }

    if (ns.fileExists("relaySMTP.exe", "home"))
    {
        ns.relaysmtp(target);
    }

    // May fail due to missing tools or too low level
    ns.nuke(target);

    // Can pass other files if needed
    const files = ["nuke.js"];

    ns.scp(files, target, "home");
}