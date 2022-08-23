import { pathExistsSync } from "fs-extra";
import { SITE_CONFIG, SITE_DIR, SITE_OUTPUT_DIR, SITE_OUTPUT_PATH, SITE_PC_ROUTES, SITE_PUBLIC_PATH, SMY_CONFIG, VITE_RESOLVE_EXTENSION } from "../shared/constant";
import { get, merge } from "lodash";
import { InlineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { createHtmlPlugin } from "vite-plugin-html";
import { resolve } from "path";
import { outputFileSyncOnChange } from "../shared/fs-utils";

export function getSmyConfig(emit = false): Record<string, any> {
  let config: any = {};
  if (pathExistsSync(SMY_CONFIG)) {
    delete require.cache[require.resolve(SMY_CONFIG)];
    config = require(SMY_CONFIG);
  }
  delete require.cache[require.resolve("../../smy.default.config.js")];
  const defaultConfig = require("../../smy.default.config");
  const mergedConfig = merge(defaultConfig, config);
  if(emit){
    const source = JSON.stringify(mergedConfig, null, 2)
    outputFileSyncOnChange(SITE_CONFIG, source)
  }
  return mergedConfig;
}

export function getDevConfig(smyConfig: Record<string, any>): InlineConfig {
  const host = smyConfig.host;
  const defaultLanguage = smyConfig.defaultLanguage;
  console.log('root: ',SITE_DIR);

  return {
    root: SITE_DIR,
    resolve: {
      extensions: VITE_RESOLVE_EXTENSION,
      alias: {
        '@config': SITE_CONFIG,
        '@pc-routes': SITE_PC_ROUTES,
      },
    },
    server: {
      port: smyConfig.port,
      host: host === "localhost" ? "0.0.0.0" : host,
    },
    publicDir: SITE_PUBLIC_PATH,
    plugins: [
      createVuePlugin({
        include: [/\.vue$/, /\.md$/],
        jsx: true,
      }),
      createHtmlPlugin({
        inject: {
          data: {
            pcTitle: get(smyConfig, `pc.title.${defaultLanguage}`),
            mobileTitle: get(smyConfig, `mobile.title.${defaultLanguage}`),
            logo: get(smyConfig, "logo"),
            baidu: get(smyConfig, "analysis.baidu", ""),
          },
        },
      }),
    ],
  };
}


export function getBuildConfig(smyConfig:Record<string, any>):InlineConfig{
  const devConfig = getDevConfig(smyConfig)

  return {
    ...devConfig,
    base: './',
    build:{
      outDir: SITE_OUTPUT_PATH,
      reportCompressedSize: false,
      emptyOutDir: true,
      cssTarget: 'chrome61',
      rollupOptions: {
        input: {
          main: resolve(SITE_DIR, 'index.html')
        }
      }
    }
  }
}