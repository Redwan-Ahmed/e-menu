/** An User Interface which can be called in other files */
export interface AppUser {
    name: string;
    email: string;
    isAdmin: boolean;
    offPeak?: boolean;
    uid?: any;
}