/** @param {NS} ns */
export async function main(ns) {
    //while(true) {
        MY_SINGULARITY = {
            myGetCurrentServer: () => ns.singularity.getCurrentServer(),
            test: "foo",
            bar: () => "bar"
        }
        document.mySingularity = MY_SINGULARITY;
        await new Promise(() => {});
        //await ns.sleep(60_000);
    //}
}

export let MY_SINGULARITY;

export const getMySingularity = () => document.mySingularity;