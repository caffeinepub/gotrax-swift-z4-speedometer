import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Settings {
    colorTheme: ColorTheme;
    speedUnit: SpeedUnit;
    speedometerSkin: string;
}
export enum ColorTheme {
    dark = "dark",
    light = "light",
    colorful = "colorful"
}
export enum SpeedUnit {
    kph = "kph",
    mph = "mph"
}
export interface backendInterface {
    getSettings(): Promise<Settings>;
    resetSettings(): Promise<void>;
    setSettings(newSettings: Settings): Promise<void>;
    toText(): Promise<string>;
}
