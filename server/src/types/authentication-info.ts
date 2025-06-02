import type { JwtPayload } from 'jsonwebtoken';

export interface AuthenticationInfo extends JwtPayload {
    third_party_access_token: string;
    name: string;
    email: string;
}
