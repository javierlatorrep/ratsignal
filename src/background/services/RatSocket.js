import EventEmitter from 'events';

const statesLookup = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
};

class RatSocket extends EventEmitter {
  /**
   * @param {String} wsUrl
   */
  constructor(wsUrl) {
    super();

    this._wsUrl = wsUrl;
    this._webSocket = null;

    // good enough?
    this._clientId = `rat-${Date.now()}-${parseInt(Math.random()*1000)}`;
  }

  connect() {
    this._webSocket = new WebSocket(this._wsUrl);

    [
      'close',
      'error',
      'message',
      'open'
    ].forEach((eventName) => {
      const methodName = `on${eventName}`;
      this._webSocket[methodName] = this[methodName].bind(this);
    });
  }

  /**
   * @param {Object} message
   * @param {string} [mode='send']
   */
  send(message, mode = 'send') {
    const currentState = statesLookup[this._webSocket.readyState];
    if (currentState !== 'OPEN') {
      throw new Error(`WebSocket not opened! (readyState=${this._webSocket.readyState} -> "${currentState}")`);
    }

    this._webSocket.send(JSON.stringify({
      clientId: this._clientId,
      mode,
      data: message,
    }))
  }

  /**
   * @param {Object} message
   */
  broadcast(message) {
    this.send(message, 'broadcast');
  }

  close() {
    this._webSocket.close()
  }

  onclose(event) {
    console.info('Connection closed', event);
    console.log(this._webSocket);
    this.emit('close', event);
  }

  onerror(event) {
    console.error('Error', this._webSocket);
    console.error(event);
    this.emit('error', event);
  }

  onmessage(event) {
    console.log('Message received', event);
    console.log(this._webSocket);

    // TODO: try-catch + emit('error') ?
    const messageData = JSON.parse(event.data);

    const { clientId, mode, data } = messageData;

    if (mode === 'broadcast') {
      if (clientId !== this._clientId) {
        this.emit('message', data);
      }
      return;
    }

    this.emit('message', data);
  }

  onopen(event) {
    console.info('Connection opened', event);
    console.log(this._webSocket);
    this.emit('open', event);
  }
}

export default RatSocket
