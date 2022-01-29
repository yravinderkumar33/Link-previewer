import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { getLinkPreview } from 'link-preview-js';
import { BehaviorSubject, from, fromEvent, Observable, of, Subscription } from 'rxjs';
import { tap, switchMap, map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('inputEl')
  inputElement!: ElementRef<HTMLInputElement>;

  public linkPreview$: Observable<any> | undefined

  constructor() { }

  ngAfterViewInit(): void {

    const inputEvents$ = fromEvent<any>(this.inputElement.nativeElement, 'input');

    const distinctInputValue$ = inputEvents$.pipe(
      map(event => event.target.value),
      debounceTime(1000),
      distinctUntilChanged()
    )

    this.linkPreview$ = distinctInputValue$.pipe(
      switchMap(text => this.getLinkPreview(text))
    )
  }

  private getLinkPreview(text: string) {
    return from(getLinkPreview(text)).pipe(catchError(_ => of(null)))
  }
}
