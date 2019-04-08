
export interface AppUser {
    name: string;
    email: string;
    isAdmin: boolean;
    offPeak?: boolean;
    uid?: any;
}