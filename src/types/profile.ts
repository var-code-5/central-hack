export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
    email: string;
    name: string;
    regNo: string;
    gender: Gender;
    hostelBlock: string;
    roomNo: string;
    mobileNo: string;
    school: string;
    branch: string;
    hasTeam: boolean;
    isTeamLeader: boolean;
    createdAt: string;
    updatedAt: string;
}

export type GetProfileResponse =
    | {
        profileCompleted: false;
    }
    | {
        profileCompleted: true;
        user: User;
    };

export interface CreateProfileResponse {
    message: string;
    user: User;
}
