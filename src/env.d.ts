/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
      user: User | null;
    }
  }

  interface ImportMetaEnv {
    readonly PUBLIC_WEBSITE_URL: string;
    readonly PUBLIC_PRODUCTION_URL: string;
  }