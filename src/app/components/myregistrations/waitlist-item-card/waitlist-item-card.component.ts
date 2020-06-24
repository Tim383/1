import { Component, Input } from '@angular/core';
import { WaitlistItem } from 'src/app/models/WaitlistItem';

@Component({
    selector: 'app-waitlist-item-card',
    templateUrl: './waitlist-item-card.component.html',
    styleUrls: ['./waitlist-item-card.component.css']
})
export class WaitlistItemCardComponent {
    @Input()
    public waitlistItem: WaitlistItem;
}
