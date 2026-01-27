import { User } from "./profile";

// Base Team interface
export interface Team {
    teamId: string;
    teamName: string;
    teamLeader: string;
    teamMembers: string[];
    problemStatementId: string | null;
    createdAt: string;
    updatedAt: string;
}

// Team member with details (for GET team details)
export interface TeamMemberDetails {
    email: string;
    name: string;
    regNo: string;
}

// Team with member details
export interface TeamWithDetails {
    teamId: string;
    teamName: string;
    teamLeader: string;
    teamMembers: TeamMemberDetails[];
    problemStatementId: string | null;
    createdAt: string;
    updatedAt: string;
}

// Create Team Response
export interface CreateTeamResponse {
    message: string;
    team: Team;
    user: User;
}

// Join Team Response
export interface JoinTeamResponse {
    message: string;
    team: Team;
    user: User;
}

// Leave Team Response
export interface LeaveTeamResponse {
    message: string;
}

// Submit Problem Statement Response
export interface SubmitProblemStatementResponse {
    message: string;
    team: Team;
}

// Get Team Details Response
export interface GetTeamResponse {
    team: TeamWithDetails;
}

// Error Response
export interface TeamErrorResponse {
    error: string;
}

// Union types for API responses
export type CreateTeamApiResponse = CreateTeamResponse | TeamErrorResponse;
export type JoinTeamApiResponse = JoinTeamResponse | TeamErrorResponse;
export type LeaveTeamApiResponse = LeaveTeamResponse | TeamErrorResponse;
export type SubmitProblemStatementApiResponse = SubmitProblemStatementResponse | TeamErrorResponse;
export type GetTeamApiResponse = GetTeamResponse | TeamErrorResponse;
