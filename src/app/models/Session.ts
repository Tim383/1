import { Building } from './Building';
import { Room } from './Room';
import { Speaker } from './Speaker';

export interface Session {
    alreadyRegistered: boolean;
    building: Building;
    camerasPermitted: number;
    detailedDescription: string;
    endTime: Date;
    id: string;
    language: number;
    name: string;
    recordingsPermitted: number;
    room: Room;
    sessionFormat: number;
    sessionObjectives: string;
    sessionPreRequisites: string;
    sessionSummary: string;
    sessionType: number;
    startTime: Date;
    userEligibleToRegister: boolean;
    speakers: Speaker[];
    maxCapacity: number;
    isCapacityRestricted: boolean;
    registrationCount: number;
}
