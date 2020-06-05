import { Component, OnInit } from "@angular/core";
import { merge, Observable } from "rxjs";
import {
  map,
} from "rxjs/operators";
import { createShortcut, sequence, KeyCode } from 'shortcuts';

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
