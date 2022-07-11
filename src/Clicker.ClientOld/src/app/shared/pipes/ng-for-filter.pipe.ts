// In your pipe:
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ngForFilter',
    pure: false
})
export class NgForFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => Object.keys(item).indexOf(filter.toString()) !== -1);
    }
}