export interface DataDialogConfig {
  title?: string;
  items?: any[];
  icon?: 'success' | 'error' | 'warning' | 'info';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  inputType?: 'text' | 'email' | 'password';
  inputPlaceholder?: string;
  inputValue?: string;
}
