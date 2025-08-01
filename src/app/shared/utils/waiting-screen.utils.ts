export class WaitingScreen {

  static readonly defaultMessage: string = 'Aguarde...';
  private defaultTimer: number = 6000;

  static show(messages?: Array<IWaitingScreen> | string): void {
    new WaitingScreen().createElement(new WaitingScreen().contentHtml);
    new WaitingScreen().messages = new WaitingScreen().defaultTimerMessages(messages ?? WaitingScreen.defaultMessage);
  }

  static hide(): void {
    const element: HTMLElement | null = document.getElementById('screen-waiting-id');
    if (element && element.parentNode) {
      element.style.opacity = '0';
      setTimeout(() => element.remove(), 110);
    }
  }

  private get contentHtml(): ChildNode {
    const div: HTMLDivElement = document.createElement('div');
    div.innerHTML = `
    <div class="wait-square-message py-2 d-flex justify-content-center align-items-center">
      <div class="loader">
        <div class="wait-multi-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="wait-message-content">
        <p id="wait-message-id" class="wait-message"></p>
      </div>
    </div>`.trim();
    return <ChildNode>div.firstChild;
  }

  private set messages(messages: Array<IWaitingScreen> | string) {
    const messageElement: HTMLElement | null = document.getElementById('wait-message-id');
    if (messageElement) {
      if (typeof messages !== 'string' && Array.isArray(messages)) {
        messageElement.innerHTML = messages[0].message;
        messages.forEach((item: IWaitingScreen, index: number) => {
          setTimeout(() => {
            if (index) {
              messageElement.innerHTML = item.message;
            }
            if (messages.length === index + 1 && item.timer) {
              setTimeout(() => this.messages = messages, item.timer);
            }
          }, index * (item.timer ?? this.defaultTimer));
        });
      } else {
        messageElement.innerHTML = messages ?? WaitingScreen.defaultMessage;
      }
    }
  }

  private defaultTimerMessages(messages: Array<IWaitingScreen> | string): IWaitingScreen[] | string {
    return typeof messages !== 'string' ? messages?.map((message: IWaitingScreen, index: number) => {
      let result: IWaitingScreen = message;
      if (index) {
        result = {message: message.message, timer: message.timer ?? this.defaultTimer};
      }
      return result;
    }) : messages;
  }

  private createElement(content: any): void {
    const messageElement: HTMLElement | null = document.getElementById('wait-message-id');
    if (!messageElement) {
      const element: HTMLDivElement = document.createElement('div');
      element.className = 'wait-screen d-flex justify-content-center align-items-center';
      element.id = 'screen-waiting-id';
      element.style.opacity = '0';
      element.insertAdjacentElement('afterbegin', content);
      document.body.appendChild(element);
      setTimeout(() => element.style.opacity = '1');
    }
  }
}

export interface IWaitingScreen {
  message: string,
  timer?: number
}
