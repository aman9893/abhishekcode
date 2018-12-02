import { Pipe, PipeTransform } from '@angular/core';
import { ActiontrackerConstantsService } from '../../actiontracker/services/actiontracker-constants.service';

@Pipe({
    name: 'convertToPriority'
})

// This pipe is used to convert a number based priority to appropriate string values ex. 1: High, 2: Medium, 3: Low etc.

export class ConvertToPriorityPipe implements PipeTransform {
    transform(value: number, character: string): string {
        let strPriority = '';
        ActiontrackerConstantsService.Priority.Priority.forEach(priority => {
            if (priority.Id === value) {
                strPriority = priority.Priority;
            }
        });
        return strPriority;
    }
}
