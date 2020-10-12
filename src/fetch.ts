import { spawnSync } from 'child_process';
import * as path from 'path';
import extract from 'extract-zip';
import * as fs from 'fs-extra';
import * as Axios from 'axios';
import { SemVer } from 'semver';
import * as tar from 'tar';

const AXIOS = Axios.default;

export class Fetch {
    public static readonly YY_BOSS_CURRENT_VERSION = new SemVer('0.5.0');
    public static readonly ADAM_CURRENT_VERSION = new SemVer('0.1.2');

    /**
     * Downloads a YyBoss from the Github release pages to a directory of a users choosing. This allows
     * downstream crates to avoid packaging the server exe with them. Thanks to Sidorakh for contributing
     * this work!
     *
     * @param bossDirectory The directory to download the YyBoss to. The filename will depend on the version
     * of the boss.
     * @param force A callback for handling updates/forcing updates. If it is not provided, then by default,
     * if no current verison exists, or if the current verison is below the YY_BOSS_CURRENT_VERSION watermark,
     * the remote version will be downloaded.
     *
     * @returns path. Returns the path to the yyboss downloaded.
     */
    public static async fetchYyBoss(
        bossDirectory: string,
        cmp_operation?: (current_version: SemVer | undefined) => Promise<boolean> | boolean
    ): Promise<string> {
        const base_url = `https://github.com/NPC-Studio/yy-boss/releases/download/v${Fetch.YY_BOSS_CURRENT_VERSION}/`;

        if (cmp_operation === undefined) {
            cmp_operation = old_version => {
                if (old_version === undefined) {
                    return true;
                }

                // if old version is smaller than current version, please download.
                return old_version.compare(Fetch.YY_BOSS_CURRENT_VERSION) === -1;
            };
        }

        return Fetch.fetch(
            bossDirectory,
            `${base_url}yy-boss-${Fetch.YY_BOSS_CURRENT_VERSION}-x86_64-pc-windows-msvc.zip`,
            `${base_url}yy-boss-${Fetch.YY_BOSS_CURRENT_VERSION}-x86_64-apple-darwin.zip`,
            'yy-boss-cli',
            cmp_operation
        );
    }

    /**
     * Downloads `adam`, a CLI to handle GameMaker compilation, off the Github page. This doesn't really feel
     * like it should be in this library, but it's more convenient to be here than to not be here.
     *
     * @param adamDirectory The directory to download Adam to. The filename will depend on the OS.
     * @param force A callback for handling updates/forcing updates. If it is not provided, then by default,
     * if no current verison exists, or if the current verison is below the ADAM_CURRENT_VERSION watermark,
     * the remote version will be downloaded.
     *
     * @returns path. Returns the path to the adam downloaded.
     */
    public static async fetchAdam(
        adamDirectory: string,
        cmp_operation?: (current_version: SemVer | undefined) => Promise<boolean> | boolean
    ): Promise<string> {
        const base_compare = (old_version: SemVer | undefined) => {
            if (old_version === undefined) {
                return true;
            }

            // if old version is smaller than current version, please download.
            return old_version.compare(this.ADAM_CURRENT_VERSION) === -1;
        };
        if (cmp_operation === undefined) {
            cmp_operation = base_compare;
        }
        const base_url = `https://github.com/NPC-Studio/adam/releases/download/v${Fetch.ADAM_CURRENT_VERSION}/`;

        // check the PATH first...
        let current_version = Fetch.exeVersion('adam');
        if (base_compare(current_version) == false) {
            return 'adam';
        } else {
            // now do the DOWNLOAD glory
            return Fetch.fetch(
                adamDirectory,
                `${base_url}adam-${Fetch.ADAM_CURRENT_VERSION}-x86_64-pc-windows-msvc.zip`,
                `${base_url}adam-${Fetch.ADAM_CURRENT_VERSION}-x86_64-apple-darwin.tar.gz`,
                'adam',
                cmp_operation
            );
        }
    }

    private static async fetch(
        outputDirectory: string,
        win_url: string,
        darwin_url: string,
        base_fname: string,
        cmp_operation: (current_version: SemVer | undefined) => Promise<boolean> | boolean
    ): Promise<string> {
        // Fetches a compatible release of YYBoss from Github
        async function download(url: string, dest: string): Promise<void> {
            const response = await AXIOS.get(url, { responseType: 'stream' });
            const writer = fs.createWriteStream(dest);
            response.data.pipe(writer);
            return new Promise<undefined>((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }

        // resolve it to the full path...not really necessary, but good for debugging
        outputDirectory = path.resolve(outputDirectory);

        // make sure the directory is valid, so we can write and read below
        await fs.ensureDir(outputDirectory);

        let exe_path: string | undefined = undefined;
        let url: string | undefined = undefined;

        if (process.platform == 'win32') {
            exe_path = path.join(outputDirectory, `${base_fname}.exe`);
            url = win_url;
        } else if (process.platform == 'darwin') {
            exe_path = path.join(outputDirectory, base_fname);
            url = darwin_url;
        } else {
            throw 'Fetch does not have support for Linux!';
        }

        let current_version = Fetch.exeVersion(exe_path);
        let do_download = await cmp_operation(current_version);

        if (do_download) {
            // file either doesn't exist, or we have the wrong version
            const download_location = path.join(outputDirectory, 'download');

            try {
                await download(url, download_location);
            } catch (e) {
                throw `Update from GitHub releases failed! -- ${e}`;
            }

            if (url.endsWith('tar.gz')) {
                await tar.x({
                    file: download_location,
                    cwd: outputDirectory,
                });
            } else {
                await extract(download_location, { dir: outputDirectory, defaultFileMode: 0o777 });
            }

            await fs.remove(download_location);

            // only unix will need the chmod but windows can have some chmod
            // as a treat
            await fs.chmod(exe_path, 0o777);
        }

        return exe_path;
    }

    public static exeIsCurrent(yyBossPath: string, minVersion: SemVer): boolean {
        try {
            const yyBossVersionCheck = spawnSync(yyBossPath, ['-v']);
            let v = new SemVer(yyBossVersionCheck.stdout.toString().replace(/[a-z-]*\s/g, ''));
            return v.compare(minVersion) !== -1;
        } catch (_) {
            return false;
        }
    }

    static exeVersion(exe: string): SemVer | undefined {
        try {
            const yyBossVersionCheck = spawnSync(exe, ['-v']);
            return new SemVer(yyBossVersionCheck.stdout.toString().replace(/[a-z-]*\s/g, ''));
        } catch (_) {
            return undefined;
        }
    }
}
