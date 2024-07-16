import { Directive, EventEmitter, Input, Output } from "@angular/core";

export type SortColumn<T> = keyof T | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export const compararParaOrdenar = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
export interface SortEvent<T> {
  column: SortColumn<T>;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class OrdenarPeloHeaderTabela<T> {
  @Input() sortable: SortColumn<T> = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent<T>>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
