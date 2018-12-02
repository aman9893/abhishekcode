/**
 * Entity to store file attachment details
 */
export class FileAttachment {
    name: string;
    type: string;
    size: string;
    content: string;
    metadata: Metadata[] = [];
}

/**
 * Entity to store metadata
 */
export class Metadata {
    key: string;
    value: string;
}
