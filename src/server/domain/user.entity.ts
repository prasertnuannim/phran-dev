export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string | null,
    public avatar: string | null
  ) {}
}
