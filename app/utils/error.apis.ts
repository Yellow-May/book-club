export class CustomErrorAPI extends Error {
  status: number;
  constructor(message: string | undefined, status: number = 400) {
    super(message);
    this.status = status;
  }
}
