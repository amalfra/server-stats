import SSHConnection from '../lib/SSHConnection';

const CpuUsage = {
  fetch() {
    return new Promise((resolve, reject) => {
      /*
          /proc/stat cpu metric format
        --------------------------------
             user nice system idle iowait  irq  softirq steal guest guest_nice
        cpu  4705 356  584    3699   23    23     0       0     0          0

        user: normal processes executing in user mode
        nice: niced processes executing in user mode
        system: processes executing in kernel mode
        idle: twiddling thumbs
        iowait: waiting for I/O to complete
        irq: servicing interrupts
        softirq: servicing softirqs
        steal: involuntary wait
        guest: running a normal guest
        guest_nice: running a niced guest

        Total CPU time since boot = user+nice+system+idle+iowait+irq+softirq+steal
        Total CPU Idle time since boot = idle + iowait
        Total CPU usage time since boot = Total CPU time since boot - Total CPU Idle time since boot
        Total CPU percentage = (Total CPU usage time since boot/Total CPU time since boot) * 100
      */
      SSHConnection.exec('cat /proc/stat | grep "^cpu" | '
        + 'sed "s/cpu//g"')
        .then((cmdStdout) => {
          const cpuUsages = cmdStdout.split('\n');
          // first line combined metrics of all cpus which we are not interested in
          cpuUsages.shift();
          return resolve(cpuUsages);
        }, (cmdStderr) => reject(cmdStderr));
    });
  },
};

export default CpuUsage;
