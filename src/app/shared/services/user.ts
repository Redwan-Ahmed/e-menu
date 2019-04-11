/** An User Interface which can be called in other files, this interface is only used in auth.service.ts */
export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
 }
