import SSHConnection from '../SSHConnection';

describe('SSHConnection', () => {
  it('establish with wrong key', async () => {
    await expect(
      SSHConnection.establish(
        'ssh.yourserver.com',
        'username',
        'fake key',
      ),
    ).rejects;
  });
});
