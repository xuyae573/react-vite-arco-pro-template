declare module '*.less' {
  const classes: { [className: string]: string };
  export default classes;
}

declare module '*/config/settings.json' {
  const value: {
    colorWeek: boolean;
    navbar: boolean;
    topMenu: boolean;
    menu: boolean;
    footer: boolean;
    theme: string;
    themeColor: string;
    menuWidth: number;
  };

  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}
