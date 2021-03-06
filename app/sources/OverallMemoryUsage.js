import SSHConnection from '../lib/SSHConnection';

const OverallMemoryUsage = {
  fetch() {
    return new Promise((resolve, reject) => {
      /*
        free (older versions)
        ---------------------
                     total       used        free     shared    buffers   cached
        Mem:         16038 (1)   15653 (2)   384 (3)  0 (4)     236 (5)   14788 (6)
        -/+ buffers/cache:       628 (7)     15409 (8)
        Swap:        16371       83          16288

        |------------------------------------------------------------|
        |                           R A M                            |
        |______________________|_____________________________________|
        | active (2-(5+6) = 7) |  available (3+5+6 = 8)              |
        |______________________|_________________________|___________|
        |        active        |  buffers/cache (5+6)    |           |
        |________________________________________________|___________|
        |                   used (2)                     | free (3)  |
        |____________________________________________________________|
        |                          total (1)                         |
        |____________________________________________________________|

        free (since free von procps-ng 3.3.10)
        --------------------------------------
                    total       used        free     shared    buffers/cache   available
        Mem:        16038 (1)   628 (2)     386 (3)  0 (4)     15024 (5)       14788 (6)
        Swap:       16371       83          16288

        |------------------------------------------------------------|
        |                           R A M                            |
        |______________________|_____________________________________|
        |                      |      available (6) estimated        |
        |______________________|_________________________|___________|
        |     active (2)       |   buffers/cache (5)     | free (3)  |
        |________________________________________________|___________|
        |                          total (1)                         |
        |____________________________________________________________|

        Reference: http:www.software-architect.net/blog/article/date/2015/06/12/-826c6e5052.html
      */
      SSHConnection.exec('free -b | grep -E "Mem|Swap"')
        .then((cmdStdout) => {
          const formattedOutput = {
            mem: {
              total: 0,
              available: 0,
              used: 0,
              free: 0,
              buffcache: 0,
            },
            swap: {
              total: 0,
              used: 0,
              free: 0,
            },
          };
          const memoryUsages = cmdStdout.split('\n');
          let oldFormat = false;
          // its old format, remove '-/+ buffers/cache' metric which we don't need
          if (memoryUsages.length > 2) {
            memoryUsages.splice(1, 1);
            oldFormat = true;
          }
          for (let i = 0; i < memoryUsages.length; i += 1) {
            memoryUsages[i] = memoryUsages[i].replace(/ +/g, ' ');
            const memoryUsageParts = memoryUsages[i].split(' ');
            memoryUsageParts[0] = memoryUsageParts[0].replace(':', '').toLowerCase();
            let readings = {};

            if (memoryUsageParts[0] === 'swap') {
              readings = {
                total: parseInt(memoryUsageParts[1], 10),
                used: parseInt(memoryUsageParts[2], 10),
                free: parseInt(memoryUsageParts[3], 10),
              };
            } else if (memoryUsageParts[0] === 'mem') {
              let buffcache = 0;
              let available = 0;
              let used = 0;
              const free = parseInt(memoryUsageParts[3], 10);
              const total = parseInt(memoryUsageParts[1], 10);

              if (oldFormat) {
                buffcache = parseInt(memoryUsageParts[5], 10)
                  + parseInt(memoryUsageParts[6], 10);
                available = free + buffcache;
              } else {
                buffcache = parseInt(memoryUsageParts[5], 10);
                available = parseInt(memoryUsageParts[6], 10);
              }
              used = total - free - buffcache;
              readings = {
                total,
                available,
                used,
                free,
                buffcache,
              };
            }

            formattedOutput[memoryUsageParts[0]] = readings;
          }
          return resolve(formattedOutput);
        }, (cmdStderr) => reject(cmdStderr));
    });
  },
};

export default OverallMemoryUsage;
