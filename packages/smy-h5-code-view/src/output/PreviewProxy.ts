let uid = 0

export class PreviewProxy {
  pendingCmds: Map<number, { resolve: (value: unknown) => void; reject: (reason?: any) => void }>
  handleEvent: (e: any) => void

  constructor(public iframe: HTMLIFrameElement, public handlers: Record<string, (data: any) => void>) {
    this.pendingCmds = new Map()
    this.handleEvent = (e) => this.handleReplMessage(e)
    window.addEventListener('message', this.handleEvent, false)
  }

  destroy() {
    window.removeEventListener('message', this.handleEvent)
  }

  iframeCommand(action: string, args: any) {
    return new Promise((resolve, reject) => {
      const cmd_id = uid++

      this.pendingCmds.set(cmd_id, { resolve, reject })

      this.iframe.contentWindow!.postMessage({ action, cmd_id, args }, '*')
    })
  }

  handleCommandMessage(cmd_data: any) {
    const action = cmd_data.action
    const id = cmd_data.cmd_id
    const handler = this.pendingCmds.get(id)

    if (handler) {
      this.pendingCmds.delete(id)
      if (action === 'cmd_error') {
        const { message, stack } = cmd_data
        const e = new Error(message)
        e.stack = stack
        handler.reject(e)
      }

      if (action === 'cmd_ok') {
        handler.resolve(cmd_data.args)
      }
    } else if (action !== 'cmd_error' && action !== 'cmd_ok') {
      console.error('command not found', id, cmd_data, [...this.pendingCmds.keys()])
    }
  }

  handleReplMessage(event: MessageEvent) {
    if (event.source !== this.iframe.contentWindow) return
    const { action, args } = event.data
    const { handlers } = this

    switch (action) {
      case 'cmd_error':
      case 'cmd_ok':
        return this.handleCommandMessage(event.data)
      case 'fetch_progress':
        return handlers.fetch_progress?.(args.remaining)
      case 'error':
        return handlers.error?.(event.data)
      case 'unhandledrejection':
      case 'unhandled_rejection':
        return handlers.unhandled_rejection?.(event.data)
      case 'console':
        return handlers.console?.(event.data)
      case 'console_group':
        return handlers.console_group?.(event.data)
      case 'console_group_collapsed':
        return handlers.console_group_collapsed?.(event.data)
      case 'console_group_end':
        return handlers.console_group_end?.(event.data)
    }
  }
  eval(script: string | string[]) {
    return this.iframeCommand('eval', { script })
  }
  handleLinks() {
    return this.iframeCommand('catch_clicks', {})
  }
}
