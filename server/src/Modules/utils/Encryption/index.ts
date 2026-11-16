import crypto from "crypto";
import q from "q";

export class Encryption {
  constructor() {}

  public generateHash(password: string) {
    let defer: q.Deferred<Error | any> = q.defer<Error | any>();

    try {
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      defer.resolve(hash);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  public verifyHash(password: string, hash: string) {
    let defer: q.Deferred<Error | any> = q.defer<Error | any>();

    try {
      const calculated = crypto.createHash("sha256").update(password).digest("hex");
      defer.resolve(calculated === hash);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }
}
