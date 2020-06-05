import { Component, OnInit } from "@angular/core";
import { merge, Observable } from "rxjs";
import {
  map,
} from "rxjs/operators";
import { shortcut, sequence, KeyCode } from 'shortcuts';

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
      shortcut([KeyCode.MetaRight, KeyCode.KeyJ]),
      shortcut([KeyCode.MetaLeft, KeyCode.KeyJ])
    );

    const ctrlL = merge(
      shortcut([KeyCode.ControlLeft, KeyCode.KeyL]),
      shortcut([KeyCode.ControlRight, KeyCode.KeyL])
    );

    const abc = shortcut([KeyCode.KeyA, KeyCode.KeyB, KeyCode.KeyC]).pipe(
      sequence()
    );
    const qwertz = shortcut([
      KeyCode.KeyQ,
      KeyCode.KeyW,
      KeyCode.KeyE,
      KeyCode.KeyR,
      KeyCode.KeyT,
      KeyCode.KeyY,
    ]).pipe(sequence());

    const commaDot = shortcut([KeyCode.Comma, KeyCode.Period]);
    const shiftNext = merge(
      shortcut([KeyCode.ShiftLeft, KeyCode.Backquote]),
      shortcut([KeyCode.ShiftRight, KeyCode.Backquote])
    );
    const altK = merge(
      shortcut([KeyCode.AltLeft, KeyCode.KeyK]),
      shortcut([KeyCode.AltRight, KeyCode.KeyK])
    );
    const altSpace = merge(
      shortcut([KeyCode.AltLeft, KeyCode.Space]),
      shortcut([KeyCode.AltRight, KeyCode.Space])
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
