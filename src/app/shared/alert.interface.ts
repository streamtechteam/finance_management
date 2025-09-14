export interface AlertConfig {
  title?: string;
  message?: string;
  icon?: 'success' | 'error' | 'warning' | 'info';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  inputType?: 'text' | 'email' | 'password';
  inputPlaceholder?: string;
  inputValue?: string;
}
