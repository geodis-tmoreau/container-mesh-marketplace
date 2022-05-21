import { Kuzzle, WebSocket } from 'kuzzle-sdk';

export default new Kuzzle(new WebSocket(process.env.REACT_APP_KUZZLE_API_FQDN, {
  port: process.env.REACT_APP_KUZZLE_API_PORT ?? 443
}));;