import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()

export class HseErrorHandlerService implements ErrorHandler {
    constructor() { }
    handleError(error) {
        console.log(error);
        // Rethrow the error otherwose it fets swallowed
        throw error;
    }
}
