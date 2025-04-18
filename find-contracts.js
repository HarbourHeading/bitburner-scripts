/**
 * Iterate over neighbours and print a list of servers that
 * have contracts on them to the terminal. Not copied
 * directly to host due to intentional scp limitation.
 *
 * Example output:
 *  find-contracts.js: found contract on computek: contract-44130.cct
 *  find-contracts.js: found contract on deltaone: contract-462641.cct
 *  find-contracts.js: found contract on I.I.I.I: contract-678457.cct
 *  find-contracts.js: found contract on iron-gym: contract-474705.cct
 *  find-contracts.js: found contract on darkweb: contract-930334.cct
 */

/** @param {NS} ns */
export async function main(ns) {
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

        findContract(ns, host);

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
 * Do 'ls' and find files ending in '.cct'.
 * Prints all hosts with a contract available
 * to terminal.
 *
 * @param {NS} ns
 * @param {string} target host to find contracts on
 */
async function findContract(ns, target) {

    const files = ns.ls(target);

    const contract = files.filter((element) => element.endsWith(".cct"));

    // No hits
    if (contract.length === 0) {
        return;
    }

    ns.tprint("found contract on " + target + ": " + contract);
}