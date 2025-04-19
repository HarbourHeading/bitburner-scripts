/**
 * Basic weaken, grow or hack on remote target. Divides servers into groups with set roles.
 * Roles are divided based on passed group_size. Priority order: Weaken, Grow then hack.
 *
 * Group size dynamic roles:
 *      1: Weaken
 *      2: Grow
 *      3: Hack
 *
 */

/**
 * @param {NS} ns
 * @param {int} allowed_threads Threads Amount of threads nuke is allowed to utilize
 */
export async function main(ns, allowed_threads)
{
    const target = ns.args[0];
    const role = ns.args[1];

    // To not make them look at old values,
    // as all machines update and check at the same time otherwise.
    ns.asleep(Math.floor(Math.random() * 3000) + 1000);

    let action = 0;

    switch (role)
    {
        case "weaken":
            action = 1;
            break;
        case "grow":
            action = 2;
            break;
        case "hack":
            action = 3;
            break;
        default:
            throw new Error(`Invalid action. Verify role: ${role} exists.`);
    }

    while(true)
    {
        switch (action)
        {
            case 1:
                await ns.weaken(target, { threads: allowed_threads });

                break;
            case 2:
                await ns.grow(target, { threads: allowed_threads });

                break;
            case 3:
                let gain = await ns.hack(target, { threads: allowed_threads });

                // Hack was unsuccessful. Support weakening role
                if (gain === 0) {
                    await ns.weaken(target, { threads: allowed_threads });
                }

                break;
            default:
                throw new Error("Invalid action");
        }

    }
}