import { Client as SSHClient } from 'ssh2'

class SSHConnection {
  constructor(host, user, key) {
    this.con = new SSHClient()
    this.host = host
    this.user = user
    this.key = key
  }

  establish() {
    return new Promise((resolve, reject) => {
      try {
        this.con.connect({
          host: this.host,
          port: 22,
          username: this.user,
          privateKey: this.key
        })
      } catch(e) {
        // destroy precious data
        this.key = null
        return reject(e)
      }

      this.con.on('error', (err) => {
        // destroy precious data
        this.key = null
        return reject(err)
      })

      this.con.on('ready', (err) => {
        // destroy precious data
        this.key = null
        return resolve(err)
      })
    })
  }

  exec(cmd) {
    return new Promise((resolve, reject) => {
      this.con.exec(cmd, (err, stream) => {
        if (err) {
          return reject(err)
        }

        // capture stdOut, stdErr and resolve when stream closed
        let cmdStdout = ''
        let cmdStdErr = ''
        stream.on('close', (code, signal) => {
          cmdStdErr = cmdStdErr.trim()
          cmdStdout = cmdStdout.trim()
          if (cmdStdErr.length > 0)
            return reject(cmdStdErr, code)
          return resolve(cmdStdout)
        }).on('data', (data) => {
          cmdStdout += data.toString()
        }).stderr.on('data', (data) => {
          cmdStdErr += data.toString()
        })
      })
    })
  }
}

export default SSHConnection
