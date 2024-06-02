import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  isActiveElement,
  mod,
  nativeElement,
  outsideClick,
} from '@cv/common/util';
import { Subject, fromEvent, merge, tap } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[cv-common-ui--menu-trigger]',
  imports: [NgTemplateOutlet],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cv-common-ui--menu-trigger',
  },
  template: `<ng-content select=":not(cv-common-ui--menu)" />
    @if (opened()) {
      <ng-content select="cv-common-ui--menu" />
    } `,
  styleUrl: './menu.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuTrigger {
  readonly element = nativeElement();

  readonly menu = contentChild.required(Menu);

  readonly click$ = fromEvent(this.element, 'click');

  readonly keydown$ = fromEvent<KeyboardEvent>(this.element, 'keydown');

  readonly blur$ = fromEvent(this.element, 'blur');

  readonly toggle$ = new Subject<{ force?: boolean }>();

  readonly outsideClick$ = outsideClick();

  readonly active = isActiveElement();

  readonly opened = (() => {
    const opened = signal(false);

    merge(this.click$, this.outsideClick$, this.toggle$, this.keydown$)
      .pipe(
        tap((userOrModelEvent) => {
          // handle model event
          if (!('type' in userOrModelEvent)) {
            opened.set(userOrModelEvent.force ?? !opened());
          }
          // handle user event
          else {
            switch (userOrModelEvent.type) {
              case 'click': {
                if (this.element.contains(userOrModelEvent.target as Node)) {
                  opened.set(!opened());
                } else {
                  opened.set(false);
                }
                break;
              }
              case 'keydown': {
                const key = (userOrModelEvent as KeyboardEvent).key;

                if (key === 'Escape' || key === 'Tab') {
                  opened.set(false);
                }
                break;
              }
            }
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

    return opened.asReadonly();
  })();

  constructor() {
    this.setupAriaHasPopup();
    this.setUpAriaControls();
    this.setupAriaExpanded();
    this.manageMenuFocus();
    this.manageTriggerFocus();
  }

  protected setUpAriaControls() {
    effect(() => {
      const menu = this.menu();
      this.element.setAttribute('aria-controls', menu.id());
    });
  }

  protected setupAriaExpanded() {
    effect(() => {
      this.element.setAttribute('aria-expanded', String(this.opened()));
    });
  }

  protected setupAriaHasPopup() {
    this.element.setAttribute('aria-haspopup', 'menu');
  }

  protected manageTriggerFocus() {
    effect(() => {
      const opened = this.opened();
      const activeMenuItem = this.menu().activeItem();
      const menuItems = this.menu().items();

      // return focus to the trigger when the menu is closed
      if (!opened && activeMenuItem) {
        untracked(() => this.element.focus());
      }

      // focus the first menu item when the menu is opened
      if (opened && !activeMenuItem) {
        // wait for the menu to render, is there a better way to do this?
        setTimeout(() => menuItems.at(0)?.element.focus());
      }
    });
  }

  protected manageMenuFocus() {
    this.keydown$
      .pipe(
        tap((event) => {
          const menuItems = this.menu().items();
          const activeMenuItem = this.menu().activeItem();

          if (!activeMenuItem) {
            return;
          }

          switch (event.key) {
            case 'ArrowUp': {
              const previousMenuItem = menuItems.at(
                mod(menuItems.indexOf(activeMenuItem) - 1, menuItems.length),
              );
              if (previousMenuItem) {
                previousMenuItem.element.focus();
              }
              break;
            }
            case 'ArrowDown': {
              const nextMenuItem = menuItems.at(
                mod(menuItems.indexOf(activeMenuItem) + 1, menuItems.length),
              );
              if (nextMenuItem) {
                nextMenuItem.element.focus();
              }
              break;
            }
            case 'Home': {
              const firstMenuItem = menuItems.at(0);
              if (firstMenuItem) {
                firstMenuItem.element.focus();
              }
              break;
            }
            case 'End': {
              const lastMenuItem = menuItems.at(-1);
              if (lastMenuItem) {
                lastMenuItem.element.focus();
              }
              break;
            }
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  open() {
    this.toggle({ force: true });
  }

  close() {
    this.toggle({ force: false });
  }

  toggle(options?: { force?: boolean }) {
    this.toggle$.next(options ?? {});
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'cv-common-ui--menu',
  standalone: true,
  host: {
    class: 'cv-common-ui--menu',
  },
})
export class Menu {
  protected static nextId = 0;

  readonly element = nativeElement();

  readonly items = contentChildren(MenuItem);

  readonly id = input(`cv-common-ui--menu-${Menu.nextId++}`, {
    transform: (id: string | undefined) =>
      id || `cv-common-ui--menu-${Menu.nextId++}`,
  });

  readonly activeItem = computed(() => {
    return this.items().find((item) => item.active());
  });

  constructor() {
    this.setupRole();
    this.setupAriaOrientation();
    this.setupId();
  }

  setupId() {
    effect(() => {
      this.element.id = this.id();
    });
  }

  setupRole() {
    this.element.setAttribute('role', 'menu');
  }

  setupAriaOrientation() {
    this.element.setAttribute('aria-orientation', 'vertical');
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitem_role
 */
@Directive({
  selector: 'button[cv-common-ui--menu-item]',
  standalone: true,
  host: {
    class: 'cv-common-ui--menu-item',
  },
})
export class MenuItem {
  protected static nextId = 0;

  readonly menu = inject(Menu);

  readonly element = nativeElement();

  readonly id = input(`cv-common-ui--menu-item-${MenuItem.nextId++}`, {
    transform: (id: string | undefined) =>
      id || `cv-common-ui--menu-item-${MenuItem.nextId++}`,
  });

  readonly active = isActiveElement();

  constructor() {
    this.setupRole();
    this.setupId();
  }

  protected setupRole() {
    this.element.setAttribute('role', 'menuitem');
  }

  protected setupId() {
    effect(() => {
      this.element.id = this.id();
    });
  }
}

export const COMMON_UI_MENU = [Menu, MenuTrigger, MenuItem] as const;
