const express = require('express')
const app = express();

var parser = require('./firebase/parseFiles.js')
app.get('/upload', parser.file);
app.get('/', (req,res)=>{
  res.send("hello world");
});

app.get('/uploadFTP', (req,res)=>{
  // var ftpClient = require('ftp-client')
  // var config = {
  //   host: '139.59.3.146',
  //   port: 22,
  //   user: 'root',
  //   password: 'pass123'
  // }
  console.log("sadsad-->");


var FTPS = require('ftps');
var ftps = new FTPS({
  host: '139.59.3.146', // required
  username: 'root', // Optional. Use empty username for anonymous access.
  password: 'pass123', // Required if username is not empty, except when requiresPassword: false
  protocol: 'sftp', // Optional, values : 'ftp', 'sftp', 'ftps', ... default: 'ftp'
  // protocol is added on beginning of host, ex : sftp://domain.com in this case
  port: 22, // Optional
  // port is added to the end of the host, ex: sftp://domain.com:22 in this case
  escape: true, // optional, used for escaping shell characters (space, $, etc.), default: true
  retries: 2, // Optional, defaults to 1 (1 = no retries, 0 = unlimited retries)
  timeout: 10, // Optional, Time before failing a connection attempt. Defaults to 10
  retryInterval: 5, // Optional, Time in seconds between attempts. Defaults to 5
  retryMultiplier: 1, // Optional, Multiplier by which retryInterval is multiplied each time new attempt fails. Defaults to 1
  requiresPassword: true, // Optional, defaults to true
  autoConfirm: true, // Optional, is used to auto confirm ssl questions on sftp or fish protocols, defaults to false
  cwd: '', // Optional, defaults to the directory from where the script is executed
  additionalLftpCommands: '', // Additional commands to pass to lftp, splitted by ';'
  requireSSHKey:  true,//  Optional, defaults to false, This option for SFTP Protocol with ssh key authentication
  sshKeyPath: '/root/phrasee/id_dsa' // Required if requireSSHKey: true , defaults to empty string, This option for SFTP Protocol with ssh key authentication

});
// Do some amazing things
ftps.cd('/root/').addFile(__dirname + '/test12.txt').exec(console.log);

  res.send("hello world");

});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
