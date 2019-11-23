class RatSocket {
  /**
   * @param {String} wsUrl
   * @param {Function} onMessage
   */
  constructor(wsUrl, onMessage) {
    this._wsUrl = wsUrl
    this._onMessage = onMessage
    this._websocket = null
  }

  start() {
    this._websocket = new WebSocket(this._wsUrl)
    this._websocket.onopen = this.onOpen
    this._websocket.onmessage = this.onMessage.bind(this)
    this._websocket.onclose = this.onClose
  }

  /**
   * @param {String} message
   */
  send(message) {
    this._websocket.send(message)
  }

  close() {
    this._websocket.close()
  }

  onOpen() {
    console.log(`${RatSocket.NAMESPACE} OPENED CONNECTION`)
  }

  onMessage({ data }) {
    console.log(`${RatSocket.NAMESPACE} RECEIVED MESSAGE`, data)
    this._onMessage(data)
  }

  onClose() {
    console.log(`${RatSocket.NAMESPACE} CLOSED CONNECTION`)
  }
}

RatSocket.NAMESPACE = 'WS:'

export default RatSocket
