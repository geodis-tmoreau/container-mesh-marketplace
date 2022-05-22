import { Kuzzle, WebSocket } from 'kuzzle-sdk';

export default new Kuzzle(new WebSocket('localhost', {
  port: 7512
}));;