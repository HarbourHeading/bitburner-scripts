/**
 * Paste new script for owned servers to run. Kills all scripts
 * on server before proceeding. Servers can be excluded.
 * Divides servers into groups with set roles.
 * Script works poorly if servers differ in RAM size,
 * as action speed vary so greatly.
 *
 * Group size dynamic roles:
 *      1: Weaken
 *      2: Grow
 *      3: Hack
 *
 * Example:
 *  See how groups are divided:
 *      ./update-owned-server.js 1
 *
 *  Normal run:
 *      ./update-owned-server.js
 *
 * TODO:
 *      Divide into groups and use a singleton on home that tracks who is doing what, so if
 *      2 in the group is weakening and it will cause Security level to be at target level:
 *      Start hack in time for when weaken is complete. Needs singleton to calculate specific
 *      actions due to varying speeds for servers with varying RAM.
 */

/** @param {NS} ns */
export async function main(ns)
{

    // Pass in '1' if you want to see how hosts are divided into groups.
    const debug = ns.args[0] ?? 0;

    const purchased_servers = ns.getPurchasedServers();

    // Servers to exclude as hostname strings.
    let excluded_servers;
    excluded_servers = ["laset", "tenta"];

    // Roles are dynamically set based on group size. Default is 6 (2 weaken, 2 grow and 2 hack.)
    // Groups should not be smaller than 3, as it does not dynamically take the missing role.
    let group_size = 6;

    const remoteScript = "remote-nuke.js";
    const remoteScriptRam = ns.getScriptRam(remoteScript, "home");

    const target_list = ["phantasy", "zer0", "max-hardware", "iron-gym", "silver-helix", "neo-net"];

    let i = 0;

    purchased_servers.forEach((element) =>
    {
        if (excluded_servers.includes(element))
        {
            return;
        }

        const group = Math.floor(i / group_size);
        const group_role = (i % group_size) + 1;

        const roles = ["weaken", "grow", "hack"];
        const role = roles[Math.floor((group_role - 1) * roles.length / group_size)];

        // To not overwhelm (25 grows executing at the same time, making all 25 do weaken afterwards)
        // the target, servers are divided into groups. TODO: Singleton to track current group actions.
        const target = target_list[group];

        const maxRam = ns.getServerMaxRam(element);
        const allowed_threads = Math.floor(maxRam / remoteScriptRam);

        ns.killall(element);
        ns.scp(remoteScript, element);

        if (debug === 1)
        {
            ns.tprint(`Group ${group} | Role ${group_role}/${group_size} → ${role} | Host ${element}`);
        }

        ns.exec(remoteScript, element, allowed_threads, target, role);
        i++;
    })
}