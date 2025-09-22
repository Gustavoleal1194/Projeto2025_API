export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
}

export interface ValidationError {
    field: string;
    message: string;
}
