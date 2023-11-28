export type responseToast = {
    error:boolean;
    message:string[];
    type:responseToastEnum;
}

export enum responseToastEnum {
    primary = "primary",
    secondary = "secondary",
    tertiary = "tertiary",
    warning = "warning",
    error = "error"
}
