export interface FormField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    isActive?: boolean;
    options?: string[];
}