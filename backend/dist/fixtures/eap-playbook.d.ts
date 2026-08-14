export interface PlaybookRule {
    id: string;
    state: "blue" | "orange" | "red";
    label: string;
    trigger: {
        description: string;
        status: string;
    };
    productAction: string[];
    ownerRole: string;
    approverRole: string;
    authorityBoundary: string;
    protocolSource: {
        document: string;
        frameworkBasis: string;
        section: string;
        status: string;
    };
}
export declare const EAP_PLAYBOOK_RULES: PlaybookRule[];
