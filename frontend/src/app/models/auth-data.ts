// export interface AuthData {
//     email:string;
//     password:string;
//     remember_me:boolean;
// }
export class AuthData {
  constructor(
    public email: string,
    public password: string,
    public remember_me: boolean
  ) {}
}
