export interface Options {
  animations?: {
    modal?: {
      enter?: string;
      leave?: string;
    };
    overlay?: {
      enter?: string;
      leave?: string;
    };
  };
  size?: {
    minWidth?: string;
    width?: string;
    maxWidth?: string;
    minHeight?: string;
    height?: string;
    maxHeight?: string;
  };
  ignoreBackdropClick? : boolean;
  backdrop?:string;
  keyboard? : boolean;
  focus? : boolean;
  disableClose ? : boolean;
  border? :string;
  borderRadius?:string;
 

}
