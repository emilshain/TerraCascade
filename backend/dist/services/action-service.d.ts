import type { Action, ActionStatus } from "../types/index.js";
export declare class ActionService {
    private actions;
    getActions(filters?: {
        eventId?: string;
        ownerRole?: string;
        status?: ActionStatus;
        attentionRequired?: boolean;
    }): Action[];
    getActionById(id: string): Action | null;
    updateAction(id: string, updates: {
        status?: ActionStatus;
        overrideReason?: string;
        actorRole?: string;
        title?: string;
        description?: string;
        dueAt?: string;
        attentionRequired?: boolean;
    }): Action;
    resetToInitial(): void;
}
export declare const actionService: ActionService;
