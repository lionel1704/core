export declare type AnnotationLevel = 'notice' | 'warning' | 'failure';
export interface Annotation {
    path: string;
    start_line: number;
    end_line: number;
    start_column?: number;
    end_column?: number;
    annotation_level: AnnotationLevel;
    message: string;
    title?: string;
    raw_details?: string;
}
export declare function escapeData(s: any): string;
export declare function escapeProperty(s: any): string;
export declare function annotate(annotation: Annotation): void;
