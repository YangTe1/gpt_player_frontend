export class HttpException extends Error {
  msg: string
  status: number

  constructor(msg: string, status: number) {
    super()
    this.msg = msg
    this.status = status
  }
}
