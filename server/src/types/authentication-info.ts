import type { JwtPayload } from 'jsonwebtoken';

/**
 * Custom claims for the JWT token
 */
export interface AuthenticationInfo extends JwtPayload {
    /** stores the active spotify token */
    third_party_access_token: string;
    /** user name */
    name: string;
    /** user e-mail */
    email: string;
}
