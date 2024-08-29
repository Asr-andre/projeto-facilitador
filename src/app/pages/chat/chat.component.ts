import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ChatMessage, ChatUser } from './chat.model';
import { chatData, chatMessagesData } from './data';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  chatMessagesData: ChatMessage[];
  chatData: ChatUser[];

  formData: UntypedFormGroup;

  chatSubmit: boolean;

  username: string;
  usermessage: string;
  status: string;
  image: string;

  constructor(public formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this._fethchData();
    this.username = 'Frank Vickery';
    this.status = 'online';
  }

  private _fethchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }

  chatUsername(name, image, status) {
    this.username = name;
    this.image = image;
    this.usermessage = 'Hello';
    this.chatMessagesData = [];
    const currentDate = new Date();
    this.status = status;

    this.chatMessagesData.push({
      image: this.image,
      name: this.username,
      message: this.usermessage,
      time: currentDate.getHours() + ':' + currentDate.getMinutes(),
      status: this.status
    });
  }

  get form() {
    return this.formData.controls;
  }

  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: 'right',
        name: 'Ricky Clark',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });

      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }
}
