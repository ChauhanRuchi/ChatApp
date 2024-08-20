
import * as bcrypt from "bcryptjs";
export enum TableName {
Table_Users='User',
Table_Session='Session',
Table_Otp='Otp',
Table_ChatMember='chat_members',
Table_Messages='Messages',
Table_Notifications='Notifications'

}

export enum StatusCode {
  Status_Success = 200,
  Status_Show_Error = 201,
  Status_Token_inValid = 498,
  Status_UnAuthorized = 401,
}
export enum Status {
  'pending' = 'pending',
  'accept' = 'accept',
  'reject' = 'reject',
  'deny' = 'deny'
}



export async function getSecurePassword(password: string) {
  const saltOrRounds = 12;
  const hash = await bcrypt.hash(password, saltOrRounds);
  hash;

  return hash;
}

export async function comparePassword(plaintextPassword: string, passwordHash: string) {
  const result = await bcrypt.compare(plaintextPassword, passwordHash);

  return result;
}

export async function generateRefreshToken(length: number) {
  var result: string = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateOTP() {
  let otp = '';
  for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

