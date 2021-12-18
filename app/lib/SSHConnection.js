import { Client as SSHClient } from 'ssh2';

const SSHConnection = {
  con: null,
  establish(host, user, key, passphrase) {
    this.con = new SSHClient();
    return new Promise((resolve, reject) => {
      try {
        this.con.connect({
          host,
          port: 22,
          username: user,
          privateKey: key,
          passphrase,
        });
      } catch (e) {
        reject(e);
        return;
      }

      this.con.on('error', (err) => reject(err));

      this.con.on('ready', (err) => resolve(err));
    });
  },
  exec(cmd) {
    return new Promise((resolve, reject) => {
      this.con.exec(cmd, (err, stream) => {
        if (err) {
          return reject(err);
        }

        // capture stdOut, stdErr and resolve when stream closed
        let cmdStdout = '';
        let cmdStdErr = '';

        return stream.on('close', (code) => {
          cmdStdErr = cmdStdErr.trim();
          cmdStdout = cmdStdout.trim();
          if (cmdStdErr.length > 0) return reject(cmdStdErr, code);
          return resolve(cmdStdout);
        }).on('data', (data) => {
          cmdStdout += data.toString();
        }).stderr.on('data', (data) => {
          cmdStdErr += data.toString();
        });
      });
    });
  },
};

export default SSHConnection;
