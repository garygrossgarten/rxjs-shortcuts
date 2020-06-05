import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { fromEvent, of, merge, combineLatest, Observable } from "rxjs";
import {
  switchMap,
  distinctUntilChanged,
  share,
  filter,
  tap,
  map,
} from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  shortcuts$: Observable<string>;

  ngOnInit(): void {
    // keyup not getting triggered when meta key is pressed on mac
    const cmdJ = createShortcut("Meta+j").pipe(
      map((arr) => arr.map((a) => a.key).join("+"))
    );

    const ctrlL = createShortcut("Control+l").pipe(
      map((arr) => arr.map((a) => a.key).join("+"))
    );
    
    
    const abc = createShortcut("a+b+c").pipe(
      map((arr) => arr.map((a) => a.key).join("+"))
    );

    this.shortcuts$ = merge(cmdJ, ctrlL,abc);
  }
}

export const createShortcut = (shortcut: string) => {
  const keyDown$ = fromEvent<KeyboardEvent>(document, "keydown");
  const keyUp$ = fromEvent<KeyboardEvent>(document, "keyup");

  const keyEvents = merge(keyDown$, keyUp$).pipe(
    distinctUntilChanged((a, b) => a.key === b.key && a.type === b.type),
    share()
  );

  const createKeyPressStream = (charCode) =>
    keyEvents.pipe(filter((event) => event.key === charCode));

  return of(shortcut.split("+")).pipe(
    switchMap((seq) =>
      combineLatest([...seq.map((s) => createKeyPressStream(s))])
    ),
    filter<KeyboardEvent[]>((arr) => arr.every((a) => a.type === "keydown"))
  );
};
