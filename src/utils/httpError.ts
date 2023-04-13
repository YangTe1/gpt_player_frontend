export class HttpException extends Error {
  msg: string

  constructor(msg: string) {
    super()
    this.msg = msg
  }
}
