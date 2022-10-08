import { SmyComponent } from './smyComponent'
import type { ToastProps, ReactiveToastOptions } from '../src/toast'
import { VueConstructor } from 'vue'

export class ToastComponent extends SmyComponent {
  $props: ToastProps
}

export interface ToastHandler {
  clear: () => void
}

export interface IToast {
  (options: ReactiveToastOptions | string | number): ToastHandler
  Component: typeof ToastComponent
  install(app: VueConstructor): void
  allowMultiple(bool: boolean): void
  success(options: ReactiveToastOptions): ToastHandler
  warning(options: ReactiveToastOptions): ToastHandler
  info(options: ReactiveToastOptions): ToastHandler
  error(options: ReactiveToastOptions): ToastHandler
  loading(options: ReactiveToastOptions): ToastHandler
  clear(): void
}

export const Toast: IToast
