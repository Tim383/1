import { EVENT_SERVICE } from './../../providers/service.providers';
import { EventService } from '../../services/event.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Event } from '../../models/Event';
import { LocalizableError } from 'src/app/models/LocalizableError';
import { debounceTime } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { LabelsService } from 'src/app/services/labels.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public allEvents: Event[];
    public filteredEvents: Event[];
    public isLoading: boolean;
    public error?: LocalizableError;
    private subject: Subject<string> = new Subject();

    constructor(@Inject(EVENT_SERVICE) private eventService: EventService, private labelsService: LabelsService) {
    }

    ngOnInit(): void {
        this.loadPublishedEvents();
        this.subject.pipe(
              debounceTime(300)
            ).subscribe(searchTextValue => {
              this.handleSearch(searchTextValue);
            });
    }

    private loadPublishedEvents() {
        this.isLoading = true;
        this.eventService.getPublishedEvents().subscribe(
            events => {
                this.allEvents = events;
                this.filteredEvents = events;
                this.isLoading = false;
            },
            (error: LocalizableError) => this.handleErrorResponse(error)
        );
    }

    private handleErrorResponse(error: LocalizableError) {
        this.error = error;
        this.isLoading = false;
    }

    public translateLabel(translationKey: string, defaultValue: string): Observable<string> {
        return this.labelsService.translateLabel(translationKey, defaultValue);
    }

    private getAreaLabel(event: Event): string{
        let date = this.getDateString(event);
        let building = event.building ? `at ${event.building.name}` : "";
        return `${event.eventName} on ${date} ${building}`;
    }

    private getDateString(event:Event): string{
        var startDate = new Date(event.startDate.toString());
        var endDate = new Date(event.endDate.toString());
        var locale = undefined;
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour:'numeric', minute:'numeric' };
        
        var includeTime = startDate.getFullYear() ===  endDate.getFullYear() && startDate.getMonth() ===  endDate.getMonth() && startDate.getDate() ===  endDate.getDate();
        if(includeTime)
        {
            return `${startDate.toLocaleDateString(locale, dateOptions)} ${startDate.toLocaleTimeString(locale, timeOptions)} - ${endDate.toLocaleTimeString(locale, timeOptions)}`;
        }
        return `${startDate.toLocaleDateString(locale, dateOptions)} - ${endDate.toLocaleDateString(locale, dateOptions)}`;
    }

    handleSearch(searchText: string) {
        if (searchText) {
            searchText = searchText.toLocaleLowerCase();
        }
        this.filteredEvents = this.allEvents.filter( (it: Event) => {
            return it.eventName.toString().toLocaleLowerCase().includes(searchText);
        });
    }

    search(searchText: string) {
        this.subject.next(searchText);
    }

    orderEvents(order: string) {
        if (order === "date-asc") {
            this.filteredEvents.sort((a,b) => {return <any>new Date(a.startDate.toString()) - <any>new Date(b.startDate.toString())});
        } else if (order === "date-desc") {
            this.filteredEvents.sort((a,b) => {return <any>new Date(b.startDate.toString()) - <any>new Date(a.startDate.toString())});
        } else if (order === "name-asc") {
            this.filteredEvents.sort((a,b) => a.eventName.localeCompare(b.eventName));
        } else if (order === "name-desc") {
            this.filteredEvents.sort((a,b) => b.eventName.localeCompare(a.eventName));
        }
    }
}
