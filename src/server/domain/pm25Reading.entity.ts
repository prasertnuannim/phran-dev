export class Pm25Reading {
  constructor(
    public readonly id: string,
    public readonly deviceId: string,
    public readonly pm25: number,
    public readonly createdAt: Date,
  ) {}

  // domain behavior
  isUnhealthy(): boolean {
    return this.pm25 > 50;
  }
}
