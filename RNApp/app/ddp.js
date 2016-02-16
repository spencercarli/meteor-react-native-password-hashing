import DDPClient from 'ddp-client';
import hash from 'hash.js';
import { AsyncStorage } from 'react-native';
let ddpClient = new DDPClient({
  host: 'localhost',
  port: '3000',
  // url: <your websocket url>
});

ddpClient.signUpWithEmail = (email, password, cb) => {
  let params = {
    email: email,
    password: ddpClient.sha256(password)
  };

  return ddpClient.call('createUser', [params], cb);
};

ddpClient.signUpWithUsername = (username, password, cb) => {
  let params = {
    username: username,
    password: ddpClient.sha256(password)
  };

  return ddpClient.call('createUser', [params], cb);
};

ddpClient.loginWithEmail = (email, password, cb) => {
  let params = {
    user: {
      email: email
    },
    password: ddpClient.sha256(password)
  };

  return ddpClient.call("login", [params], cb)
}

ddpClient.loginWithUsername = (username, password, cb) => {
  let params = {
    user: {
      username: username
    },
    password: ddpClient.sha256(password)
  };

  return ddpClient.call("login", [params], cb)
}

ddpClient.onAuthResponse = (err, res) => {
  if (res) {
    let { id, token, tokenExpires } = res;

    AsyncStorage.setItem('userId', id.toString());
    AsyncStorage.setItem('loginToken', token.toString());
    AsyncStorage.setItem('loginTokenExpires', tokenExpires.toString());
  } else {
    AsyncStorage.multiRemove(['userId', 'loginToken', 'loginTokenExpires']);
  }
}

ddpClient.loginWithToken = (loginToken, cb) => {
  let params = { resume: loginToken };

  return ddpClient.call("login", [params], cb)
}

ddpClient.logout = (cb) => {
  AsyncStorage.multiRemove(['userId', 'loginToken', 'loginTokenExpires'])
    .then((res) => {
      ddpClient.call("logout", [], cb)
    });
}

ddpClient.sha256 = (password) => {
  return {
    digest: hash.sha256().update(password).digest('hex'),
    algorithm: "sha-256"
  };
}

export default ddpClient;
