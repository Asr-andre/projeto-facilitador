import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

// Calendar option
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

// BootStrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { category, calendarEvents, createEventId } from './data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

/**
 * Calendar Component
 */
export class CalendarComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // event form
  formData: UntypedFormGroup;
  formEditData: UntypedFormGroup;

  // calendar
  calendarEvents!: any[];
  editEvent: any;
  newEventDate: any;
  category!: any[];
  submitted = false;

  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow!: TemplateRef<any>;

  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Nazox' }, { label: 'Calendar', active: true }];

    /**
     * Event Model validation
     */
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    this._fetchData();
  }

  private _fetchData() {
    // Event category
    this.category = category;
    // Calender Event Data
    this.calendarEvents = calendarEvents;
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  /***
  * Calender Set
  */
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    initialEvents: calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.openModal.bind(this),
    eventClick: this.openEditModal.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];

  /**
   * Open Event Modal
   */
  openModal(event?: any) {
    // this.submitted = false;
    this.newEventDate = event,
      // this.formBuilder.group({
      //   editDate: this.newEventDate.date
      // })
    this.modalService.open(this.modalShow, { centered: true });
  }

  /**
   * Open Event Modal For Edit
   * @param editcontent modal content
   * @param event calendar event
   */
  openEditModal(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;
    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory: clickInfo.event.classNames[clickInfo.event.classNames.length - 1],
    });
    this.modalService.open(this.editmodalShow, { centered: true });
  }

  /**
 * Events bind in calander
 * @param events events
 */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  /**
   * Show successfull Save Dialog
   */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 2000
    });
  }

  /***
 * Model Edit Position Set
 */
  Editposition() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been Updated',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Upldated event title save in calendar
   */
  editEventSave() {
    const editTitle = this.formEditData.get('editTitle').value;
    const editCategory = this.formEditData.get('editCategory').value;
    const editId = this.calendarEvents.findIndex(x => x.id + '' === this.editEvent.id + '');

    this.editEvent.setProp('title', editTitle);
    this.editEvent.setProp('classNames', editCategory);

    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id:this.editEvent.id,
      className: editCategory
    };
    this.Editposition();
    this.formEditData = this.formBuilder.group({
      editTitle: '',
      editCategory: '',
    });
    this.modalService.dismissAll();
  }

  /**
   * Delete the event from calendar
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.dismissAll();
  }

  /**
   * Model Data save and show the event in calendar
   */
  saveEvent() {
    if (this.formData.valid) {
      const title = this.formData.get('title')!.value;
      const category = this.formData.get('category')!.value;
     
      const calendarApi = this.newEventDate.view.calendar;

      calendarApi.addEvent({
        id: createEventId(),
        title,
        className: category + ' ' + 'text-white',
        start: this.newEventDate.start,
        end: this.newEventDate.end
      });
      this.position();
      this.formData = this.formBuilder.group({
        title: '',
        category: ''
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  /**
   * Open Delete Confirmation Modal
   */
  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.deleteEventData();
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
      }
    });
  }



  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      category: ''
    });
    this.modalService.dismissAll();
  }
}
