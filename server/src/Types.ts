export interface ReturnStatus {
    status: number;
    message?: any;
}

export interface AppErrorContent {
    code?: number;
    message?: string;
    stack?: any;
}

export class AppError extends Error {
    private data: AppErrorContent;

    constructor(data: AppErrorContent) {
        super(data.message);
        this.data = data;
    }
}