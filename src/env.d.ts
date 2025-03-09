/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
      user: User | null;
    }
  }

interface ImportMetaEnv {
  readonly R2_ACCOUNTID: string;
  readonly R2_ACCESS_KEY_ID: string;
  readonly R2_SECRET_ACCESS_KEY: string;
  readonly R2_BUCKET_NAME: string;
  readonly PUBLIC_CDN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}