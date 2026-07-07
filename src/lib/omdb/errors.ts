export type OmdbErrorCode =
  | "CONFIG"
  | "API"
  | "HTTP"
  | "NETWORK"
  | "TIMEOUT"
  | "PARSE"
  | "VALIDATION";

interface OmdbErrorOptions {
  code: OmdbErrorCode;
  status?: number;
}

export class OmdbError extends Error {
  public readonly code: OmdbErrorCode;
  public readonly status?: number;

  constructor(message: string, options: OmdbErrorOptions) {
    super(message);
    this.name = "OmdbError";
    this.code = options.code;
    this.status = options.status;
  }
}
