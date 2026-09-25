
export type ActionType =
    | "view"
    | "edit"
    | "delete"
    | "download"
    | "pdf"
    | "toggle"
    | "lock"
    | "link"
    | "person"
    | "approve"
    | "reject"
    | "dispatch"
    | "pending"
    | "forward"
    | "document";

export interface ActionButtonProps {
    actions: ActionType[];
    onAction?: (action: ActionType) => void;
    toggleValue?: boolean;
    disabledActions?: ActionType[];
    actionTitles?: Partial<Record<ActionType, string>>;
}
