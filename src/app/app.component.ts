import { Component, OnInit } from "@angular/core";
import { fromEvent, of, merge, combineLatest, Observable } from "rxjs";
import {
  switchMap,
  distinctUntilChanged,
  share,
  filter,
  map,
} from "rxjs/operators";
import { KeyCode } from "./keycodes";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  shortcuts$: Observable<string>;

  ngOnInit(): void {
    // keyup not getting triggered when meta key is pressed on mac
    const cmdJ = merge(
      createShortcut([KeyCode.MetaRight, KeyCode.KeyJ]),
      createShortcut([KeyCode.MetaLeft, KeyCode.KeyJ])
    );

    const ctrlL = merge(
      createShortcut([KeyCode.ControlLeft, KeyCode.KeyL]),
      createShortcut([KeyCode.ControlLeft, KeyCode.KeyL])
    );

    const abc = createShortcut([KeyCode.KeyA, KeyCode.KeyB, KeyCode.KeyC]).pipe(
      sequence()
    );
    const qwertz = createShortcut([
      KeyCode.KeyQ,
      KeyCode.KeyW,
      KeyCode.KeyE,
      KeyCode.KeyR,
      KeyCode.KeyT,
      KeyCode.KeyY,
    ]).pipe(sequence());

    const commaDot = createShortcut([KeyCode.Comma, KeyCode.Period]);
    const shiftNext = merge(
      createShortcut([KeyCode.ShiftLeft, KeyCode.Backquote]),
      createShortcut([KeyCode.ShiftRight, KeyCode.Backquote])
    );
    const altK = merge(
      createShortcut([KeyCode.AltLeft, KeyCode.KeyK]),
      createShortcut([KeyCode.AltRight, KeyCode.KeyK])
    );
    const altSpace = merge(
      createShortcut([KeyCode.AltLeft, KeyCode.Space]),
      createShortcut([KeyCode.AltRight, KeyCode.Space])
    );

    this.shortcuts$ = merge(
      cmdJ,
      ctrlL,
      abc,
      qwertz,
      commaDot,
      shiftNext,
      altK,
      altSpace
    ).pipe(map((arr) => arr.map((a) => a.code).join("+")));
  }
}

export const createShortcut = (shortcut: KeyCode[]) => {
  const keyDown$ = fromEvent<KeyboardEvent>(document, "keydown");
  const keyUp$ = fromEvent<KeyboardEvent>(document, "keyup");

  const keyEvents = merge(keyDown$, keyUp$).pipe(
    distinctUntilChanged((a, b) => a.code === b.code && a.type === b.type),
    share()
  );

  const createKeyPressStream = (charCode: KeyCode) =>
    keyEvents.pipe(filter((event) => event.code === charCode.valueOf()));

  return of(shortcut).pipe(
    switchMap((seq) => combineLatest(seq.map((s) => createKeyPressStream(s)))),
    filter<KeyboardEvent[]>((arr) => arr.every((a) => a.type === "keydown"))
  );
};

export function sequence() {
  return (source: Observable<KeyboardEvent[]>) => {
    return source.pipe(
      filter((arr) => {
        const sorted = [...arr]
          .sort((a, b) => (a.timeStamp < b.timeStamp ? -1 : 1))
          .map((a) => a.code)
          .join();
        const sequence = arr.map((a) => a.code).join();
        return sorted === sequence;
      })
    );
  };
}
