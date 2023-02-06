interface PcMenu {
  text?: string
  /** 标题：1 组件：2 描述：3*/
  type: 1 | 2 | 3
  doc?: string
}

interface SmyConfig {
  useMobile?: boolean
  port?: number
  pc?: {
    menu?: PcMenu[]
  }
  [k: string]: any
}

export function defineConfig(config: SmyConfig) {
  return config
}
